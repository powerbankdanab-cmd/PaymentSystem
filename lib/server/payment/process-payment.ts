import {
  acquirePhonePaymentLock,
  releaseReservation,
  releasePhonePaymentLock,
  reserveBattery,
} from "@/lib/server/payment/battery-lock";
import { HttpError } from "@/lib/server/payment/errors";
import {
  getAvailableBattery,
  markProblemSlot,
  queryStationBatteries,
  releaseBattery,
} from "@/lib/server/payment/heycharge";
import { isPhoneBlacklisted } from "@/lib/server/payment/blacklist";
import {
  createRentalLog,
  hasActiveRentalForPhone,
  isDuplicateTransaction,
  markRentalReturnedAfterFailedUnlock,
  updateRentalUnlockStatus,
} from "@/lib/server/payment/rentals";
import { getActiveStationCode, getStationImei } from "@/lib/server/payment/station";
import { notifyPaidButNotEjected } from "@/lib/server/payment/telegram";
import { PaymentInput, PaymentPayload } from "@/lib/server/payment/types";
import {
  extractWaafiIds,
  isWaafiApproved,
  requestWaafiPayment,
} from "@/lib/server/payment/waafi";

const MAX_UNLOCK_ATTEMPTS = 2;
const UNLOCK_RETRY_DELAY_MS = 1_500;

type BatteryPresence = "present" | "missing" | "unknown";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkBatteryPresence(
  imei: string,
  batteryId: string,
  slotId: string,
): Promise<BatteryPresence> {
  try {
    const stationBatteries = await queryStationBatteries(imei);
    const stillThere = stationBatteries.some(
      (battery) =>
        battery.battery_id === batteryId && battery.slot_id === slotId,
    );

    return stillThere ? "present" : "missing";
  } catch (error) {
    console.warn(
      "Failed to recheck slot status after unlock attempt:",
      error instanceof Error ? error.message : error,
    );
    return "unknown";
  }
}

export async function processPayment(
  input: PaymentInput,
): Promise<PaymentPayload> {
  const phoneNumber = input.phoneNumber.replace(/\D/g, "");
  const { amount } = input;

  const blacklisted = await isPhoneBlacklisted(phoneNumber);
  if (blacklisted) {
    throw new HttpError(
      403,
      "You are blocked from renting. Please contact support.",
    );
  }

  const imei = await getStationImei();
  const stationCode = await getActiveStationCode();
  const phoneLockAcquired = await acquirePhonePaymentLock(phoneNumber);
  if (!phoneLockAcquired) {
    throw new HttpError(
      409,
      "A payment for this phone is already being processed. Please wait a moment before trying again.",
    );
  }

  let reservedBatteryId: string | null = null;

  try {
    const hasActiveRental = await hasActiveRentalForPhone(phoneNumber);
    if (hasActiveRental) {
      throw new HttpError(
        409,
        "You already have an active rental. Please return it before renting another battery.",
      );
    }

    // ── Atomic battery reservation ────────────────────────────────
    // Try up to 3 different batteries in case another user reserves
    // the first one between our query and our reservation attempt.
    const MAX_RESERVE_ATTEMPTS = 3;
    let battery = null;

    for (let attempt = 0; attempt < MAX_RESERVE_ATTEMPTS; attempt++) {
      const candidate = await getAvailableBattery(imei);
      if (!candidate) break;

      const reserved = await reserveBattery(
        imei,
        candidate.battery_id,
        phoneNumber,
      );
      if (reserved) {
        battery = candidate;
        reservedBatteryId = candidate.battery_id;
        break;
      }
      console.warn(
        `Reserve attempt ${attempt + 1}: battery ${candidate.battery_id} already taken, trying next`,
      );
    }

    if (!battery) {
      throw new HttpError(400, "No available battery ≥ 60%");
    }

    // ── Payment ───────────────────────────────────────────────────
    const waafiResponse = await requestWaafiPayment({
      phoneNumber,
      amount,
    });

    if (!isWaafiApproved(waafiResponse)) {
      throw new HttpError(400, "Payment not approved", {
        waafiResponse,
        waafiMsg: waafiResponse.responseMsg || "",
      });
    }

    const { transactionId, issuerTransactionId, referenceId } =
      extractWaafiIds(waafiResponse);

    if (transactionId) {
      const duplicate = await isDuplicateTransaction(transactionId);
      if (duplicate) {
        return {
          success: true,
          message: "Payment already processed",
          transactionId,
        };
      }
    }

    const rentalRef = await createRentalLog({
      imei,
      batteryId: battery.battery_id,
      slotId: battery.slot_id,
      phoneNumber,
      amount,
      transactionId,
      issuerTransactionId,
      referenceId,
    });

    // Rental is now in Firestore — release the short-lived reservation.
    // The active rental record itself now protects this battery from being
    // assigned to another user (via getActiveRentedBatteryIds).
    await releaseReservation(imei, battery.battery_id);
    reservedBatteryId = null;

    let unlock: unknown = null;
    let unlockAttempts = 0;
    let lastUnlockError: unknown = null;
    const currentBattery = battery;
    let lastKnownPresence: BatteryPresence = "unknown";

    for (let attempt = 1; attempt <= MAX_UNLOCK_ATTEMPTS; attempt++) {
      unlockAttempts = attempt;

      try {
        unlock = await releaseBattery({
          imei,
          batteryId: currentBattery.battery_id,
          slotId: currentBattery.slot_id,
        });
        lastUnlockError = null;
        break;
      } catch (unlockError) {
        lastUnlockError = unlockError;
        console.error(
          `Battery unlock failed on attempt ${attempt}/${MAX_UNLOCK_ATTEMPTS} for battery=${currentBattery.battery_id} phone=${phoneNumber} txn=${transactionId}:`,
          unlockError instanceof Error ? unlockError.message : unlockError,
        );

        lastKnownPresence = await checkBatteryPresence(
          imei,
          currentBattery.battery_id,
          currentBattery.slot_id,
        );

        if (lastKnownPresence === "missing") {
          console.error(
            `Battery ${currentBattery.battery_id} is no longer in slot ${currentBattery.slot_id} after unlock error — treating as successful eject`,
          );
          lastUnlockError = null;
          unlock = null;
          break;
        }

        if (attempt < MAX_UNLOCK_ATTEMPTS) {
          console.warn(
            `Battery ${currentBattery.battery_id} still not confirmed ejected after attempt ${attempt}; retrying in ${UNLOCK_RETRY_DELAY_MS}ms`,
          );
          await delay(UNLOCK_RETRY_DELAY_MS);
        }
      }
    }

    if (lastUnlockError) {
      if (lastKnownPresence !== "present") {
        lastKnownPresence = await checkBatteryPresence(
          imei,
          currentBattery.battery_id,
          currentBattery.slot_id,
        );
      }

      if (lastKnownPresence === "missing") {
        console.error(
          `Battery ${currentBattery.battery_id} not in slot ${currentBattery.slot_id} after unlock error — likely ejected successfully`,
        );
        await updateRentalUnlockStatus(rentalRef.id, "unlocked");

        return {
          success: true,
          battery_id: currentBattery.battery_id,
          slot_id: currentBattery.slot_id,
          unlock: null,
          waafiMessage: waafiResponse.responseMsg || "Payment successful",
          waafiResponse,
        };
      }

      await updateRentalUnlockStatus(rentalRef.id, "unlock_failed");

      const failureNote =
        lastKnownPresence === "present"
          ? `Unlock failed after ${unlockAttempts} attempts, battery still present`
          : `Unlock failed after ${unlockAttempts} attempts, slot status could not be rechecked`;

      if (lastKnownPresence === "present") {
        try {
          await markProblemSlot(
            imei,
            currentBattery.slot_id,
            currentBattery.battery_id,
            failureNote,
          );
          await markRentalReturnedAfterFailedUnlock(rentalRef.id, failureNote);
        } catch (recoveryError) {
          console.error(
            "Failed to mark problem slot or close failed unlock rental:",
            recoveryError instanceof Error
              ? recoveryError.message
              : recoveryError,
          );
        }
      }

      await notifyPaidButNotEjected({
        phoneNumber,
        amount,
        imei,
        stationCode,
        batteryId: currentBattery.battery_id,
        slotId: currentBattery.slot_id,
        transactionId,
        issuerTransactionId,
        referenceId,
        unlockAttempts,
        reason: failureNote,
      });

      throw new HttpError(
        502,
        "Payment was received but the battery could not be released. Please contact support.",
        {
          transactionId,
          batteryId: currentBattery.battery_id,
          slotId: currentBattery.slot_id,
          unlockAttempts,
        },
      );
    }

    await updateRentalUnlockStatus(rentalRef.id, "unlocked");

    return {
      success: true,
      battery_id: currentBattery.battery_id,
      slot_id: currentBattery.slot_id,
      unlock,
      waafiMessage: waafiResponse.responseMsg || "Payment successful",
      waafiResponse,
    };
  } finally {
    if (reservedBatteryId) {
      await releaseReservation(imei, reservedBatteryId);
    }
    await releasePhonePaymentLock(phoneNumber);
  }
}

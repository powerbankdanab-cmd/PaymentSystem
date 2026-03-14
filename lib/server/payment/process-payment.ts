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
  updateRentalUnlockStatus,
} from "@/lib/server/payment/rentals";
import { getStationImei } from "@/lib/server/payment/station";
import { PaymentInput, PaymentPayload } from "@/lib/server/payment/types";
import {
  extractWaafiIds,
  isWaafiApproved,
  requestWaafiPayment,
} from "@/lib/server/payment/waafi";

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
    const unlockAttempts = 1;
    let lastUnlockError: unknown = null;
    const currentBattery = battery;

    try {
      unlock = await releaseBattery({
        imei,
        batteryId: currentBattery.battery_id,
        slotId: currentBattery.slot_id,
      });
      lastUnlockError = null;
    } catch (unlockError) {
      lastUnlockError = unlockError;
      console.error(
        `Battery unlock failed for battery=${currentBattery.battery_id} phone=${phoneNumber} txn=${transactionId}:`,
        unlockError instanceof Error ? unlockError.message : unlockError,
      );

      try {
        const recheckBatteries = await queryStationBatteries(imei);
        const stillThere = recheckBatteries.find(
          (b) =>
            b.battery_id === currentBattery.battery_id &&
            b.slot_id === currentBattery.slot_id,
        );

        if (!stillThere) {
          console.error(
            `Battery ${currentBattery.battery_id} is no longer in slot ${currentBattery.slot_id} after unlock error — treating as successful eject`,
          );
          lastUnlockError = null;
          unlock = null;
        }
      } catch (recheckError) {
        console.warn(
          "Failed to recheck slot status after unlock error:",
          recheckError instanceof Error ? recheckError.message : recheckError,
        );
      }
    }

    if (lastUnlockError) {
      await updateRentalUnlockStatus(rentalRef.id, "unlock_failed");

      // Recheck slot status: is the battery still there?
      try {
        const recheckBatteries = await queryStationBatteries(imei);
        const stillThere = recheckBatteries.find(
          (b) =>
            b.battery_id === currentBattery.battery_id &&
            b.slot_id === currentBattery.slot_id,
        );

        if (stillThere) {
          // Battery is still in the slot — this is a problem slot
          await markProblemSlot(
            imei,
            currentBattery.slot_id,
            currentBattery.battery_id,
            `Unlock failed after ${unlockAttempts} attempts, battery still present`,
          );
        } else {
          // Battery was ejected despite the error — update rental to unlocked
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
      } catch (recheckError) {
        console.error(
          "Failed to recheck slot status after unlock failure:",
          recheckError instanceof Error ? recheckError.message : recheckError,
        );
      }

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

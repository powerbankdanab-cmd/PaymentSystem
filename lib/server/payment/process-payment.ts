import { HttpError } from "@/lib/server/payment/errors";
import {
  getAvailableBattery,
  releaseBattery,
} from "@/lib/server/payment/heycharge";
import { isPhoneBlacklisted } from "@/lib/server/payment/blacklist";
import {
  createRentalLog,
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
  const { phoneNumber, amount } = input;

  const blacklisted = await isPhoneBlacklisted(phoneNumber);
  if (blacklisted) {
    throw new HttpError(
      403,
      "You are blocked from renting. Please contact support.",
    );
  }

  const imei = await getStationImei();

  const battery = await getAvailableBattery(imei);
  if (!battery) {
    throw new HttpError(400, "No available battery ≥ 60%");
  }

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

  let unlock: unknown = null;
  let unlockAttempts = 0;
  const MAX_UNLOCK_ATTEMPTS = 5;
  let lastUnlockError: unknown = null;
  let currentBattery = battery;

  while (unlockAttempts < MAX_UNLOCK_ATTEMPTS) {
    unlockAttempts++;

    if (unlockAttempts > 1) {
      try {
        const freshBattery = await getAvailableBattery(imei);
        if (freshBattery) {
          currentBattery = freshBattery;
          console.log(
            `Retry ${unlockAttempts}: using fresh battery=${freshBattery.battery_id} slot=${freshBattery.slot_id} for phone=${phoneNumber}`,
          );
        } else {
          console.warn(
            `Retry ${unlockAttempts}: no fresh battery found, retrying with original battery=${currentBattery.battery_id}`,
          );
        }
      } catch (queryError) {
        console.warn(
          `Retry ${unlockAttempts}: failed to re-query batteries, retrying with current battery=${currentBattery.battery_id}:`,
          queryError instanceof Error ? queryError.message : queryError,
        );
      }
    }

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
        `Battery unlock attempt ${unlockAttempts}/${MAX_UNLOCK_ATTEMPTS} failed for battery=${currentBattery.battery_id} phone=${phoneNumber} txn=${transactionId}:`,
        unlockError instanceof Error ? unlockError.message : unlockError,
      );

      if (unlockAttempts < MAX_UNLOCK_ATTEMPTS) {
        const backoffMs = Math.min(2000 * unlockAttempts, 8000);
        await new Promise((r) => setTimeout(r, backoffMs));
      }
    }
  }

  if (lastUnlockError) {
    await updateRentalUnlockStatus(rentalRef.id, "unlock_failed");

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
}

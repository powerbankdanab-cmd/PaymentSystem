import { HttpError } from "@/lib/server/payment/errors";
import {
  getAvailableBattery,
  releaseBattery,
} from "@/lib/server/payment/heycharge";
import { isPhoneBlacklisted } from "@/lib/server/payment/blacklist";
import {
  createRentalLog,
  isDuplicateTransaction,
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
    throw new HttpError(400, "Payment not approved", { waafiResponse });
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
  const MAX_UNLOCK_ATTEMPTS = 3;

  while (unlockAttempts < MAX_UNLOCK_ATTEMPTS) {
    unlockAttempts++;
    try {
      unlock = await releaseBattery({
        imei,
        batteryId: battery.battery_id,
        slotId: battery.slot_id,
      });
      break;
    } catch (unlockError) {
      if (unlockAttempts >= MAX_UNLOCK_ATTEMPTS) {
        console.error(
          `Battery unlock failed after ${MAX_UNLOCK_ATTEMPTS} attempts for phone=${phoneNumber} txn=${transactionId}:`,
          unlockError instanceof Error ? unlockError.message : unlockError,
        );
      } else {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  }

  return {
    success: true,
    battery_id: battery.battery_id,
    slot_id: battery.slot_id,
    unlock,
    waafiMessage: waafiResponse.responseMsg || "Payment successful",
    waafiResponse,
  };
}

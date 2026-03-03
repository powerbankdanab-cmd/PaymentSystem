import { HttpError } from "@/lib/server/payment/errors";
import { getAvailableBattery, releaseBattery } from "@/lib/server/payment/heycharge";
import { isPhoneBlacklisted } from "@/lib/server/payment/blacklist";
import { createRentalLog, isDuplicateTransaction } from "@/lib/server/payment/rentals";
import { getStationImei } from "@/lib/server/payment/station";
import { PaymentInput, PaymentPayload } from "@/lib/server/payment/types";
import { extractWaafiIds, isWaafiApproved, requestWaafiPayment } from "@/lib/server/payment/waafi";

export async function processPayment(input: PaymentInput): Promise<PaymentPayload> {
  const { phoneNumber, amount } = input;

  const blacklisted = await isPhoneBlacklisted(phoneNumber);
  if (blacklisted) {
    throw new HttpError(403, "You are blocked from renting. Please contact support.");
  }

  const imei = getStationImei();

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

  const { transactionId, issuerTransactionId, referenceId } = extractWaafiIds(waafiResponse);

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

  try {
    const unlock = await releaseBattery({
      imei,
      batteryId: battery.battery_id,
      slotId: battery.slot_id,
    });

    return {
      success: true,
      battery_id: battery.battery_id,
      slot_id: battery.slot_id,
      unlock,
      waafiMessage: waafiResponse.responseMsg || "Payment successful",
      waafiResponse,
    };
  } catch (unlockError) {
    await rentalRef.delete();

    const unlockErrorMessage =
      unlockError instanceof Error ? unlockError.message : "Battery unlock failed";

    throw new HttpError(500, "Battery unlock failed", {
      details: unlockErrorMessage,
    });
  }
}

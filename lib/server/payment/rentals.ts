import { Timestamp } from "firebase-admin/firestore";

import { getDb } from "@/lib/server/firebase-admin";
import { getActiveStationCode } from "@/lib/server/payment/station";

export async function isDuplicateTransaction(transactionId: string) {
  const existing = await getDb()
    .collection("rentals")
    .where("transactionId", "==", transactionId)
    .limit(1)
    .get();

  return !existing.empty;
}

export async function createRentalLog({
  imei,
  batteryId,
  slotId,
  phoneNumber,
  amount,
  transactionId,
  issuerTransactionId,
  referenceId,
}: {
  imei: string;
  batteryId: string;
  slotId: string;
  phoneNumber: string;
  amount: number;
  transactionId: string | null;
  issuerTransactionId: string | null;
  referenceId: string | null;
}) {
  const stationCode = await getActiveStationCode();

  return getDb().collection("rentals").add({
    imei,
    stationCode,
    battery_id: batteryId,
    slot_id: slotId,
    phoneNumber,
    amount,
    status: "rented",
    unlockStatus: "pending",
    transactionId,
    issuerTransactionId,
    referenceId,
    timestamp: Timestamp.now(),
  });
}

export async function updateRentalUnlockStatus(
  rentalId: string,
  unlockStatus: "unlocked" | "unlock_failed",
) {
  return getDb().collection("rentals").doc(rentalId).update({
    unlockStatus,
    unlockUpdatedAt: Timestamp.now(),
  });
}

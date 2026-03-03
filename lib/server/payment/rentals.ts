import { Timestamp } from "firebase-admin/firestore";

import { getDb } from "@/lib/server/firebase-admin";
import { ACTIVE_STATION_CODE } from "@/lib/server/payment/station";

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
  return getDb().collection("rentals").add({
    imei,
    stationCode: ACTIVE_STATION_CODE,
    battery_id: batteryId,
    slot_id: slotId,
    phoneNumber,
    amount,
    status: "rented",
    transactionId,
    issuerTransactionId,
    referenceId,
    timestamp: Timestamp.now(),
  });
}

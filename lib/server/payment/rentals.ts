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

export async function markRentalReturnedAfterFailedUnlock(
  rentalId: string,
  note: string,
) {
  return getDb().collection("rentals").doc(rentalId).update({
    status: "returned",
    returnedAt: Timestamp.now(),
    note,
  });
}

const FIRESTORE_IN_QUERY_LIMIT = 10;

function chunkValues<T>(values: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }

  return chunks;
}

/**
 * Get battery IDs from the provided candidate list that currently have any
 * active rental (status="rented"), regardless of which station created it.
 * This prevents cross-station duplicate assignment if a battery was returned
 * to a different station before the old rental got closed.
 */
export async function getActiveRentedBatteryIds(
  batteryIds: string[],
): Promise<Set<string>> {
  const uniqueBatteryIds = Array.from(
    new Set(batteryIds.filter((batteryId) => !!batteryId)),
  );

  if (uniqueBatteryIds.length === 0) {
    return new Set<string>();
  }

  const activeIds = new Set<string>();

  for (const batteryIdChunk of chunkValues(
    uniqueBatteryIds,
    FIRESTORE_IN_QUERY_LIMIT,
  )) {
    const snap = await getDb()
      .collection("rentals")
      .where("battery_id", "in", batteryIdChunk)
      .get();

    for (const doc of snap.docs) {
      const data = doc.data();
      if (data.status === "rented" && data.battery_id) {
        activeIds.add(data.battery_id);
      }
    }
  }

  return activeIds;
}

/**
 * Check whether this phone number already has any active rental.
 * Uses a single-field query so no extra composite index is required.
 */
export async function hasActiveRentalForPhone(
  phoneNumber: string,
): Promise<boolean> {
  const snap = await getDb()
    .collection("rentals")
    .where("phoneNumber", "==", phoneNumber)
    .get();

  return snap.docs.some((doc) => doc.data().status === "rented");
}

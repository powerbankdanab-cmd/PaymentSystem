import { getRequiredEnv } from "@/lib/server/env";

import { getDb } from "@/lib/server/firebase-admin";
import { parseResponseBody, toErrorMessage } from "@/lib/server/payment/http";
import { Battery } from "@/lib/server/payment/types";

type HeyChargeStationResponse = {
  batteries?: Battery[];
};

const HEYCHARGE_QUERY_TIMEOUT_MS = 12_000;
const HEYCHARGE_UNLOCK_TIMEOUT_MS = 25_000;

function buildHeyChargeAuthHeader() {
  const apiKey = getRequiredEnv("HEYCHARGE_API_KEY");
  const basicToken = Buffer.from(`${apiKey}:`).toString("base64");
  return `Basic ${basicToken}`;
}

export async function getAvailableBattery(imei: string) {
  const domain = getRequiredEnv("HEYCHARGE_DOMAIN");
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, HEYCHARGE_QUERY_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${domain}/v1/station/${imei}`, {
      headers: {
        Authorization: buildHeyChargeAuthHeader(),
      },
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Station query timed out");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const payload = (await parseResponseBody(response)) as
    | HeyChargeStationResponse
    | string
    | null;

  if (!response.ok) {
    throw new Error(
      toErrorMessage(payload, "Failed to query station batteries"),
    );
  }

  const payloadObject =
    payload && typeof payload === "object"
      ? (payload as HeyChargeStationResponse)
      : null;

  const batteries = Array.isArray(payloadObject?.batteries)
    ? payloadObject.batteries
    : [];

  const hardwareAvailable = batteries
    .filter(
      (battery) =>
        battery.lock_status === "1" &&
        Number.parseInt(battery.battery_capacity, 10) >= 60 &&
        battery.battery_abnormal === "0" &&
        battery.cable_abnormal === "0",
    )
    .sort(
      (a, b) =>
        Number.parseInt(b.battery_capacity, 10) -
        Number.parseInt(a.battery_capacity, 10),
    );

  // Filter out batteries that already have an active rental in Firestore
  const rentedSnap = await getDb()
    .collection("rentals")
    .where("imei", "==", imei)
    .where("status", "==", "rented")
    .get();

  const rentedBatteryIds = new Set<string>();
  for (const doc of rentedSnap.docs) {
    const bid = doc.data().battery_id;
    if (bid) rentedBatteryIds.add(bid);
  }

  const available = hardwareAvailable.filter(
    (battery) => !rentedBatteryIds.has(battery.battery_id),
  );

  return available[0] || null;
}

export async function releaseBattery({
  imei,
  batteryId,
  slotId,
}: {
  imei: string;
  batteryId: string;
  slotId: string;
}) {
  const domain = getRequiredEnv("HEYCHARGE_DOMAIN");
  const url = new URL(`${domain}/v1/station/${imei}`);
  url.searchParams.set("battery_id", batteryId);
  url.searchParams.set("slot_id", slotId);

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: buildHeyChargeAuthHeader(),
      },
      cache: "no-store",
    });
  } catch (error) {
    throw error;
  }

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    throw new Error(toErrorMessage(payload, "Battery unlock failed"));
  }

  return payload;
}

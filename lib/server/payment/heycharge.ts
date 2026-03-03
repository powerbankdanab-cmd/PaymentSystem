import { getRequiredEnv } from "@/lib/server/env";

import { parseResponseBody, toErrorMessage } from "@/lib/server/payment/http";
import { Battery } from "@/lib/server/payment/types";

type HeyChargeStationResponse = {
  batteries?: Battery[];
};

function buildHeyChargeAuthHeader() {
  const apiKey = getRequiredEnv("HEYCHARGE_API_KEY");
  const basicToken = Buffer.from(`${apiKey}:`).toString("base64");
  return `Basic ${basicToken}`;
}

export async function getAvailableBattery(imei: string) {
  const domain = getRequiredEnv("HEYCHARGE_DOMAIN");
  const response = await fetch(`${domain}/v1/station/${imei}`, {
    headers: {
      Authorization: buildHeyChargeAuthHeader(),
    },
    cache: "no-store",
  });

  const payload = (await parseResponseBody(response)) as HeyChargeStationResponse | string | null;

  if (!response.ok) {
    throw new Error(toErrorMessage(payload, "Failed to query station batteries"));
  }

  const payloadObject =
    payload && typeof payload === "object" ? (payload as HeyChargeStationResponse) : null;

  const batteries = Array.isArray(payloadObject?.batteries) ? payloadObject.batteries : [];

  const available = batteries
    .filter(
      (battery) =>
        battery.lock_status === "1" &&
        Number.parseInt(battery.battery_capacity, 10) >= 60 &&
        battery.battery_abnormal === "0" &&
        battery.cable_abnormal === "0",
    )
    .sort(
      (a, b) =>
        Number.parseInt(b.battery_capacity, 10) - Number.parseInt(a.battery_capacity, 10),
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

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: buildHeyChargeAuthHeader(),
    },
    cache: "no-store",
  });

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    throw new Error(toErrorMessage(payload, "Battery unlock failed"));
  }

  return payload;
}

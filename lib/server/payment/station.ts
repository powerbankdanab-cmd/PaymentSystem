import { getRequiredEnv } from "@/lib/server/env";

export const ACTIVE_STATION_CODE = "58";

export function getStationImei() {
  return getRequiredEnv("STATION_CASTELLO_TALEEX");
}

export type StationConfig = {
  code: string;
  imei: string;
  name: string;
};

export const STATION_CONFIGS: Record<string, StationConfig> = {
  "station58.danab.com": {
    code: "58",
    imei: process.env.STATION_58_IMEI || "",
    name: "Castello Taleex",
  },
  "station59.danab.com": {
    code: "59",
    imei: process.env.STATION_59_IMEI || "",
    name: "Station 59",
  },
  "station60.danab.com": {
    code: "60",
    imei: process.env.STATION_60_IMEI || "",
    name: "Station 60",
  },
  "station61.danab.com": {
    code: "61",
    imei: process.env.STATION_61_IMEI || "",
    name: "Station 61",
  },
};

export function getStationConfigByDomain(hostname: string): StationConfig | null {
  const config = STATION_CONFIGS[hostname.toLowerCase()];
  if (config) {
    return config;
  }

  const subdomain = hostname.split(".")[0];
  const stationNumber = subdomain.replace(/\D/g, "");
  if (stationNumber) {
    const envImei = process.env[`STATION_${stationNumber}_IMEI`];
    if (envImei) {
      return {
        code: stationNumber,
        imei: envImei,
        name: `Station ${stationNumber}`,
      };
    }
  }

  if (process.env.STATION_CODE && process.env.STATION_IMEI) {
    return {
      code: process.env.STATION_CODE,
      imei: process.env.STATION_IMEI,
      name: process.env.STATION_NAME || `Station ${process.env.STATION_CODE}`,
    };
  }

  return null;
}

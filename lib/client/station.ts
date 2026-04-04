const STATION_NAMES: Record<string, string> = {
  "58": "Danab-Cafe Castello\nTaleex",
  "59": "Danab-Feynuus\nBowling",
  "60": "Danab-Java\nTaleex",
  "61": "Danab-Delik\nSomalia",
  "62": "Danab-Arena Cafe\nMogadishu",
};

export function getStationCode(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const hostname = window.location.hostname;

  // Extract station number from subdomain (e.g., station58.danab.site -> 58)
  const subdomain = hostname.split(".")[0];
  const stationNumber = subdomain.replace(/\D/g, "");

  if (stationNumber && STATION_NAMES[stationNumber]) {
    return stationNumber;
  }

  return "";
}

export function getStationName(): string {
  const stationCode = getStationCode();
  if (stationCode && STATION_NAMES[stationCode]) {
    return STATION_NAMES[stationCode];
  }

  return "Danab Power Bank";
}

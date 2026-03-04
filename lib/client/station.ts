const STATION_NAMES: Record<string, string> = {
  "58": "Cafe Castello Taleex",
  "59": "Cafe Castello Boondhere",
  "60": "Cafe Java Taleex",
  "61": "Cafe Java Airport",
  "62": "Cafe Dilek Somalia",
};

export function getStationName(): string {
  if (typeof window === "undefined") {
    return "Danab Power Bank";
  }

  const hostname = window.location.hostname;
  
  // Extract station number from subdomain (e.g., station58.danab.site -> 58)
  const subdomain = hostname.split(".")[0];
  const stationNumber = subdomain.replace(/\D/g, "");
  
  if (stationNumber && STATION_NAMES[stationNumber]) {
    return STATION_NAMES[stationNumber];
  }
  
  return "Danab Power Bank";
}

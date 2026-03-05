"use client";

import { getStationName } from "@/lib/client/station";

export function TimeOptions(props: any) {
  const stationName = getStationName();
  const nameLines = stationName.split("\n");

  return (
    <>
      <div className="mx-3 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-3 text-center text-white shadow-md sm:mx-4 sm:px-5 sm:py-4">
        <h1 className="text-base font-black leading-tight sm:text-lg">
          {nameLines[0]}
          {nameLines[1] && (
            <>
              <br />
              {nameLines[1]}
            </>
          )}
        </h1>
      </div>
    </>
  );
}

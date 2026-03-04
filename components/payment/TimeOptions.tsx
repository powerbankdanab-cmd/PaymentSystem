"use client";

import { ClockIcon, TimerIcon } from "@/components/payment/Icons";
import { cn, formatAmount } from "@/components/payment/helpers";
import { TimeOption } from "@/components/payment/types";
import { getStationName } from "@/lib/client/station";

export function TimeOptions({
  options,
  selectedAmount,
  onSelect,
}: {
  options: TimeOption[];
  selectedAmount: number;
  onSelect: (amount: number) => void;
}) {
  const stationName = getStationName();
  const nameLines = stationName.split("\n");

  return (
    <>
      <div className="rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-500 px-4 py-5 text-center text-white shadow-lg sm:px-6 sm:py-6">
        <h1 className="text-lg font-black leading-tight sm:text-xl">
          {nameLines[0]}
          {nameLines[1] && (
            <>
              <br />
              {nameLines[1]}
            </>
          )}
        </h1>
        <p className="mt-2 text-sm font-medium text-white/90">
          Dooro Muddada kugu habboon
        </p>
      </div>

      <div className="mx-auto mt-4 grid max-w-[100px] grid-cols-1 gap-3 px-3 sm:mt-5 sm:max-w-[110px] sm:gap-4 sm:px-4">
        {options.map((time) => {
          const isSelected = selectedAmount === time.amount;

          return (
            <button
              key={time.label}
              onClick={() => onSelect(time.amount)}
              className={cn(
                "group relative overflow-hidden rounded-xl p-2 text-center shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] sm:p-2.5",
                isSelected
                  ? "border-2 border-pink-500 bg-white"
                  : "border-2 border-gray-200 bg-gray-50 hover:border-pink-300",
              )}
            >
              <div className="relative z-10">
                {time.icon === "clock" ? (
                  <ClockIcon className="mx-auto mb-1 h-6 w-6 text-pink-500" />
                ) : (
                  <TimerIcon className="mx-auto mb-1 h-6 w-6 text-pink-500" />
                )}

                <p
                  className={cn(
                    "text-xs font-bold sm:text-sm",
                    isSelected ? "text-pink-500" : "text-gray-700",
                  )}
                >
                  {time.label}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-xs font-medium",
                    isSelected ? "text-pink-400" : "text-gray-500",
                  )}
                >
                  {formatAmount(time.amount)}
                </p>
              </div>

              {isSelected && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full border border-pink-500 bg-white text-[8px] text-pink-500">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

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
      <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-5 text-center text-white shadow-lg sm:px-6 sm:py-6">
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

      <div className="mx-auto mt-4 grid w-[200px] grid-cols-1 gap-3 sm:mt-5 sm:w-[210px] sm:gap-4">
        {options.map((time) => {
          const isSelected = selectedAmount === time.amount;

          return (
            <button
              key={time.label}
              onClick={() => onSelect(time.amount)}
              className={cn(
                "group relative flex h-[50px] items-center justify-center gap-2 overflow-hidden rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] sm:h-[60px]",
                isSelected
                  ? "border-2 border-emerald-400 bg-white"
                  : "border-2 border-gray-200 bg-gray-50 hover:border-violet-300",
              )}
            >
              {time.icon === "clock" ? (
                <ClockIcon className="h-5 w-5 shrink-0 text-emerald-500 sm:h-6 sm:w-6" />
              ) : (
                <TimerIcon className="h-5 w-5 shrink-0 text-emerald-500 sm:h-6 sm:w-6" />
              )}
              <span
                className={cn(
                  "text-sm font-bold sm:text-base",
                  isSelected ? "text-violet-600" : "text-gray-700",
                )}
              >
                {formatAmount(time.amount)}
              </span>

              {isSelected && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full border border-emerald-400 bg-white text-[8px] text-emerald-500">
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

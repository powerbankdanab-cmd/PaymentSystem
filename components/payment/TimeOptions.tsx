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

      <div className="mt-4 grid grid-cols-2 gap-3 px-3 sm:mt-5 sm:gap-4 sm:px-4">
        {options.map((time) => {
          const isSelected = selectedAmount === time.amount;

          return (
            <button
              key={time.label}
              onClick={() => onSelect(time.amount)}
              className={cn(
                "group relative overflow-hidden rounded-2xl p-4 text-center shadow-lg transition-all hover:scale-[1.03] active:scale-[0.98] sm:p-5",
                isSelected
                  ? "bg-gradient-to-br from-pink-500 to-purple-600 shadow-pink-500/30"
                  : "bg-gradient-to-br from-slate-700 to-slate-800 shadow-slate-900/20 hover:from-slate-600 hover:to-slate-700",
              )}
            >
              <div className="relative z-10">
                <div
                  className={cn(
                    "mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                    isSelected ? "bg-white/20" : "bg-white/10",
                  )}
                >
                  {time.icon === "clock" ? (
                    <ClockIcon
                      className={cn(
                        "h-6 w-6",
                        isSelected ? "text-white" : "text-pink-400",
                      )}
                    />
                  ) : (
                    <TimerIcon
                      className={cn(
                        "h-6 w-6",
                        isSelected ? "text-white" : "text-pink-400",
                      )}
                    />
                  )}
                </div>

                <p className="text-base font-bold text-white sm:text-lg">
                  {time.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-white/90">
                  {formatAmount(time.amount)}
                </p>
              </div>

              {isSelected && (
                <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-pink-600 shadow-md">
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

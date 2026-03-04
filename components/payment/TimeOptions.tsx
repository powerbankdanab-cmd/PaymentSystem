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
      <div className="rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-500 px-6 py-6 text-center text-white shadow-lg">
        <h1 className="text-xl font-black leading-tight">
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

      <div className="mt-5 grid grid-cols-2 gap-4 px-4">
        {options.map((time) => {
          const isSelected = selectedAmount === time.amount;

          return (
            <button
              key={time.label}
              onClick={() => onSelect(time.amount)}
              className={cn(
                "relative rounded-2xl p-5 text-center shadow-sm transition-all hover:scale-[1.02]",
                isSelected
                  ? "border-2 border-pink-500 bg-white dark:bg-slate-700"
                  : "border-2 border-gray-200 bg-white dark:border-slate-600/50 dark:bg-slate-700/70",
              )}
            >
              {time.icon === "clock" ? <ClockIcon /> : <TimerIcon />}

              <p
                className={cn(
                  "text-sm font-bold",
                  isSelected
                    ? "text-pink-500"
                    : "text-slate-700 dark:text-slate-200",
                )}
              >
                {time.label}
              </p>
              <p
                className={cn(
                  "text-xs",
                  isSelected
                    ? "text-pink-400"
                    : "text-slate-500 dark:text-slate-300",
                )}
              >
                {formatAmount(time.amount)}
              </p>

              {isSelected && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-pink-500 text-pink-500">
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

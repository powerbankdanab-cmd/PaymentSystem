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
      <div className="rounded-b-2xl bg-gradient-to-r from-pink-500 to-indigo-500 px-4 py-5 text-center text-white shadow-lg">
        <h1 className="text-xl font-black leading-tight">
          {nameLines[0]}
          {nameLines[1] && (
            <>
              <br />
              {nameLines[1]}
            </>
          )}
        </h1>
        <p className="mt-1 text-sm text-white/90">Dooro Muddada kugu habboon</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 px-3">
        {options.map((time) => {
          const isSelected = selectedAmount === time.amount;

          return (
            <button
              key={time.label}
              onClick={() => onSelect(time.amount)}
              className={cn(
                "relative rounded-xl p-4 text-center shadow-sm transition hover:scale-[1.02]",
                isSelected
                  ? "border-2 border-pink-500 bg-white dark:bg-slate-700"
                  : "border border-transparent bg-slate-100/80 dark:bg-slate-700/70",
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

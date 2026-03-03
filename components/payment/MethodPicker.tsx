"use client";

import { cn } from "@/components/payment/helpers";
import { PaymentMethod } from "@/components/payment/types";

export function MethodPicker({
  methods,
  selectedMethod,
  onSelect,
}: {
  methods: PaymentMethod[];
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}) {
  return (
    <div className="mx-3 mt-6">
      <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
        Habka Lacag Bixinta
      </p>
      <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
        {methods.map((method) => {
          const isActive = selectedMethod === method;
          return (
            <button
              key={method}
              onClick={() => onSelect(method)}
              className={cn(
                "rounded-full border px-3 py-2 shadow-sm transition",
                isActive
                  ? "border-pink-400 bg-pink-100 text-pink-800 dark:border-pink-500 dark:bg-pink-700 dark:text-pink-100"
                  : "border-transparent bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200",
              )}
            >
              {method}
            </button>
          );
        })}
      </div>
    </div>
  );
}

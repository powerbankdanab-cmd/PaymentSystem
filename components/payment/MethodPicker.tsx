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
    <div className="mx-3 mt-6 sm:mx-4">
      <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
        Habka Lacag Bixinta
      </p>
      <div className="grid grid-cols-3 gap-2.5 text-xs font-bold sm:gap-3">
        {methods.map((method) => {
          const isActive = selectedMethod === method;
          return (
            <button
              key={method}
              onClick={() => onSelect(method)}
              className={cn(
                "rounded-full px-3 py-2.5 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] sm:px-4 sm:py-3",
                isActive
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-pink-500/30"
                  : "bg-slate-700 text-slate-200 shadow-slate-900/20 hover:bg-slate-600",
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

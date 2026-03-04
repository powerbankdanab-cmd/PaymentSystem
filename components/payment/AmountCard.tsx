"use client";

import { formatAmount } from "@/components/payment/helpers";

export function AmountCard({ amount }: { amount: number }) {
  return (
    <div className="mx-3 mt-4 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 px-4 py-5 text-center shadow-xl shadow-purple-500/30 sm:mx-4 sm:mt-5 sm:px-6 sm:py-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-white/90">
        Amount to Pay:
      </p>
      <p className="mt-2 text-4xl font-black text-white drop-shadow-lg sm:text-5xl">
        {formatAmount(amount)}
      </p>
    </div>
  );
}

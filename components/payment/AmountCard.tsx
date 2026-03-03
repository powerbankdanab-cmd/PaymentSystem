"use client";

import { formatAmount } from "@/components/payment/helpers";

export function AmountCard({ amount }: { amount: number }) {
  return (
    <div className="mx-3 mt-6 rounded-xl bg-purple-200 px-4 py-4 text-center shadow dark:bg-purple-800/70">
      <p className="text-base font-semibold text-purple-800 dark:text-purple-200">Amount to Pay:</p>
      <p className="text-3xl font-black text-purple-900 dark:text-white">{formatAmount(amount)}</p>
    </div>
  );
}

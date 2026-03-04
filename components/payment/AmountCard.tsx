"use client";

import { formatAmount } from "@/components/payment/helpers";

export function AmountCard({ amount }: { amount: number }) {
  return (
    <div className="mx-4 mt-5 rounded-2xl bg-purple-100 px-6 py-5 text-center shadow-md dark:bg-purple-800/70">
      <p className="text-base font-bold text-purple-800 dark:text-purple-200">
        Amount to Pay:
      </p>
      <p className="mt-1 text-4xl font-black text-purple-700 dark:text-white">
        {formatAmount(amount)}
      </p>
    </div>
  );
}

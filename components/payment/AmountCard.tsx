"use client";

import { formatAmount } from "@/components/payment/helpers";

export function AmountCard({ amount }: { amount: number }) {
  return (
    <div className="mx-3 mt-4 rounded-2xl bg-purple-100 px-4 py-4 text-center shadow-md sm:mx-4 sm:mt-5 sm:px-6 sm:py-5 dark:bg-purple-800/70">
      <p className="text-base font-bold text-purple-800 dark:text-purple-200">
        Amount to Pay:
      </p>
      <p className="mt-1 text-3xl font-black text-purple-700 sm:text-4xl dark:text-white">
        {formatAmount(amount)}
      </p>
    </div>
  );
}

"use client";

import { ArrowRightIcon } from "@/components/payment/Icons";

export function PayButton({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <div className="mx-3 sm:mx-4">
      <button
        onClick={onClick}
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 px-4 py-4 text-lg font-bold text-white shadow-xl shadow-pink-500/30 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-pink-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 sm:py-4"
      >
        {loading ? "Processing..." : "Bixi Hadda"}
        <ArrowRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

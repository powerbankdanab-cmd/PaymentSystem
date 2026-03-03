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
    <div className="mx-3">
      <button
        onClick={onClick}
        disabled={loading}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 px-4 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Processing..." : "Bixi Hadda"}
        <ArrowRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

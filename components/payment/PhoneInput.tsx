"use client";

import { cn } from "@/components/payment/helpers";

export function PhoneInput({
  value,
  onChange,
  placeholder,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
}) {
  return (
    <div className="mx-3 mt-5 sm:mx-4">
      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        Telefoon Numberka
      </label>
      <div
        className={cn(
          "flex overflow-hidden rounded-xl shadow-lg transition-all focus-within:ring-2 focus-within:ring-pink-400 focus-within:shadow-pink-500/20",
          error
            ? "border-2 border-red-500 bg-red-50 dark:bg-red-900/20"
            : "bg-slate-100 dark:bg-slate-700",
        )}
      >
        <span className="flex items-center gap-2 bg-slate-700 px-4 py-3 text-sm font-semibold text-white">
          <span aria-hidden="true">🇸🇴</span>
          +252
        </span>
        <input
          type="tel"
          inputMode="numeric"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent px-3 py-3 text-sm font-medium outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
          placeholder={placeholder}
        />
      </div>
      {error && (
        <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Fadlan Gali Numberka lacagta la Dirayo
      </p>
    </div>
  );
}

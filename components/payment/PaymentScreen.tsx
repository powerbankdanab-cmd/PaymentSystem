"use client";

import { useState } from "react";

import { PaymentCard } from "@/components/payment/PaymentCard";
import { cn } from "@/components/payment/helpers";

export function PaymentScreen() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden px-3 py-6 transition-colors sm:px-4 sm:py-12",
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"
          : "bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50",
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-100px] top-[-80px] h-80 w-80 rounded-full bg-pink-400/20 blur-3xl" />
        <div className="absolute bottom-[-110px] right-[-70px] h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400/10 blur-3xl" />
      </div>

      <PaymentCard
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((prev) => !prev)}
      />
    </div>
  );
}

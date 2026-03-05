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
        darkMode ? "bg-slate-900" : "bg-gray-100",
      )}
    >
      {darkMode && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="absolute -right-16 top-1/2 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute bottom-10 left-1/3 h-48 w-48 rounded-full bg-violet-400/10 blur-3xl" />
        </div>
      )}
      <PaymentCard
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((prev) => !prev)}
      />
    </div>
  );
}

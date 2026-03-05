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
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : "bg-gray-100",
      )}
    >
      <PaymentCard
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((prev) => !prev)}
      />
    </div>
  );
}

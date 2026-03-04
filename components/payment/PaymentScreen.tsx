"use client";

import { useState } from "react";

import { PaymentCard } from "@/components/payment/PaymentCard";
import { cn } from "@/components/payment/helpers";

export function PaymentScreen() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden px-4 py-8 transition-colors sm:py-12",
        darkMode
          ? "bg-[radial-gradient(circle_at_top,#342352,#151527_40%,#090b14)]"
          : "bg-[#f5f5f7]",
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-100px] top-[-80px] h-72 w-72 rounded-full bg-pink-300/10 blur-3xl" />
        <div className="absolute bottom-[-110px] right-[-70px] h-72 w-72 rounded-full bg-indigo-300/10 blur-3xl" />
      </div>

      <PaymentCard
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((prev) => !prev)}
      />
    </div>
  );
}

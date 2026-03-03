"use client";

import { useEffect, useRef, useState } from "react";

import { AmountCard } from "@/components/payment/AmountCard";
import {
  DEFAULT_PAYMENT_RESULT,
  PAYMENT_METHODS,
  PHONE_PLACEHOLDER_BY_METHOD,
  TIME_OPTIONS,
} from "@/components/payment/constants";
import { cn, mapBackendErrorMessage, normalizePhone, validatePaymentInput } from "@/components/payment/helpers";
import { MethodPicker } from "@/components/payment/MethodPicker";
import { PayButton } from "@/components/payment/PayButton";
import { PaymentHeader } from "@/components/payment/PaymentHeader";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { PhoneInput } from "@/components/payment/PhoneInput";
import { RulesAgreement } from "@/components/payment/RulesAgreement";
import { TimeOptions } from "@/components/payment/TimeOptions";
import { PaymentMethod, PaymentResult } from "@/components/payment/types";

type ApiResponse = {
  success?: boolean;
  error?: string;
  blacklisted?: boolean;
  battery_id?: string;
  slot_id?: string;
  waafiMessage?: string;
};

async function safeReadJson(response: Response): Promise<ApiResponse> {
  try {
    const data = (await response.json()) as ApiResponse;
    return data;
  } catch {
    return {};
  }
}

export function PaymentCard({
  darkMode,
  onToggleTheme,
}: {
  darkMode: boolean;
  onToggleTheme: () => void;
}) {
  const [selectedAmount, setSelectedAmount] = useState(0.5);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("EVC Plus");
  const [phone, setPhone] = useState("");
  const [agreeRules, setAgreeRules] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; agreeRules?: string }>({});
  const [paymentResult, setPaymentResult] = useState<PaymentResult>(DEFAULT_PAYMENT_RESULT);

  const successResetTimerRef = useRef<number | null>(null);

  const clearSuccessTimer = () => {
    if (successResetTimerRef.current !== null) {
      window.clearTimeout(successResetTimerRef.current);
      successResetTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearSuccessTimer();
  }, []);

  const closeModal = () => {
    clearSuccessTimer();
    setPaymentResult(DEFAULT_PAYMENT_RESULT);
  };

  const handlePay = async () => {
    if (isSubmitting) {
      return;
    }

    const formErrors = validatePaymentInput(phone, agreeRules);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    const cleanPhone = normalizePhone(phone);

    setIsSubmitting(true);
    setPaymentResult({
      ...DEFAULT_PAYMENT_RESULT,
      open: true,
      status: "processing",
      statusMessage: "Hubinaya macluumaadka...",
    });

    try {
      const blacklistRes = await fetch(`/api/blacklist/check/${encodeURIComponent(cleanPhone)}`);
      const blacklistData = await safeReadJson(blacklistRes);

      if (!blacklistRes.ok) {
        throw new Error(blacklistData.error || "Failed to check blacklist status");
      }

      if (blacklistData.blacklisted) {
        setPaymentResult((prev) => ({
          ...prev,
          status: "failed",
          statusMessage: "",
          errorMessage: "Macamiil waxa kugu maqan battery hore fadlan soo celi midkaas",
        }));
        return;
      }

      setPaymentResult((prev) => ({ ...prev, statusMessage: "Diraya lacagta... Fadlan sug" }));

      const paymentRes = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: cleanPhone,
          amount: selectedAmount,
          method: selectedMethod,
        }),
      });

      const paymentData = await safeReadJson(paymentRes);

      if (paymentRes.ok && paymentData.success) {
        setPaymentResult((prev) => ({
          ...prev,
          status: "success",
          statusMessage: "",
          waafiMessage: paymentData.waafiMessage || "Lacag bixinta waa guulaysatay!",
          batteryInfo:
            paymentData.battery_id && paymentData.slot_id
              ? {
                  batteryId: paymentData.battery_id,
                  slotId: paymentData.slot_id,
                }
              : null,
        }));

        setPhone("");
        setAgreeRules(false);
        setErrors({});

        clearSuccessTimer();
        successResetTimerRef.current = window.setTimeout(() => {
          setPaymentResult(DEFAULT_PAYMENT_RESULT);
        }, 5000);
        return;
      }

      const backendError = mapBackendErrorMessage(paymentData.error || "Khalad dhacay, fadlan mar kale isku day");
      setPaymentResult((prev) => ({
        ...prev,
        status: "failed",
        statusMessage: "",
        errorMessage: backendError,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error, fadlan mar kale isku day.";
      setPaymentResult((prev) => ({
        ...prev,
        status: "failed",
        statusMessage: "",
        errorMessage: message,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className={cn(
        "relative mx-auto w-full max-w-md rounded-[28px] border p-5 shadow-[0_25px_70px_rgba(94,46,140,.25)] backdrop-blur-md",
        darkMode ? "border-white/10 bg-[#181828]/90 text-white" : "border-white/60 bg-white/90 text-slate-800",
      )}
    >
      <PaymentModal result={paymentResult} onClose={closeModal} />

      <PaymentHeader darkMode={darkMode} onToggleTheme={onToggleTheme} />

      <section className="rounded-2xl bg-white/60 pb-5 dark:bg-slate-900/20">
        <TimeOptions options={TIME_OPTIONS} selectedAmount={selectedAmount} onSelect={setSelectedAmount} />

        <AmountCard amount={selectedAmount} />

        <MethodPicker
          methods={PAYMENT_METHODS}
          selectedMethod={selectedMethod}
          onSelect={setSelectedMethod}
        />

        <PhoneInput
          value={phone}
          onChange={setPhone}
          placeholder={PHONE_PLACEHOLDER_BY_METHOD[selectedMethod]}
          error={errors.phone}
        />

        <RulesAgreement
          checked={agreeRules}
          onToggle={() => setAgreeRules((prev) => !prev)}
          error={errors.agreeRules}
        />

        <PayButton loading={isSubmitting} onClick={handlePay} />
      </section>

      <footer className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
        Call us any feedback or problem{" "}
        <span className="font-semibold text-slate-900 dark:text-white">616586503 / 616251068</span>
      </footer>
    </main>
  );
}

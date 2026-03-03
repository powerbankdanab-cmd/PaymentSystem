import { PaymentMethod, PaymentResult, TimeOption } from "@/components/payment/types";

export const TIME_OPTIONS: TimeOption[] = [
  { label: "1 Saac", amount: 0.5, icon: "clock" },
  { label: "2 Saac", amount: 1, icon: "timer" },
];

export const PAYMENT_METHODS: PaymentMethod[] = ["EVC Plus", "ZAAD", "SAHAL"];

export const PHONE_PLACEHOLDER_BY_METHOD: Record<PaymentMethod, string> = {
  "EVC Plus": "61 xxxxx",
  ZAAD: "63 xxxxx",
  SAHAL: "37 xxxxx",
};

export const DEFAULT_PAYMENT_RESULT: PaymentResult = {
  open: false,
  status: "processing",
  statusMessage: "",
  errorMessage: "",
  waafiMessage: "",
  batteryInfo: null,
};

import { PaymentErrors } from "@/components/payment/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatAmount(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

export function validatePaymentInput(phone: string, agreeRules: boolean): PaymentErrors {
  const errors: PaymentErrors = {};
  const cleanPhone = normalizePhone(phone);

  if (!cleanPhone || cleanPhone.length < 7) {
    errors.phone = "Fadlan gali number sax ah (ugu yaraan 7 digit)";
  }

  if (!agreeRules) {
    errors.agreeRules = "Fadlan ogolow shuruudaha isticmaalka";
  }

  return errors;
}

export function mapBackendErrorMessage(message: string) {
  if (message.includes("No available battery")) {
    return "Ma jiro baytari diyaar ah hadda, fadlan mar kale isku day";
  }

  if (message.includes("already have an active rental")) {
    return "Waxaad hore u haysataa battery, fadlan soo celi midkaas ka hor intaadan mid kale kireysanin";
  }

  if (message.includes("battery is already rented")) {
    return "Battery-gan waa la kireystay, fadlan mar kale isku day";
  }

  if (message.includes("blocked") || message.includes("blacklist")) {
    return "Macamiil waxa kugu maqan battery hore fadlan soo celi midkaas";
  }

  if (message.includes("Payment not approved")) {
    return "Lacag bixinta ma dhicin, fadlan hubi numberkaaga";
  }

  return message || "Khalad dhacay, fadlan mar kale isku day";
}

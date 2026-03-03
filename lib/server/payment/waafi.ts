import { getRequiredEnv } from "@/lib/server/env";

import { parseResponseBody, toErrorMessage } from "@/lib/server/payment/http";
import { WaafiResponse } from "@/lib/server/payment/types";

export async function requestWaafiPayment({
  phoneNumber,
  amount,
}: {
  phoneNumber: string;
  amount: number;
}) {
  const payload = {
    schemaVersion: "1.0",
    requestId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    channelName: "WEB",
    serviceName: "API_PURCHASE",
    serviceParams: {
      merchantUid: getRequiredEnv("WAAFI_MERCHANT_UID"),
      apiUserId: getRequiredEnv("WAAFI_API_USER_ID"),
      apiKey: getRequiredEnv("WAAFI_API_KEY"),
      paymentMethod: "MWALLET_ACCOUNT",
      payerInfo: { accountNo: phoneNumber },
      transactionInfo: {
        referenceId: `ref-${Date.now()}`,
        invoiceId: `inv-${Date.now()}`,
        amount: amount.toFixed(2),
        currency: "USD",
        description: "Powerbank rental",
      },
    },
  };

  const response = await fetch(getRequiredEnv("WAAFI_URL"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const responsePayload = (await parseResponseBody(response)) as WaafiResponse | string | null;

  if (!response.ok) {
    throw new Error(toErrorMessage(responsePayload, "Waafi request failed"));
  }

  return (responsePayload || {}) as WaafiResponse;
}

export function isWaafiApproved(waafiResponse: WaafiResponse) {
  return waafiResponse.responseCode === "2001" || waafiResponse.responseCode === 2001;
}

export function extractWaafiIds(waafiResponse: WaafiResponse) {
  return {
    transactionId: waafiResponse.params?.transactionId || null,
    issuerTransactionId: waafiResponse.params?.issuerTransactionId || null,
    referenceId: waafiResponse.params?.referenceId || null,
  };
}

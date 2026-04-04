import { NextRequest, NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/server/rate-limit";
import { getClientIp } from "@/lib/server/request";
import { getOptionalEnv } from "@/lib/server/env";

type PaymentRequestBody = {
  phoneNumber?: string;

  amount?: number;
  stationCode?: string;
};

function parseAndValidateBody(body: PaymentRequestBody) {
  const phoneNumber =
    typeof body.phoneNumber === "string"
      ? body.phoneNumber.replace(/\D/g, "")
      : "";

  const amount = Number(body.amount);
  const stationCode =
    typeof body.stationCode === "string"
      ? body.stationCode.replace(/\D/g, "")
      : "";

  if (!phoneNumber || Number.isNaN(amount) || amount <= 0) {
    return { error: "Missing phoneNumber or valid amount" } as const;
  }

  return {
    phoneNumber,
    amount,
    ...(stationCode ? { stationCode } : {}),
  } as const;
}

export const maxDuration = 300;

const DEFAULT_USERS_BACKEND_URL = "https://usersbackend-6yhs.onrender.com";

function getUsersBackendBaseUrl() {
  return (
    getOptionalEnv("USERS_BACKEND_URL") ||
    getOptionalEnv("NEXT_PUBLIC_USERS_BACKEND_URL") ||
    DEFAULT_USERS_BACKEND_URL
  ).replace(/\/+$/, "");
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);

  const rateLimitResult = checkRateLimit(`payment:${clientIp}`, {
    windowMs: 5 * 60_000,

    max: 10,
  });

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Too many payment requests, please try again later." },

      {
        status: 429,

        headers: {
          "Retry-After": String(rateLimitResult.retryAfterSeconds),
        },
      },
    );
  }

  let body: PaymentRequestBody;

  try {
    body = (await request.json()) as PaymentRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = parseAndValidateBody(body);

  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const upstreamResponse = await fetch(`${getUsersBackendBaseUrl()}/api/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed),
      cache: "no-store",
    });

    let payload: unknown = null;
    try {
      payload = (await upstreamResponse.json()) as unknown;
    } catch {
      payload = {
        error: upstreamResponse.ok
          ? "Invalid backend response"
          : "Backend request failed",
      };
    }

    return NextResponse.json(payload, { status: upstreamResponse.status });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not reach payment backend";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

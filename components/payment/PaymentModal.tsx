"use client";

import { CheckIcon, CloseIcon } from "@/components/payment/Icons";
import { PaymentResult } from "@/components/payment/types";

export function PaymentModal({
  result,
  onClose,
}: {
  result: PaymentResult;
  onClose: () => void;
}) {
  if (!result.open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
          aria-label="Close payment modal"
        >
          ×
        </button>

        {result.status === "processing" && (
          <>
            <h3 className="text-xl font-bold text-slate-900">Processing Payment</h3>
            {result.statusMessage && (
              <p className="mt-2 text-sm font-medium text-purple-600">{result.statusMessage}</p>
            )}
            <p className="mt-2 text-sm text-slate-500">Fadlan sug inta aan lacagta ku dirno...</p>
            <div className="mx-auto mt-5 h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          </>
        )}

        {result.status === "success" && (
          <>
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-700">Guul!</h3>
            <p className="mt-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {result.waafiMessage}
            </p>
            {result.batteryInfo && (
              <p className="mt-3 text-sm text-slate-600">
                Battery <strong>{result.batteryInfo.batteryId}</strong> waa la furay Slot{" "}
                <strong>{result.batteryInfo.slotId}</strong>.
              </p>
            )}
          </>
        )}

        {result.status === "failed" && (
          <>
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <CloseIcon className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-700">Lacag bixinta ma dhicin</h3>
            <p className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {result.errorMessage}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

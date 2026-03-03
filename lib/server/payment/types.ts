export type Battery = {
  battery_id: string;
  slot_id: string;
  lock_status: string;
  battery_capacity: string;
  battery_abnormal: string;
  cable_abnormal: string;
};

export type WaafiParams = {
  transactionId?: string;
  issuerTransactionId?: string;
  referenceId?: string;
};

export type WaafiResponse = {
  responseCode?: string | number;
  responseMsg?: string;
  params?: WaafiParams;
};

export type PaymentInput = {
  phoneNumber: string;
  amount: number;
};

export type PaymentSuccessPayload = {
  success: true;
  battery_id: string;
  slot_id: string;
  unlock: unknown;
  waafiMessage: string;
  waafiResponse: WaafiResponse;
};

export type PaymentDuplicatePayload = {
  success: true;
  message: string;
  transactionId: string;
};

export type PaymentPayload = PaymentSuccessPayload | PaymentDuplicatePayload;

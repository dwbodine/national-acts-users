export interface MissingFeePayment {
  StripePaymentIntentId: number;
  PaymentIntentId: string;
  Description: string;
  DateReceived: string;
  Total: number | string;
  Currency: string;
  StripeAccount: string;
  ProcessingFeeCurrency: string | null;
  ProcessingFee: number | string;
  RadarFee: number | string | null;
  Insurance: number | string | null;
}

export interface MissingFeesReport {
  total: number;
  limit: number;
  offset: number;
  payments: MissingFeePayment[];
}

export interface PaymentIntentFeeUpdate {
  StripePaymentIntentId: number;
  ProcessingFee: string;
  RadarFee: string | null;
  Insurance: string | null;
}

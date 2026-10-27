export interface MissingPaymentOrder {
  TicketSocketOrderId: number;
  NativeOrderId: number | string;
  NativeEventId: number | string;
  TicketSocketId: number;
  AccountName: string | null;
  TicketPartnerOrderId: number | null;
  EventId: number;
  EventTitle: string | null;
  EventDate: string | null;
  SellerId: number | null;
  Venue: string | null;
  City: string | null;
  State: string | null;
  PurchaseDate: string | null;
  IsManualTransfer: number | boolean | null;
  CustomerName: string | null;
  CustomerEmail: string | null;
  CustomerProcessingFee: number | string | null;
}

export interface MissingPaymentsReport {
  startDate: string;
  endDateExclusive: string;
  totalOrders: number;
  missingPaymentIntents: number;
  missingPercentage: number | null;
  months: {
    Month: string;
    TotalOrders: number;
    MissingPaymentIntents: number;
    MissingPercentage: number;
  }[];
  orders: MissingPaymentOrder[];
  limit: number;
  offset: number;
}

export interface PaymentIntentInput {
  PaymentIntentId: string;
  Description: string;
  DateReceived: string;
  Total: string;
  ProcessingFee: string;
  Currency: string;
  SourceUrl: string;
  ExchangeRate: string;
  TicketPartnerOrderId?: number;
  NativeOrderId?: number;
  NativeEventId?: number;
  EventName?: string;
  CustomerName?: string;
  CustomerEmail?: string;
  CustomerPhone?: string;
  Status?: 'succeeded';
  PaymentMethod?: string;
  StripeAccount?: string;
  ProcessingFeeCurrency?: string;
  Insurance?: string;
  ApplicationFee?: string;
  InsuranceVerified?: boolean;
}

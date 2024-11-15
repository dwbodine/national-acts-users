import { IDashboardTotals } from './user';

export enum SellerType {
  Artist = 1,
  Venue = 2,
  Promoter = 3,
}

export interface Seller {
  sellerId: number;
  name: string;
  hideInList?: boolean;
  isActive?: boolean;
  sellerType: SellerType;
}

export interface ShirtSales {
  size: string;
  total?: number;
}

export interface Ticket {
  ticketSocketOrderTicketId: number;
  ticketSocketOrderId?: number;
  price?: number;
  isActive?: boolean;
  ticketType: string;
  ticketTypeId?: number;
  serviceFee?: number;
  isCheckedIn?: boolean;
  attendeeFirstName?: string;
  attendeeLastName?: string;
  attendeeEmail?: string;
  attendeePhone?: string;
  isRefunded?: boolean;
  refundDate?: string;
  isChargedBack?: boolean;
  chargebackDate?: string;
  isServiceFeeRefunded?: boolean;
  barcode?: string;
  availableScans?: number;
  purchaseLocation?: string;
  shirtSize?: string;
}

export interface Order {
  eventId: number;
  eventTitle?: string;
  venue?: string;
  eventDate?: string;
  sellerName?: string;
  sellerId?: number;
  eventAddress?: string;
  eventCity?: string;
  eventState?: string;
  eventZip?: string;
  eventCountry?: string;
  ticketSocketEventId: number;
  ticketSocketOrderId: number;
  numTickets: number;
  orderId: number;
  isActive: boolean;
  isDeleted: boolean;
  isComped?: boolean;
  hasRefunds: boolean;
  hasChargebacks: boolean;
  numTicketsRefunded?: number;
  numTicketsChargedBack?: number;
  revenueRefunded?: number;
  revenueChargedBack?: number;
  revenueRefundedUsd?: number;
  revenueChargedBackUsd?: number;
  serviceFeeRevenueRefunded?: number;
  serviceFeeRevenueChargedBack?: number;
  serviceFeeRevenueRefundedUsd?: number;
  serviceFeeRevenueChargedBackUsd?: number;
  totalShirts?: number;
  revenueUsd: number;
  serviceFeesUsd?: number;
  exchangeRate: number;
  currencySymbol: string;
  currencyAbbrev: string;
  tickets?: Ticket[];
  purchaseDate: string;
  purchaseTimestamp: string;
  phone?: string;
  email: string;
  purchaserLastName: string;
  purchaserFirstName: string;
  purchaserCity?: string;
  purchaserState?: string;
  purchaserZipCode?: string;
  purchaserCountry?: string;
  purchaserIpAddress?: string;
  revenue: number;
  serviceFees?: number;
}

export interface Venue {
  name: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  timezone?: string;
}

export interface TicketType {
  eventId: number;
  ticketTypeId: number;
  ticketTypeName: string;
  totalAvailable: number;
  isActive: boolean;
}

export interface VipEvent {
  ticketSocketEventId: number;
  eventId: number;
  title: string;
  venue?: Venue;
  eventDate: string;
  thumbnail?: string;
  ticketSocketUrl?: string;
  totalRevenue: number;
  totalServiceFees: number;
  totalTickets: number;
  numTicketsComped?: number;
  totalCheckedIn: number;
  totalShirts: number;
  shirtSales?: ShirtSales[];
  isActive: boolean;
  orders?: Order[];
  externalEventId?: number;
  externalSellerId?: number;
  externalThumbnail?: string;
  externalUrl?: string;
  externalVenue?: Venue;
  disableLinkButton?: boolean;
  disableLinkReason?: boolean;
  isVip: boolean;
  isDeleted: boolean;
  isExternal: boolean;
  hasShirtData: boolean;
  hasPhoneData: boolean;
  hasNonUSAOrders: boolean;
  nonUsaCurrencySymbol?: string;
  nonUsaCurrencyAbbrev?: string;
  numTicketsRefunded?: number;
  revenueRefunded?: number;
  serviceFeeRevenueRefunded?: number;
  numTicketsChargedBack?: number;
  revenueChargedBack?: number;
  serviceFeeRevenueChargedBack?: number;
  ticketTypes?: TicketType[];
  hasTicketTypeData?: boolean;
  isAddedToBandsInTown?: boolean;
  sellerName?: string;
  isHidden?: boolean;
  isCancelled?: boolean;
  cancelledDate?: string;
  announceDate?: string;
}

export interface TicketSocketRefreshHistory {
  serviceEventsSkipped?: number[];
  eventsFailed?: number[];
  ordersFailed?: number[];
  ticketsFailed?: number[];
  ticketTypesFailed?: number[];
  totalEventsFromService?: number;
  eventsUpdated?: number;
  eventsInserted?: number;
  ordersInserted?: number;
  ordersUpdated?: number;
  ordersDeleted?: number;
  ticketsUpdated?: number;
  ticketsInserted?: number;
  ticketTypesUpdated?: number;
  ticketTypesInserted?: number;
  userId?: number;
  sellerId?: number;
  sellerName?: string;
  start?: number;
  end?: number;
  startTimer?: number;
  endTimer?: number;
  duration?: number;
  succeeded?: boolean;
  errorMessage?: string;
  username?: string;
  ticketSocketRefreshHistoryId?: number;
  orderDataUpdateSucceeded?: boolean;
  orderDataUpdateDuration?: number;
  orderDataRowsTotal?: number;
  orderDataRowsRemoved?: number;
  orderDataRowsInserted?: number;
  orderDataRowsUpdated?: number;
  totalDuration?: number;
}

export interface GetEventsResponse {
  events?: VipEvent[];
  statusCode?: number;
  eventError?: string;
}

export interface GetDashboardOrdersResponse {
  totals?: IDashboardTotals;
  statusCode?: number;
  dashError?: string;
}

export interface GetOrdersResponse {
  orders?: Order[];
  statusCode?: number;
  orderError?: string;
}

export interface ModifyEventResponse {
  success: boolean;
  statusCode?: number;
  eventError?: string;
}

export interface RefreshHistoryResponse {
  results?: TicketSocketRefreshHistory;
  statusCode?: number;
  refreshError?: string;
}

export interface GetRefreshHistoryResponse {
  history?: TicketSocketRefreshHistory[];
  statusCode?: number;
  refreshError?: string;
}

export interface ModifyOrderResponse {
  success: boolean;
  statusCode?: number;
  orderError?: string;
}

export interface ModifyTicketResponse {
  success: boolean;
  statusCode?: number;
  ticketError?: string;
}

export interface GetSellersResponse {
  sellers?: Seller[];
  sellersError?: string;
}

export interface IRevenueKeys {
  EventDate: string;
  Revenue: number;
}

export interface IOrderKeys {
  EventDate: string;
  Orders: number;
}
export interface ITicketData {
  TicketTypes: TicketType[];
  TicketData?: Map<string, ITicketTypeData[]>;
}

export interface ITicketTypeData {
  TicketType: string;
  Number: number;
}

export interface ITicketEventSalesData {
  EventId: number;
  SellerName: string;
  PurchaseDate?: string;
  Purchases: number;
  Tickets: number;
  Revenue: number;
  ServiceFees: number;
  TotalRevenue: number;
  RevenueRefunded?: number;
  ServiceFeeRevenueRefunded?: number;
}

export interface ITicketSellerSalesData {
  SellerName: string;
  PurchaseDate?: string;
  Purchases: number;
  Tickets: number;
  Revenue: number;
  ServiceFees: number;
  TotalRevenue: number;
  RevenueRefunded?: number;
  ServiceFeeRevenueRefunded?: number;
  children?: ITicketEventSalesData[];
}

export interface ITicketSalesData {
  PurchaseDate: string;
  Purchases: number;
  Tickets: number;
  Revenue: number;
  ServiceFees: number;
  TotalRevenue: number;
  TicketsRefunded?: number;
  RevenueRefunded?: number;
  ServiceFeeRevenueRefunded?: number;
  TicketsChargedBack?: number;
  RevenueChargedBack?: number;
  ServiceFeeRevenueChargedBack?: number;
  children?: ITicketSellerSalesData[];
}

export interface IShirtData {
  ShirtSizes: string[];
  ShirtData?: Map<string, IShirtSizeData[]>;
}

export interface IShirtSizeData {
  ShirtSize: string;
  Number: number;
}

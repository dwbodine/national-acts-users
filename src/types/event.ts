import { Country } from './public';

export enum SellerType {
  Artist = 1,
  Venue = 2,
  Promoter = 3,
}

export interface SellerEventCategory {
  sellerId: number;
  ticketSocketId: number;
  eventCategoryId?: number;
  sellerEventCategoryId?: number;
  hasEvents?: boolean;
  isVisibleOnSite?: boolean;
  isVisibleOnPortal?: boolean;
}

export interface Seller {
  sellerId: number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: Country;
  phone?: string;
  email?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  spotify?: string;
  website?: string;
  websiteDisplayText?: string;
  hideInList?: boolean;
  isActive?: boolean;
  sellerType: SellerType;
  sellerEventCategories?: SellerEventCategory[];
}

export interface ShirtSales {
  size: string;
  total?: number;
}

export interface Note {
  noteId: number;
  ticketSocketEventId?: number;
  note: string;
  noteTitle?: string;
  noteTimestamp: string;
  isCompleted?: boolean;
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
  checkedInDate?: string;
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
  lastUpdate?: string;
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
  country?: Country;
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
  externalEventId: number;
  ticketSocketEventId?: number;
  title: string;
  venue?: Venue;
  eventDate: string;
  thumbnail?: string;
  externalThumbnail?: string;
  ticketSocketUrl?: string;
  totalRevenue?: number;
  totalRevenueUsd?: number;
  totalServiceFees?: number;
  totalServiceFeesUsd?: number;
  totalTickets?: number;
  numTicketsComped?: number;
  totalCheckedIn?: number;
  totalShirts?: number;
  shirtSales?: ShirtSales[];
  isActive: boolean;
  orders?: Order[];
  eventTime?: string;
  sellerId?: number;
  externalUrl?: string;
  externalEventVenueId?: number;
  disableLinkButton?: boolean;
  disableLinkReason?: string;
  disableVipLinkButton?: boolean;
  disableVipLinkReason?: string;
  externalVipLink?: string;
  isVip?: boolean;
  isDeleted: boolean;
  isExternal: boolean;
  hasShirtData?: boolean;
  hasPhoneData?: boolean;
  hasNonUSAOrders?: boolean;
  nonUsaCurrencySymbol?: string;
  nonUsaCurrencyAbbrev?: string;
  numTicketsRefunded?: number;
  revenueRefunded?: number;
  revenueRefundedUsd?: number;
  serviceFeeRevenueRefunded?: number;
  serviceFeeRevenueRefundedUsd?: number;
  numTicketsChargedBack?: number;
  revenueChargedBack?: number;
  revenueChargedBackUsd?: number;
  serviceFeeRevenueChargedBack?: number;
  serviceFeeRevenueChargedBackUsd?: number;
  ticketTypes?: TicketType[];
  hasTicketTypeData?: boolean;
  isAddedToBandsInTown?: boolean;
  sellerName?: string;
  isHidden?: boolean;
  isCancelled?: boolean;
  cancelledDate?: string;
  announceDate?: string;
  tourAnnounceDate?: string;
  doorsOpen?: string;
  meetAndGreetTime?: string;
  emailSentToVips?: boolean;
  textSentToVips?: boolean;
  listSentToBand?: boolean;
  listSentTime?: string;
  listSentNumVips?: number;
  checkInLocation?: string;
  checkInNotes?: string;
  notes?: Note[];
  isSoldOut?: boolean;
  isVisibleOnSite?: boolean;
  isVisibleOnPortal?: boolean;
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

export interface Tour {
  tourId: number;
  sellers?: Seller[];
  tourName: string;
  isActive: boolean;
  announceDate: string;
  events?: VipEvent[];
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
  CurrencySymbol: string;
  EventId: number;
  ExchangeRate: number;
  PurchaseDate: string;
  Purchases: number;
  Revenue: number;
  RevenueUsd: number;
  RevenueChargedBack: number;
  RevenueChargedBackUsd: number;
  RevenueRefunded: number;
  RevenueRefundedUsd: number;
  SellerName: string;
  ServiceFeeRevenueChargedBack: number;
  ServiceFeeRevenueChargedBackUsd: number;
  ServiceFeeRevenueRefunded: number;
  ServiceFeeRevenueRefundedUsd: number;
  ServiceFees: number;
  ServiceFeesUsd: number;
  Tickets: number;
  TicketsRefunded: number;
  TicketsChargedBack: number;
  TotalRevenue: number;
  TotalRevenueUsd: number;
}

export interface ITicketSellerSalesData {
  PurchaseDate: string;
  Purchases: number;
  RevenueChargedBackUsd: number;
  RevenueRefundedUsd: number;
  RevenueUsd: number;
  SellerName: string;
  ServiceFeeRevenueChargedBackUsd: number;
  ServiceFeeRevenueRefundedUsd: number;
  ServiceFeesUsd: number;
  Tickets: number;
  TicketsChargedBack: number;
  TicketsRefunded: number;
  TotalRevenueUsd: number;
  children?: ITicketEventSalesData[];
}

export interface ITicketSalesData {
  PurchaseDate: string;
  Purchases: number;
  RevenueChargedBackUsd: number;
  RevenueRefundedUsd: number;
  RevenueUsd: number;
  ServiceFeeRevenueChargedBackUsd: number;
  ServiceFeeRevenueRefundedUsd: number;
  ServiceFeesUsd: number;
  Tickets: number;
  TicketsChargedBack: number;
  TicketsRefunded: number;
  TotalRevenueUsd: number;
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

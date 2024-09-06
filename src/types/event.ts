export enum SellerType {
  Artist = 1,
  Venue = 2,
  Promoter = 3
};

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
  price?: number;
  isActive?: boolean;
  ticketType: string;
  serviceFee?: number;
  attendeeName?: string;
  isCheckedIn?: boolean;
}

export interface Order {
  eventId: number;
  eventTitle?: string;
  eventDate?: string;
  sellerName?: string;
  ticketSocketEventId: number;
  ticketSocketOrderId: number;
  numTickets: number;
  orderId: number;
  isActive: boolean;
  isDeleted: boolean;
  isRefunded: boolean;
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
  revenue: number;
  serviceFees?: number;
  attendeeNames?: string[];
  shirts?: string[];
  isHidden?: boolean;
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
  ticketTypes?: TicketType[];
  hasTicketTypeData?: boolean;
  isAddedToBandsInTown?: boolean;
  sellerName?: string;
  isHidden?: boolean;
}

export interface GetEventsResponse {
  events?: VipEvent[];
  statusCode?: number;
  eventError?: string;
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
  PurchaseDate?: string;
  Tickets: number;
  Revenue: number;
}

export interface ITicketSalesData {
  PurchaseDate: string;
  Tickets: number;
  Revenue: number;
  children?: ITicketEventSalesData[]
}

export interface IShirtData {
  ShirtSizes: string[];
  ShirtData?: Map<string, IShirtSizeData[]>;
}

export interface IShirtSizeData {
  ShirtSize: string;
  Number: number;
}

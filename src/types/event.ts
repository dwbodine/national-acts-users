export interface Seller {
  sellerId: number;
  name: string;
  hideInList?: boolean;
  isActive?: boolean;
}

export interface ShirtSales {
  size: string;
  total?: number;
}

export interface Ticket {
  price?: number;
  isActive?: boolean;
  ticketType: string;
}

export interface Order {
  eventId: number;
  ticketSocketEventId: number;
  ticketSocketOrderId: number;
  numTickets: number;
  orderId: number;
  isActive: boolean;
  isDeleted: boolean;
  isRefunded: boolean;
  totalShirts?: number;
  revenueUsd: number;
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
  revenue: number;
  attendeeNames?: string[];
  shirts?: string[];
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

export interface VipEvent {
  ticketSocketEventId: number;
  eventId: number;
  title: string;
  venue?: Venue;
  eventDate: string;
  thumbnail?: string;
  ticketSocketUrl?: string;
  totalRevenue: number;
  totalTickets: number;
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
}

export interface GetEventsResponse {
  events?: VipEvent[];
  statusCode?: number;
  eventError?: string;
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
  TicketTypes: string[];
  TicketData?: Map<string, ITicketTypeData[]>;
}

export interface ITicketTypeData {
  TicketType: string;
  Number: number;
}

export interface IShirtData {
  ShirtSizes: string[];
  ShirtData?: Map<string, IShirtSizeData[]>;
}

export interface IShirtSizeData {
  ShirtSize: string;
  Number: number;
}

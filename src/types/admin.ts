import { Seller, SellerEventCategory, VipEvent } from './event';

export interface ExternalVenue {
  venueId: number;
  venue: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  country?: string;
  hasEvents?: boolean;
}

export interface TicketSocketCategory {
  name: string;
  eventCategoryId: number;
}

export interface TicketSocketAccount {
  ticketSocketId: number;
  name: string;
  serviceUrl: string;
  utcOffsetHours?: number;
  exchangeRateId?: number;
  exchangeRateSlug?: string;
  mulitiplier?: number;
  currencySymbol?: string;
  categories?: TicketSocketCategory[];
}

export interface GetExternalVenuesResponse {
  venues?: ExternalVenue[];
  statusCode?: number;
  venueError?: string;
}

export interface ModifyExternalVenueResponse {
  statusCode?: number;
  venueError?: string;
  success: boolean;
  updatedVenue?: ExternalVenue;
}

export interface GetExternalEventsResponse {
  events?: VipEvent[];
  statusCode?: number;
  eventError?: string;
}

export interface ModifyExternalEventResponse {
  statusCode?: number;
  eventError?: string;
  success: boolean;
  updatedEvent?: VipEvent;
}

export interface GetTicketSocketAccountsResponse {
  accounts?: TicketSocketAccount[];
  statusCode?: number;
  accountError?: string;
}

export interface ModifySellerResponse {
  statusCode?: number;
  sellerError?: string;
  success: boolean;
  updatedSeller?: Seller;
}

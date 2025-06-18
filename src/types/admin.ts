import { Seller, SellerEventCategory, VipEvent } from './event';
import { Country, Page, TimeZone } from './public';

export interface ExternalVenue {
  venueId: number;
  venue: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  country?: Country;
  hasEvents?: boolean;
  timezone?: TimeZone;
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

export interface GetPagesResponse {
  pages?: Page[];
  statusCode?: number;
  pageError?: string;
}

export interface ModifyPageResponse {
  statusCode?: number;
  pageError?: string;
  success: boolean;
  updatedPage?: Page;
}

export interface GetExternalVenuesResponse {
  venues?: ExternalVenue[];
  statusCode?: number;
  venueError?: string;
}

export interface GetCountriesResponse {
  countries?: Country[];
  statusCode?: number;
  countryError?: string;
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

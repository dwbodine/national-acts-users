import { Country, TimeZone } from './public';

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

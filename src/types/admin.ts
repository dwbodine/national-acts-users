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

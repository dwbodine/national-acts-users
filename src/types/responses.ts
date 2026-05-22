import { ExternalVenue, TicketSocketAccount } from './admin';
import { Note, Order, Seller, Ticket, TicketSocketRefreshHistory, Tour, VipEvent } from './event';
import {
  Country,
  Faq,
  FaqCategory,
  FeaturedArtist,
  Page,
  PageSeller,
  PageType,
  SiteSetting,
} from './public';
import { IDashboardTotals, Permission, Role, User, UserActivity, UserSeller } from './user';

export interface GetResponseBase {
  statusCode?: number;
  error?: string;
}

export interface PostReponseBase extends GetResponseBase {
  success?: boolean;
  errorMessage?: string;
}

export interface GetFaqCategoriesResponse extends GetResponseBase {
  categories?: FaqCategory[];
}

export interface GetFaqsResponse extends GetResponseBase {
  faqs?: Faq[];
}

export interface ModifyFaqResponse extends PostReponseBase {
  updatedFaq?: Faq;
}

export interface GetPagesResponse extends GetResponseBase {
  pages?: Page[];
}

export interface GetPageSellersResponse extends GetResponseBase {
  pageSellers?: PageSeller[];
}

export interface ModifyPageResponse extends PostReponseBase {
  updatedPage?: Page;
}

export interface ModifyFeaturedArtistResponse extends PostReponseBase {
  updatedFeaturedArtist?: FeaturedArtist;
}

export interface ModifyFeaturedArtistsResponse extends PostReponseBase {
  updatedFeaturedArtists?: FeaturedArtist[];
}

export interface GetExternalVenuesResponse extends GetResponseBase {
  venues?: ExternalVenue[];
}

export interface GetCountriesResponse extends GetResponseBase {
  countries?: Country[];
}

export interface ModifyExternalVenueResponse extends PostReponseBase {
  updatedVenue?: ExternalVenue;
}

export interface GetExternalEventsResponse extends GetResponseBase {
  events?: VipEvent[];
}

export interface ModifyExternalEventResponse extends PostReponseBase {
  updatedEvent?: VipEvent;
}

export interface GetTicketSocketAccountsResponse extends GetResponseBase {
  accounts?: TicketSocketAccount[];
}

export interface ModifySellerResponse extends PostReponseBase {
  updatedSeller?: Seller;
}

export interface GetSettingsResponse extends GetResponseBase {
  settings?: SiteSetting[];
}

export interface UpdateSettingResponse extends PostReponseBase {
  updatedSetting?: SiteSetting;
}

export interface GetEventsResponse extends GetResponseBase {
  events?: VipEvent[];
}

export interface GetToursResponse extends GetResponseBase {
  tours?: Tour[];
}

export interface GetEventResponse extends GetResponseBase {
  event?: VipEvent;
}

export interface GetNotesResponse extends GetResponseBase {
  notes?: Note[];
}

export interface GetDashboardOrdersResponse extends GetResponseBase {
  totals?: IDashboardTotals;
}

export interface GetOrdersResponse extends GetResponseBase {
  orders?: Order[];
}

export interface GetOrderResponse extends GetResponseBase {
  order?: Order;
}

export interface ModifyEventResponse extends PostReponseBase {
  updatedEvent?: VipEvent;
}

export interface ModifyTourResponse extends PostReponseBase {
  updatedTour?: Tour;
}

export interface RefreshHistoryResponse extends GetResponseBase {
  results?: TicketSocketRefreshHistory;
}

export interface GetRefreshHistoryResponse extends GetResponseBase {
  history?: TicketSocketRefreshHistory[];
}

export interface ModifyOrderResponse extends PostReponseBase {
  updatedOrder?: Order;
}

export interface ModifyNoteResponse extends PostReponseBase {
  updatedNote?: Note;
}

export interface ModifyTicketResponse extends PostReponseBase {
  updatedTicket?: Ticket;
}

export interface GetSellerResponse extends GetResponseBase {
  seller?: Seller;
}

export interface GetSellersResponse extends GetResponseBase {
  sellers?: Seller[];
}

export interface GetPageTypesResponse extends GetResponseBase {
  pageTypes?: PageType[];
}

export interface LoginResponse extends PostReponseBase {
  user?: User;
}

export interface UserSellerResponse extends GetResponseBase {
  userSeller?: UserSeller;
}

export interface UserLoginResponse extends PostReponseBase {
  user?: User;
}

export interface UserLoginResponseData {
  msg?: string;
}

export interface UserResponse extends PostReponseBase {
  user?: User;
}

export interface LogResponse extends GetResponseBase {
  logs?: string;
}

export interface GetUsersResponse extends GetResponseBase {
  users?: User[];
}

export interface GetRolesResponse extends GetResponseBase {
  roles?: Role[];
}

export interface UpdateRoleResponse extends PostReponseBase {
  updatedRole?: Role;
}

export interface UpdateUserResponse extends PostReponseBase {
  updatedUser?: User;
}

export interface GetPermissionsResponse extends GetResponseBase {
  permissions?: Permission[];
}

export interface LogActivityResponse extends PostReponseBase {
  updatedActivity?: UserActivity;
}

export interface GetActivityResponse extends PostReponseBase {
  activities?: UserActivity[];
}

export interface GetFeaturedArtistsResponse extends GetResponseBase {
  featuredArtists?: FeaturedArtist[];
}

import { Country, Faq, FaqCategory, Page, PageType, SiteSetting } from './public';
import { ExternalVenue, TicketSocketAccount } from './admin';
import {
  ITicketSalesData,
  Note,
  Order,
  Seller,
  SellerType,
  Tour,
  VipEvent,
} from './event';

export interface JwtPayload {
  fresh?: boolean;
  iat?: number;
  jti?: string;
  type?: string;
  sub?: string;
  nbf?: number;
  csrf?: string;
  exp?: number;
  role?: string;
  user_id?: number;
}

export type UserSeller = {
  sellerId: number;
  sellerName: string;
  sellerType: SellerType;
  roleId?: number;
  permissions?: number[];
  routes?: string[];
};

export type Role = {
  roleId: number;
  roleName: string;
  permissions?: Permission[];
};

export type Permission = {
  permissionId: number;
  permissionName: string;
};

export enum EnumPermission {
  ViewInactiveEvents = 1,
  ViewDeletedEvents = 2,
  ViewRevenueData = 3,
  ViewServiceFees = 4,
  ViewRevenueControls = 5,
  ExportData = 6,
  ViewPrintButton = 7,
  CheckInUsers = 8,
  ExportCustomerData = 11,
  ViewHiddenEvents = 12,
  ViewTourSelect = 13,
  ViewVIPItinerary = 14,
}

export type User = {
  userId: number;
  isAdmin: boolean;
  username: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  notes?: string;
  createdAt?: string;
  isAuthenticated?: boolean;
  token?: string;
  category?: string;
  isActive: boolean;
  sellers?: UserSeller[];
  selectedSellerId?: number;
  selectedHideRevenue?: boolean;
  selectedHideServiceFees?: boolean;
  requireResetPassword?: boolean;
  sendEmailReset?: boolean;
  sendTextReset?: boolean;
  disableCheckIn?: boolean;
  lastUpdate?: string;
};

export type DateRange = {
  start: number;
  end: number;
  periodStart?: number;
};

export type UserReportSelection = {
  seller: UserSeller;
  start?: number;
  end?: number;
  showInactive?: boolean;
  showInactiveOrders?: boolean;
  showDeleted?: boolean;
  hideRevenue?: boolean;
  hideServiceFees?: boolean;
  showDeletedOrders?: boolean;
  reloadEvents?: boolean;
  reloadTours?: boolean;
  retainDateSelection?: boolean;
  currentEvents?: VipEvent[];
  currentDetailEvent?: VipEvent;
  focusControl?: string;
  showHidden?: boolean;
  isForAdmin?: boolean;
  showOnlyEmails?: boolean;
  showOnlyPhones?: boolean;
  selectedTourId?: number;
  tours?: Tour[] | undefined;
};

export enum EventTabView {
  Week = 1,
  Month = 2,
  Agenda = 3,
}

export type EventReportSelection = {
  start?: number;
  end?: number;
  periodStart?: number;
  showInactive?: boolean;
  showDeleted?: boolean;
  showHidden?: boolean;
  reloadEvents?: boolean;
  currentEvents?: VipEvent[];
  notes?: Note[];
  expandedRow?: number;
  focusControl?: string;
  expandedEvent?: VipEvent;
  updateListStatus?: boolean;
  eventTabView?: EventTabView;
};

export interface ITopSeller {
  sellerId: number;
  sellerName: string;
  revenueUsd: number;
}

export interface ITopSellingLocation {
  location: string;
  tooltip: string;
  revenueUsd: number;
}

export interface IDailyOrderData {
  sellerId: number;
  sellerName: string;
  purchaseDate: string;
  ticketSocketEventId: number;
  eventTitle: string;
  eventDate: string;
  venue?: string;
  city: string;
  state?: string;
  zip?: string;
  country?: string;
  orders: number;
  tickets: number;
  ticketRevenueUsd: number;
  serviceFeesRevenueUsd: number;
  totalRevenueUsd: number;
  ticketSocketId: number;
  ticketSocketOrderId?: number;
  isRefunded?: boolean;
  isChargedBack?: boolean;
  numTicketsRefunded?: number;
  revenueRefunded?: number;
  serviceFeeRevenueRefunded?: number;
  numTicketsChargedBack?: number;
  revenueChargedBack?: number;
  serviceFeeRevenueChargedBack?: number;
}

export interface IDashboardTotals {
  year: number;
  month: number;
  day: number;
  daysInMonth: number;
  dayOfYear: number;
  totalDaysInYear: number;
  tickets: number;
  numTicketsRefunded?: number;
  numTicketsChargedBack?: number;
  revenueRefunded?: number;
  revenueChargedBack?: number;
  serviceFeeRevenueRefunded?: number;
  serviceFeeRevenueChargedBack?: number;
  orders: number;
  ticketRevenueUsd: number;
  serviceFeesRevenueUsd: number;
  totalRevenueUsd: number;
  yearlyRevenueGoal: number;
  monthlyRevenueGoal: number;
  pricePerTicket?: number;
  serviceFeePerTicket?: number;
  dailyOrderData?: IDailyOrderData[];
}

export interface IAverageDailyData {
  ticketRevenue?: number;
  serviceFees?: number;
  totalRevenue?: number;
  transactions?: number;
  tickets?: number;
  refunds?: number;
  revenueRefunded?: number;
  serviceFeeRevenueRefunded?: number;
}

export interface ISalesData {
  key: number;
  value: number;
}

export interface ITotalsByAccount {
  ticketSocketId: number;
  totals?: ITicketSalesData;
}

export interface IDashboardData {
  ticketSalesData?: ITicketSalesData[];
  tickets?: number;
  monthToDateTickets?: number;
  ticketsRefunded?: number;
  revenueRefunded?: number;
  serviceFeeRevenueRefunded: number;
  monthToDateTicketsRefunded?: number;
  monthToDateRevenueRefunded?: number;
  monthToDateServiceFeesRefunded?: number;
  revenue?: number;
  monthToDateRevenue?: number;
  serviceFees?: number;
  monthToDateServiceFees?: number;
  purchases?: number;
  monthToDatePurchases?: number;
  totalRevenue?: number;
  monthToDateTotalRevenue?: number;
  orders?: Order[];
  totals?: IDashboardTotals;
  topSellers?: ITopSeller[];
  topLocations?: ITopSellingLocation[];
  topVenues?: ITopSellingLocation[];
  percentMonthlyGoal?: number;
  percentYearlyGoal?: number;
  projectedYearTotalRevenue?: number;
  projectedMonthTotalRevenue?: number;
  salesPerMonth?: ISalesData[];
  salesPerDayMonth?: ISalesData[];
  salesPerDayYear?: ISalesData[];
  totalsByAccount?: ITotalsByAccount[];
  monthlyAverages?: IAverageDailyData;
  yearlyAverages?: IAverageDailyData;
  monthToDatePricePerTicket?: number;
  monthToDateServiceFeePerTicket?: number;
}

export type AdminDashboardSelection = {
  start: number;
  end: number;
  reloadOrders: boolean;
  currentDashboardData?: IDashboardData;
  dashboardTotals?: IDashboardTotals;
};

export type UserActivitySelection = {
  start?: number;
  end?: number;
  reloadActivities: boolean;
  filterAdmins: boolean;
  currentLogins?: number;
  currentActivities?: UserActivity[];
};

export type GlobalSelection = {
  isLoading: boolean;
  saveInProgress: boolean;
};

export enum UserActivityType {
  Login = 1,
  Logout = 2,
  AccessSalesOverView = 3,
  AccessDashboard = 4,
  AccessAdmin = 5,
  AccessReports = 6,
  AccessEventDetail = 7,
  ChangeSeller = 8,
  ChangeSalesOverviewDateRange = 9,
  ResetPassword = 10,
  StartedForgotPassword = 11,
  FinishedForgotPassword = 12,
  ExportedEventSummary = 14,
  ExportedCustomerData = 15,
  ExportedEventData = 16,
  ShowInactiveEvents = 17,
  ShowDeletedEvents = 18,
  ShowRevenue = 19,
  ShowServiceFees = 20,
  ShowInactiveOrders = 21,
  ShowDeletedOrders = 22,
  PrintButtonClicked = 23,
  ResetButtonClicked = 24,
  CustomerExportReport = 25,
  UserActivityReport = 26,
  AdminEventsOverview = 27,
}

export type UserActivity = {
  activityType: UserActivityType;
  activityName?: string;
  userId?: number;
  username?: string;
  activityData?: string;
  timestamp: string;
  fullName?: string;
  sellerName?: string;
};

export type AdminSelection = {
  sellerId?: number;
  start?: number;
  end?: number;
  reloadCountries?: boolean;
  reloadFaqs?: boolean;
  reloadUsers?: boolean;
  reloadRoles?: boolean;
  reloadEvents?: boolean;
  reloadPages?: boolean;
  reloadTours?: boolean;
  reloadVenues?: boolean;
  reloadSellers?: boolean;
  reloadSettings?: boolean;
  selectedFaq?: Faq | undefined;
  selectedUser?: User | undefined;
  selectedRole?: Role | undefined;
  selectedEvent?: VipEvent | undefined;
  selectedPage?: Page | undefined;
  selectedPageType?: PageType | undefined;
  selectedTour?: Tour | undefined;
  selectedVenue?: ExternalVenue | undefined;
  selectedOrder?: Order | undefined;
  selectedSeller?: Seller | undefined;
  mustSaveOrder?: boolean;
  mustSaveEvent?: boolean;
  mustSavePage?: boolean;
  allSellers?: Seller[] | undefined;
  allSettings?: SiteSetting[] | undefined;
  allPages?: Page[] | undefined;
  pageOrders?: Map<number, Page>;
  allFaqs?: Faq[] | undefined;
  faqCategories?: FaqCategory[] | undefined;
  countries: Country[] | undefined;
  pageTypes?: PageType[] | undefined;
  roles?: Role[] | undefined;
  users?: User[] | undefined;
  events?: VipEvent[] | undefined;
  orders?: Order[] | undefined;
  ticketSocketAccounts?: TicketSocketAccount[] | undefined;
  ticketSocketEvents?: VipEvent[] | undefined;
  tours?: Tour[] | undefined;
  uploadedFile?: string;
  venues?: ExternalVenue[] | undefined;
  venueSearchTerm?: string;
};

export type AdminReportsSelection = {
  start?: number;
  end?: number;
  reloadData?: boolean;
};

export enum ForgotPasswordMode {
  SendPasswordReset,
  ValidateResetCode,
  ResetPassword,
}

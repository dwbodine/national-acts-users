import { ExternalVenue, TicketSocketAccount } from './admin';
import { ITicketSalesData, Note, Order, Seller, SellerType, Tour, VipEvent } from './event';
import { Country, Faq, FaqCategory, Page, PageType, SiteSetting } from './public';

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
  sellerName?: string;
  sellerType?: SellerType;
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
  ticketRevenue: number;
  ticketRevenueUsd: number;
  serviceFeesRevenue: number;
  serviceFeesRevenueUsd: number;
  totalRevenue: number;
  totalRevenueUsd: number;
  ticketSocketId: number;
  ticketSocketOrderId?: number;
  isRefunded?: boolean;
  isChargedBack?: boolean;
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
  exchangeRate?: number;
  currencySymbol?: string;
  lastUpdate?: string;
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
  revenueRefundedUsd?: number;
  revenueChargedBack?: number;
  revenueChargedBackUsd?: number;
  serviceFeeRevenueRefunded?: number;
  serviceFeeRevenueRefundedUsd?: number;
  serviceFeeRevenueChargedBack?: number;
  serviceFeeRevenueChargedBackUsd?: number;
  orders: number;
  ticketRevenue: number;
  ticketRevenueUsd: number;
  serviceFeesRevenue: number;
  serviceFeesRevenueUsd: number;
  totalRevenue: number;
  totalRevenueUsd: number;
  yearlyRevenueGoal: number;
  monthlyRevenueGoal: number;
  pricePerTicket?: number;
  serviceFeePerTicket?: number;
  dailyOrderData?: IDailyOrderData[];
}

export interface IAverageDailyData {
  ticketRevenueUsd: number;
  serviceFeesUsd: number;
  totalRevenueUsd: number;
  transactions: number;
  tickets: number;
  refunds: number;
  chargebacks: number;
  revenueRefundedUsd: number;
  revenueChargedBackUsd: number;
  serviceFeeRevenueRefundedUsd: number;
  serviceFeeRevenueChargedBackUsd: number;
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
  monthToDateTickets: number;
  ticketsRefunded: number;
  ticketsChargedBack: number;
  revenueRefundedUsd: number;
  revenueChargedBackUsd: number;
  serviceFeeRevenueRefundedUsd: number;
  serviceFeeRevenueChargedBackUsd: number;
  monthToDateTicketsChargedBack: number;
  monthToDateTicketsRefunded: number;
  monthToDateRevenueRefundedUsd: number;
  monthToDateRevenueChargedBackUsd: number;
  monthToDateServiceFeesRefundedUsd: number;
  monthToDateServiceFeesChargedBackUsd: number;
  revenueUsd: number;
  monthToDateRevenueUsd: number;
  serviceFeesUsd: number;
  monthToDateServiceFeesUsd: number;
  purchases?: number;
  monthToDatePurchases?: number;
  totalRevenueUsd: number;
  monthToDateTotalRevenueUsd: number;
  orders: Order[];
  totals: IDashboardTotals;
  topSellers: ITopSeller[];
  topLocations: ITopSellingLocation[];
  topVenues: ITopSellingLocation[];
  percentMonthlyGoal: number;
  percentYearlyGoal: number;
  projectedYearTotalRevenueUsd: number;
  projectedMonthTotalRevenueUsd: number;
  salesPerMonth: ISalesData[];
  salesPerDayMonth: ISalesData[];
  salesPerDayYear: ISalesData[];
  totalsByAccount: ITotalsByAccount[];
  monthlyAverages: IAverageDailyData;
  yearlyAverages: IAverageDailyData;
  monthToDatePricePerTicketUsd: number;
  monthToDateServiceFeePerTicketUsd: number;
  lastUpdated?: string;
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
  currentUser?: User;
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
  userActivityId?: number;
  activityType: UserActivityType;
  activityName?: string;
  userId?: number;
  username?: string;
  activityData?: string;
  activityTime?: string;
  fullName?: string;
  sellerName?: string;
};

export type AdminSelection = {
  allSellers?: Seller[] | undefined;
  allSettings?: SiteSetting[] | undefined;
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
  selectedFaqCategory?: number | undefined;
  countries: Country[] | undefined;
  pageTypes?: PageType[] | undefined;
  roles?: Role[] | undefined;
  users?: User[] | undefined;
  ticketSocketAccounts?: TicketSocketAccount[] | undefined;
  uploadedFile?: string;
  venueSearchTerm?: string;
};

export type AdminDataSelection = {
  allPages?: Page[] | undefined;
  events?: VipEvent[] | undefined;
  pageOrders?: Page[] | undefined;
  allFaqs?: Faq[] | undefined;
  faqCategories?: FaqCategory[] | undefined;
  orders?: Order[] | undefined;
  ticketSocketEvents?: VipEvent[] | undefined;
  tours?: Tour[] | undefined;
  venues?: ExternalVenue[] | undefined;
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

import { ITicketSalesData, Order, Seller, SellerType, VipEvent } from './event';

export type LoginResponse = {
  user?: User;
  loginError?: string;
};

export type UserSeller = {
  sellerId: number;
  sellerName: string;
  sellerType: SellerType;
  roleId?: number;
  permissions?: number[];
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

export type UserSellerResponse = {
  userSeller?: UserSeller;
  userSellerError?: string;
  statusCode?: number;
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
  ChangeEventStatus = 9,
  ChangeOrderStatus = 10,
  ExportCustomerData = 11,
  ViewHiddenEvents = 12,
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
  retainDateSelection?: boolean;
  currentEvents?: VipEvent[];
  currentDetailEvent?: VipEvent;
  focusControl?: string;
  showHidden?: boolean;
  isForAdmin?: boolean;
};

export type EventReportSelection = {
  start?: number;
  end?: number;
  showInactive?: boolean;
  showDeleted?: boolean;
  showHidden?: boolean;
  reloadEvents?: boolean;
  currentEvents?: VipEvent[];
  expandedRows?: number[];
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
  start: number;
  end: number;
  reloadActivities: boolean;
  filterAdmins: boolean;
  currentLogins?: number;
  currentActivities?: UserActivity[];
};

export type GlobalSelection = {
  isLoading: boolean;
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
  reloadUsers?: boolean;
  reloadRoles?: boolean;
  reloadEvents?: boolean;
  selectedUser?: User | undefined;
  selectedRole?: Role | undefined;
  selectedEvent?: VipEvent | undefined;
  selectedOrder?: Order | undefined;
  mustSaveOrder?: boolean;
  mustSaveEvent?: boolean;
  allSellers?: Seller[] | undefined;
  roles?: Role[] | undefined;
  users?: User[] | undefined;
  events?: VipEvent[] | undefined;
};

export type AdminReportsSelection = {
  start?: number;
  end?: number;
  reloadData?: boolean;
};

export type UserLoginResponse = {
  user?: User;
  loginError?: string;
};

export type UserResponse = {
  user?: User;
  errorMessage?: string;
};

export type LogResponse = {
  logs?: string;
  errorMessage?: string;
};

export enum ForgotPasswordMode {
  SendPasswordReset,
  ValidateResetCode,
  ResetPassword,
}

export interface GetUsersResponse {
  users?: User[];
  statusCode?: number;
  userError?: string;
}

export interface GetRolesResponse {
  roles?: Role[];
  statusCode?: number;
  roleError?: string;
}

export interface UpdateRoleResponse {
  success: boolean;
  statusCode?: number;
  roleError?: string;
}

export interface UpdateUserResponse {
  success: boolean;
  statusCode?: number;
  userError?: string;
}

export interface GetPermissionsResponse {
  permissions?: Permission[];
  statusCode?: number;
  permissionError?: string;
}

export interface LogActivityResponse {
  statusCode?: number;
  logActivityError?: string;
}

export interface GetActivityResponse {
  activities?: UserActivity[];
  statusCode?: number;
  logActivityError?: string;
}

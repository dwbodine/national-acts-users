import { ITicketSalesData, Order, SellerType, VipEvent } from "./event";

export type LoginResponse = {
  user?: User;
  loginError?: string;
}

export type UserSeller = {
  sellerId: number;
  sellerName: string;
  sellerType: SellerType;
  roleId?: number;
  permissions?: number[];
}

export type Role = {
  roleId: number;
  roleName: string;
  permissions?: Permission[];
}

export type Permission = {
  permissionId: number;
  permissionName: string;
}

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
  ViewHiddenEvents = 12 
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
  showHiddenOrders?: boolean;
}

export interface IDashboardData {
  ticketSalesData?: ITicketSalesData[];
  tickets?: number;
  revenue?: number;
  serviceFees?: number;
  purchases?: number;
  totalRevenue?: number;
  orders?: Order[];
}

export type AdminDashboardSelection = {
  start: number;
  end: number;
  sellerId?: number;
  showInactive?: boolean;
  showDeleted?: boolean;
  showHidden?: boolean;
  reloadActivities: boolean;
  reloadOrders: boolean;
  filterAdmins: boolean;
  currentLogins?: number;
  currentDashboardData?: IDashboardData;
}

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
  ResetButtonClicked = 24
}

export type UserActivity = {
  activityType: UserActivityType;
  activityName?: string;
  userId?: number;
  username?: string;
  activityData?: string;
  timestamp: string;
}

export type AdminSelection = {
  reloadUsers: boolean,
  reloadRoles: boolean,
  selectedUser: User | undefined,
  selectedRole: Role | undefined,
  roles?: Role[] | undefined,
  users?: User[] | undefined
}

export type AdminReportsSelection = {
  start?: number,
  end?: number,
  reloadData?: boolean
}

export type UserLoginResponse = {
  user?: User;
  loginError?: string;
}

export type UserResponse = {
  user?: User;
  errorMessage?: string;
}

export enum ForgotPasswordMode {
  SendPasswordReset,
  ValidateResetCode,
  ResetPassword
};

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
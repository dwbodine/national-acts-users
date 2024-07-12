import { VipEvent } from "./event";

export type LoginResponse = {
  user?: User;
  loginError?: string;
}

export enum UserRole {
  SystemAdmin = 1,
  AccountAdmin = 2,
  AccountManager = 3,
  MerchPerson = 4
};

export type User = {
  userId: number;
  role: UserRole;
  username: string;
  firstName?: string;
  lastName?: string;
  notes?: string;
  createdAt?: string;
  isAuthenticated?: boolean;
  token?: string;
  isActive: boolean;  
  sellers?: UserSeller[];
  selectedSellerId?: number;
};

export enum UserSellerType {
  Artist = 1,
  Venue = 2,
  Promoter = 3
};

export type UserSeller = {
    sellerId: number;
    sellerName: string;
    sellerType: UserSellerType;
}

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
}

export type AdminDashboardSelection = {
  start?: number;
  end?: number;
  reloadEvents?: boolean;
  retainDateSelection?: boolean;
  currentEvents?: VipEvent[];
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
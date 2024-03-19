import { VipEvent } from "./event";

export type LoginResponse = {
  user?: User;
  loginError?: string;
}

export type User = {
  userId: number;
  username: string;
  firstName?: string;
  lastName?: string;
  notes?: string;
  createdAt?: string;
  isAuthenticated?: boolean;
  token?: string;
  isActive: boolean;  
  isAdmin: boolean;
  showInactiveEvents: boolean;
  sellers?: UserSeller[];
  selectedSellerId?: number;
};

export type UserSeller = {
    sellerId: number;
    sellerName: string;
}

export type UserReportSelection = {
  seller: UserSeller;
  start?: number;
  end?: number;
  showInactive?: boolean;
  showDeleted?: boolean;
  reloadEvents?: boolean;
  retainDateSelection?: boolean;
  currentEvents?: VipEvent[];
  selectedEvent?: VipEvent;
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
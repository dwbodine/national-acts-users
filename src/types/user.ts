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
};

export type UserSeller = {
    sellerId: number;
    sellerName: string;
}

export type UserReportSelection = {
  sellerId: number;
  start?: number;
  end?: number;
  showInactive?: boolean;
  showDeleted?: boolean;
  reloadEvents?: boolean;
}
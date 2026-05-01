import { Seller, SellerType } from '@/types/event';
import { Role, User, UserSeller } from '@/types/user';

export type AdminUserFormValues = {
  disableCheckIn: boolean;
  firstName?: string;
  isActive: boolean;
  lastName?: string;
  mobile?: string;
  notes?: string;
  password?: string;
  requireResetPassword: boolean;
  sendEmailReset: boolean;
  sendTextReset: boolean;
  userId?: number;
  username?: string;
  editPassword: boolean;
};

export function getAdminUserFormValues(
  selectedUser: User,
  editPassword: boolean = false,
): AdminUserFormValues {
  return {
    disableCheckIn: selectedUser.disableCheckIn ?? false,
    firstName: selectedUser.firstName ?? '',
    isActive: selectedUser.isActive ?? false,
    lastName: selectedUser.lastName ?? '',
    mobile: selectedUser.mobile ?? '',
    notes: selectedUser.notes ?? '',
    password: undefined,
    requireResetPassword: selectedUser.requireResetPassword ?? true,
    sendEmailReset: selectedUser.sendEmailReset ?? false,
    sendTextReset: selectedUser.sendTextReset ?? false,
    userId: selectedUser.userId,
    username: selectedUser.username ?? '',
    editPassword: editPassword,
  };
}

export function updateUserSellerAssignment(
  selectedUser: User,
  allSellers: Seller[] | undefined,
  sellerId: number,
  newSellerId: number | null,
): User | undefined {
  if (isNaN(sellerId) || !newSellerId || isNaN(newSellerId)) {
    return undefined;
  }

  const user: User = { ...selectedUser };
  const userSellers = user.sellers ? [...user.sellers] : [];
  const newSeller = allSellers?.find((seller) => seller.sellerId === newSellerId);

  if (!newSeller) {
    return undefined;
  }

  for (let i = 0; i < userSellers.length; i += 1) {
    const userSeller = { ...userSellers[i] } as UserSeller;
    if (userSeller.sellerId === sellerId) {
      userSeller.sellerId = newSellerId;
      userSeller.sellerName = newSeller.name;
      userSeller.sellerType = newSeller.sellerType;
      userSellers[i] = userSeller;
      break;
    }
  }

  user.sellers = userSellers;
  return user;
}

export function updateUserRoleAssignment(
  selectedUser: User,
  allRoles: Role[] | undefined,
  sellerId: number,
  newRoleId: number | null,
): User | undefined {
  if (!sellerId || isNaN(sellerId) || !newRoleId || isNaN(newRoleId)) {
    return undefined;
  }

  const newRole = allRoles?.find((role) => role.roleId === newRoleId);
  if (!newRole || !selectedUser.sellers) {
    return undefined;
  }

  return {
    ...selectedUser,
    sellers: selectedUser.sellers.map((seller) =>
      seller.sellerId === sellerId ? { ...seller, roleId: newRole.roleId } : { ...seller },
    ),
  };
}

export function addSellerToUser(selectedUser: User): User | undefined {
  const user: User = { ...selectedUser };
  const userSellers = user.sellers ? [...user.sellers] : [];
  const existingAdd = userSellers.find((seller) => seller.sellerId === 0);

  if (existingAdd) {
    return undefined;
  }

  userSellers.push({
    sellerId: 0,
    sellerName: '',
    sellerType: SellerType.Artist,
  });
  user.sellers = userSellers;

  return user;
}

export function removeSellerFromUser(selectedUser: User, sellerIdInput: number): User {
  let sellerId = sellerIdInput;

  if (!sellerId || isNaN(sellerId)) {
    sellerId = 0;
  }

  return {
    ...selectedUser,
    sellers: (selectedUser.sellers ?? []).filter((seller) => seller.sellerId !== sellerId),
  };
}

export function validateAdminUserSubmission(
  selectedUser: User,
  users: User[] | undefined,
  values: AdminUserFormValues,
): string | undefined {
  if (!values.username) {
    return 'Username cannot be blank';
  }

  if (
    users &&
    users.find((user) => user.username === values.username && user.userId !== selectedUser.userId)
  ) {
    return 'Username already exists, please choose another';
  }

  if (values.editPassword && !values.password) {
    return 'Password cannot be blank';
  }

  if (!values.firstName) {
    return 'First name cannot be blank';
  }

  if (!values.lastName) {
    return 'Last name cannot be blank';
  }

  return undefined;
}

export function buildUserUpdatePayload(selectedUser: User, values: AdminUserFormValues): User {
  const userToUpdate: User = {
    ...selectedUser,
    disableCheckIn: values.disableCheckIn,
    firstName: values.firstName,
    isActive: values.isActive,
    lastName: values.lastName,
    mobile: values.mobile || '',
    notes: values.notes || '',
    requireResetPassword: values.requireResetPassword,
    sendEmailReset: values.sendEmailReset,
    sendTextReset: values.sendTextReset,
    username: values.username ?? '',
  };

  if (values.editPassword) {
    userToUpdate.password = values.password;
  }

  return userToUpdate;
}

export function hasInvalidSellerAssignments(user: User): boolean {
  return (
    user.sellers === undefined ||
    user.sellers.length === 0 ||
    user.sellers.find((seller) => seller.sellerId === 0) !== undefined ||
    user.sellers.find((seller) => seller.roleId === undefined || seller.roleId === 0) !== undefined
  );
}

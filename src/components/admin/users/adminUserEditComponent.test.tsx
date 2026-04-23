import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { setReloadUsers } from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { SellerType } from '@/types/event';
import type { AdminSelection, User } from '@/types/user';

const adminUserEditMocks = vi.hoisted(() => ({
  deleteUser: vi.fn(),
  dispatch: vi.fn(),
  getAllCountries: vi.fn(),
  getAllRoles: vi.fn(),
  getSellers: vi.fn(),
  push: vi.fn(),
  toast: {
    dismiss: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
    warn: vi.fn(),
    warning: vi.fn(),
  },
  updateUser: vi.fn(),
}));

const adminStateRef = vi.hoisted(() => ({
  state: {} as AdminSelection,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: adminUserEditMocks.push,
  }),
}));

vi.mock('react-icons/fa', () => ({
  FaPlus: () => 'plus',
}));

vi.mock('react-redux', () => ({
  useDispatch: () => adminUserEditMocks.dispatch,
  useSelector: (selector: (state: { adminSelection: AdminSelection }) => unknown) =>
    selector({ adminSelection: adminStateRef.state }),
}));

vi.mock('react-toastify', () => ({
  toast: adminUserEditMocks.toast,
}));

vi.mock('@/components/common/PageHeaderComponent', () => ({
  default: ({ pageTitle }: { pageTitle: string }) => <div>{pageTitle}</div>,
}));

vi.mock('@/hooks/admin/useDeleteUser', () => ({
  useDeleteUser: () => ({
    deleteUser: adminUserEditMocks.deleteUser,
  }),
}));

vi.mock('@/hooks/admin/useGetAllCountries', () => ({
  useGetAllCountries: () => ({
    getAllCountries: adminUserEditMocks.getAllCountries,
  }),
}));

vi.mock('@/hooks/admin/useGetAllRoles', () => ({
  useGetAllRoles: () => ({
    getAllRoles: adminUserEditMocks.getAllRoles,
  }),
}));

vi.mock('@/hooks/admin/useUpdateUser', () => ({
  useUpdateUser: () => ({
    updateUser: adminUserEditMocks.updateUser,
  }),
}));

vi.mock('@/hooks/common/useGetSellers', () => ({
  useGetSellers: () => ({
    getSellers: adminUserEditMocks.getSellers,
  }),
}));

vi.mock('rsuite', async () => {
  const React = await import('react');

  return {
    Button: ({ children, onClick, ...props }: { children?: ReactNode; onClick?: () => void }) =>
      React.createElement('button', { onClick, type: 'button', ...props }, children),
    Checkbox: ({
      checked,
      children,
      disabled,
      onChange,
      ...props
    }: {
      checked?: boolean;
      children?: ReactNode;
      disabled?: boolean;
      onChange?: (value: unknown, checked: boolean, event: Event) => void;
    }) =>
      React.createElement(
        'label',
        props,
        React.createElement('input', {
          checked: checked ?? false,
          disabled,
          onChange: (event: Event & { target: HTMLInputElement }) =>
            onChange?.(undefined, event.target.checked, event),
          type: 'checkbox',
        }),
        children,
      ),
    Input: ({
      as,
      onChange,
      value,
      ...props
    }: {
      as?: string;
      onChange?: (value: string, event: Event) => void;
      value?: string;
    }) =>
      React.createElement(as === 'textarea' ? 'textarea' : 'input', {
        ...props,
        onChange: (event: Event & { target: HTMLInputElement | HTMLTextAreaElement }) =>
          onChange?.(event.target.value, event),
        value: value ?? '',
      }),
  };
});

vi.mock('../../common/confirmationDialogComponent', () => ({
  default: ({
    CancelText,
    ConfirmText,
    Message,
    OnCancel,
    OnConfirm,
  }: {
    CancelText: string;
    ConfirmText: string;
    Message: string;
    OnCancel: () => void;
    OnConfirm: () => void;
  }) => (
    <div data-testid="confirmation-dialog">
      <span>{Message}</span>
      <button onClick={OnConfirm}>{ConfirmText}</button>
      <button onClick={OnCancel}>{CancelText}</button>
    </div>
  ),
}));

vi.mock('../common/adminSellerSelectComponent', () => ({
  default: ({
    OnDelete,
    OnRoleChange,
    OnSellerChange,
    SellerId,
  }: {
    OnDelete?: () => void;
    OnRoleChange?: (roleId: number | null) => void;
    OnSellerChange?: (sellerId: number | null) => void;
    SellerId: number;
  }) => (
    <div data-testid={`seller-row-${SellerId}`}>
      <button onClick={() => OnSellerChange?.(13)}>Change Seller</button>
      <button onClick={() => OnRoleChange?.(3)}>Change Role</button>
      <button onClick={OnDelete}>Remove Seller</button>
    </div>
  ),
}));

import AdminUserEdit from './adminUserEditComponent';

const buildUser = (overrides: Partial<User> = {}): User => ({
  disableCheckIn: false,
  firstName: 'Jane',
  isActive: true,
  isAdmin: false,
  lastName: 'Doe',
  mobile: '555-1111',
  notes: 'Original notes',
  requireResetPassword: true,
  sellers: [
    {
      roleId: 2,
      sellerId: 12,
      sellerName: 'Red Rocks',
      sellerType: SellerType.Artist,
    },
  ],
  sendEmailReset: false,
  sendTextReset: false,
  userId: 7,
  username: 'jane@example.com',
  ...overrides,
});

const buildAdminState = (overrides: Partial<AdminSelection> = {}): AdminSelection => ({
  countries: [],
  reloadCountries: false,
  selectedUser: buildUser(),
  users: [buildUser()],
  ...overrides,
});

describe('AdminUserEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    adminStateRef.state = buildAdminState();
    adminUserEditMocks.getAllCountries.mockResolvedValue({
      countries: [{ countryId: 1, countryName: 'United States' }],
    });
    adminUserEditMocks.getAllRoles.mockResolvedValue({
      roles: [
        { roleId: 1, roleName: 'Admin' },
        { roleId: 2, roleName: 'User' },
        { roleId: 3, roleName: 'Manager' },
      ],
    });
    adminUserEditMocks.getSellers.mockResolvedValue({
      sellers: [
        { name: 'Red Rocks', sellerId: 12, sellerType: SellerType.Artist },
        { name: 'Madison Square Garden', sellerId: 13, sellerType: SellerType.Venue },
      ],
    });
    adminUserEditMocks.updateUser.mockResolvedValue({ success: true });
    adminUserEditMocks.deleteUser.mockResolvedValue({ success: true });
  });

  it('redirects back to the user list when no user is selected', async () => {
    adminStateRef.state = buildAdminState({
      selectedUser: undefined,
    });

    render(<AdminUserEdit />);

    await waitFor(() => {
      expect(adminUserEditMocks.push).toHaveBeenCalledWith('/admin/users');
    });
  });

  it('warns instead of saving when seller assignments are invalid', async () => {
    const user = userEvent.setup();

    adminStateRef.state = buildAdminState({
      selectedUser: buildUser({
        sellers: [{ sellerId: 0, sellerName: '', sellerType: SellerType.Artist }],
      }),
      users: [buildUser({ sellers: [{ sellerId: 0, sellerType: SellerType.Artist }] })],
    });

    render(<AdminUserEdit />);

    await waitFor(() => {
      expect(adminUserEditMocks.getSellers).toHaveBeenCalled();
      expect(adminUserEditMocks.getAllRoles).toHaveBeenCalled();
    });

    adminUserEditMocks.dispatch.mockClear();

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(adminUserEditMocks.updateUser).not.toHaveBeenCalled();
    expect(adminUserEditMocks.toast.warning).toHaveBeenCalledWith(
      'Seller selection invalid, please correct before submitting',
    );
  });

  it('submits a valid user update and navigates back on success', async () => {
    const user = userEvent.setup();

    render(<AdminUserEdit />);

    await waitFor(() => {
      expect(adminUserEditMocks.getSellers).toHaveBeenCalled();
      expect(adminUserEditMocks.getAllRoles).toHaveBeenCalled();
    });

    adminUserEditMocks.dispatch.mockClear();

    await user.clear(screen.getByPlaceholderText('First Name'));
    await user.type(screen.getByPlaceholderText('First Name'), 'Janet');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(adminUserEditMocks.updateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Janet',
          userId: 7,
          username: 'jane@example.com',
        }),
      );
      expect(adminUserEditMocks.push).toHaveBeenCalledWith('/admin/users');
    });

    expect(adminUserEditMocks.dispatch).toHaveBeenCalledWith(setIsLoading(true));
    expect(adminUserEditMocks.dispatch).toHaveBeenCalledWith(setReloadUsers(true));
    expect(adminUserEditMocks.dispatch).toHaveBeenCalledWith(setIsLoading(false));
    expect(adminUserEditMocks.toast.success).toHaveBeenCalledWith('User updated successfully');
  });

  it('opens delete confirmation and deletes the current user when confirmed', async () => {
    const user = userEvent.setup();

    render(<AdminUserEdit />);

    await waitFor(() => {
      expect(adminUserEditMocks.getSellers).toHaveBeenCalled();
      expect(adminUserEditMocks.getAllRoles).toHaveBeenCalled();
    });

    adminUserEditMocks.dispatch.mockClear();

    await user.click(screen.getByRole('button', { name: 'Delete User' }));

    expect(adminUserEditMocks.toast.warning).toHaveBeenCalledTimes(1);

    const confirmation = adminUserEditMocks.toast.warning.mock.calls[0]?.[0] as ReactElement<{
      OnConfirm: () => void;
    }>;

    confirmation.props.OnConfirm();

    await waitFor(() => {
      expect(adminUserEditMocks.deleteUser).toHaveBeenCalledWith(7);
      expect(adminUserEditMocks.push).toHaveBeenCalledWith('/admin/users');
    });

    expect(adminUserEditMocks.dispatch).toHaveBeenCalledWith(setReloadUsers(true));
    expect(adminUserEditMocks.toast.success).toHaveBeenCalledWith('User deleted successfully');
  });
});

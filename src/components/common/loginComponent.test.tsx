import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { setCountries } from '@/lib/adminSelectionSlice';
import { setForAdmin } from '@/lib/reportSelectionSlice';

const loginComponentMocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  getAllCountries: vi.fn(),
  login: vi.fn(),
  push: vi.fn(),
  resetStores: vi.fn(),
}));

vi.mock('next/image', async () => {
  const React = await import('react');

  return {
    default: (props: Record<string, unknown>) => React.createElement('img', props),
  };
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: loginComponentMocks.push,
  }),
}));

vi.mock('react-redux', () => ({
  useDispatch: () => loginComponentMocks.dispatch,
}));

vi.mock('@/hooks/admin/useGetAllCountries', () => ({
  useGetAllCountries: () => ({
    getAllCountries: loginComponentMocks.getAllCountries,
  }),
}));

vi.mock('@/hooks/common/useResetStores', () => ({
  useResetStores: () => ({
    resetStores: loginComponentMocks.resetStores,
  }),
}));

vi.mock('@/hooks/user/useLogin', () => ({
  useLogin: () => ({
    login: loginComponentMocks.login,
  }),
}));

vi.mock('rsuite', async () => {
  const React = await import('react');

  return {
    Button: ({ children, onClick, ...props }: { children?: ReactNode; onClick?: () => void }) =>
      React.createElement('button', { onClick, type: 'button', ...props }, children),
    Col: ({ children, ...props }: { children?: ReactNode }) =>
      React.createElement('div', props, children),
    Input: ({
      onChange,
      onKeyDown,
      onKeyUp,
      value,
      ...props
    }: {
      onChange?: (value: string, event: Event) => void;
      onKeyDown?: (event: KeyboardEvent) => void;
      onKeyUp?: (event: KeyboardEvent) => void;
      value?: string;
    }) =>
      React.createElement('input', {
        ...props,
        onChange: (event: Event & { target: HTMLInputElement }) =>
          onChange?.(event.target.value, event),
        onKeyDown,
        onKeyUp,
        value: value ?? '',
      }),
    Row: ({ children, ...props }: { children?: ReactNode }) =>
      React.createElement('div', props, children),
  };
});

vi.mock('rsuite/Container', async () => {
  const React = await import('react');

  return {
    default: ({ children, ...props }: { children?: ReactNode }) =>
      React.createElement('div', props, children),
  };
});

import LoginComponent from './loginComponent';

describe('LoginComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    window.history.pushState({}, '', '/login');

    loginComponentMocks.getAllCountries.mockResolvedValue({
      countries: [{ countryId: 1, countryName: 'United States' }],
    });
  });

  it('shows a validation error when credentials are missing', async () => {
    const user = userEvent.setup();

    render(<LoginComponent />);

    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(loginComponentMocks.resetStores).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('Please enter username and password')).toBeInTheDocument();
    expect(loginComponentMocks.login).not.toHaveBeenCalled();
  });

  it('dispatches admin state and redirects to the return path after a successful login', async () => {
    const user = userEvent.setup();

    window.history.pushState({}, '', '/login?returnPath=%2Fadmin%2Fusers');
    loginComponentMocks.login.mockResolvedValue({
      user: {
        isAdmin: true,
        isAuthenticated: true,
      },
    });

    render(<LoginComponent />);

    await user.type(screen.getByPlaceholderText('username'), 'admin@example.com');
    await user.type(screen.getByPlaceholderText('password'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(loginComponentMocks.login).toHaveBeenCalledWith('admin@example.com', 'secret123');
      expect(loginComponentMocks.getAllCountries).toHaveBeenCalledTimes(1);
      expect(loginComponentMocks.push).toHaveBeenCalledWith('/admin/users');
    });

    expect(loginComponentMocks.dispatch).toHaveBeenCalledWith(setForAdmin(true));
    expect(loginComponentMocks.dispatch).toHaveBeenCalledWith(
      setCountries([{ countryId: 1, countryName: 'United States' }]),
    );
  });

  it('shows the login error returned from the auth hook', async () => {
    const user = userEvent.setup();

    loginComponentMocks.login.mockResolvedValue({
      error: 'Invalid username or password',
    });

    render(<LoginComponent />);

    await user.type(screen.getByPlaceholderText('username'), 'admin@example.com');
    await user.type(screen.getByPlaceholderText('password'), 'wrong-password');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Invalid username or password')).toBeInTheDocument();
    expect(loginComponentMocks.getAllCountries).not.toHaveBeenCalled();
  });
});

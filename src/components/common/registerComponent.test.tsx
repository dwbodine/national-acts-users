import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const registerComponentMocks = vi.hoisted(() => ({
  getSellers: vi.fn(),
  push: vi.fn(),
  register: vi.fn(),
}));

vi.mock('next/image', async () => {
  const React = await import('react');

  return {
    default: (props: Record<string, unknown>) => React.createElement('img', props),
  };
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: registerComponentMocks.push,
  }),
}));

vi.mock('@/hooks/common/useGetSellers', () => ({
  useGetSellers: () => ({
    getSellers: registerComponentMocks.getSellers,
  }),
}));

vi.mock('@/hooks/user/useRegister', () => ({
  useRegister: () => ({
    register: registerComponentMocks.register,
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
    Row: ({ children, ...props }: { children?: ReactNode }) =>
      React.createElement('div', props, children),
    SelectPicker: ({
      cleanable,
      data = [],
      onChange,
      placeholder,
      searchable,
      value,
      ...props
    }: {
      cleanable?: boolean;
      data?: Array<{ label: string; value?: number }>;
      onChange?: (value: number | null, event: Event) => void;
      placeholder?: string;
      searchable?: boolean;
      value?: number | string;
    }) => {
      void cleanable;
      void searchable;

      return React.createElement(
        'select',
        {
          'aria-label': placeholder ?? 'select',
          ...props,
          onChange: (event: Event & { target: HTMLSelectElement }) => {
            const nextValue = event.target.value;
            onChange?.(nextValue === '' ? null : Number(nextValue), event);
          },
          value: value ?? '',
        },
        data.map((item) =>
          React.createElement(
            'option',
            {
              key: `${item.label}-${item.value ?? 'empty'}`,
              value: item.value ?? '',
            },
            item.label,
          ),
        ),
      );
    },
  };
});

vi.mock('rsuite/Container', async () => {
  const React = await import('react');

  return {
    default: ({ children, ...props }: { children?: ReactNode }) =>
      React.createElement('div', props, children),
  };
});

import RegisterComponent from './registerComponent';

describe('RegisterComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    registerComponentMocks.getSellers.mockResolvedValue({
      sellers: [
        {
          name: 'Red Rocks',
          sellerId: 12,
          sellerType: 1,
        },
      ],
    });
    registerComponentMocks.register.mockResolvedValue({});
  });

  it('shows a validation error before calling register', async () => {
    const user = userEvent.setup();

    render(<RegisterComponent />);

    await waitFor(() => {
      expect(registerComponentMocks.getSellers).toHaveBeenCalledTimes(1);
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Username cannot be blank')).toBeInTheDocument();
    expect(registerComponentMocks.register).not.toHaveBeenCalled();
  });

  it('submits the form and shows a success message when registration succeeds', async () => {
    const user = userEvent.setup();
    const { container } = render(<RegisterComponent />);

    await waitFor(() => {
      expect(registerComponentMocks.getSellers).toHaveBeenCalledTimes(1);
    });

    await user.type(screen.getByPlaceholderText('Enter email address'), 'jane@example.com');
    await user.type(screen.getByPlaceholderText('First name'), 'Jane');
    await user.type(screen.getByPlaceholderText('Last name'), 'Doe');
    await user.selectOptions(screen.getByLabelText('-- Select One --'), '12');
    await user.type(screen.getByPlaceholderText('Password'), 'secret123');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'secret123');
    const notesField = container.querySelector('textarea');
    expect(notesField).not.toBeNull();
    await user.type(notesField!, 'Please approve quickly');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(registerComponentMocks.register).toHaveBeenCalledWith(
        'jane@example.com',
        'Jane',
        'Doe',
        12,
        'secret123',
        'secret123',
        'Please approve quickly',
      );
    });

    expect(
      await screen.findByText(
        'User registration succeeded, please wait for response from the administrator',
      ),
    ).toBeInTheDocument();
  });

  it('shows a seller-loading fallback error when fetching sellers fails', async () => {
    registerComponentMocks.getSellers.mockRejectedValueOnce(new Error('network error'));

    render(<RegisterComponent />);

    expect(
      await screen.findByText('Unknown error occurred while fetching sellers'),
    ).toBeInTheDocument();
    expect(registerComponentMocks.register).not.toHaveBeenCalled();
  });

  it('blocks submit when the passwords do not match', async () => {
    const user = userEvent.setup();

    render(<RegisterComponent />);

    await waitFor(() => {
      expect(registerComponentMocks.getSellers).toHaveBeenCalledTimes(1);
    });

    await user.type(screen.getByPlaceholderText('Enter email address'), 'jane@example.com');
    await user.type(screen.getByPlaceholderText('First name'), 'Jane');
    await user.type(screen.getByPlaceholderText('Last name'), 'Doe');
    await user.selectOptions(screen.getByLabelText('-- Select One --'), '12');
    await user.type(screen.getByPlaceholderText('Password'), 'secret123');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'different123');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
    expect(registerComponentMocks.register).not.toHaveBeenCalled();
  });
});

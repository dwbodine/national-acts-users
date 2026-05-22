import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
    const { container } = render(<RegisterComponent />);

    await waitFor(() => {
      expect(registerComponentMocks.getSellers).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(screen.getByPlaceholderText('Enter email address'), {
      target: { value: 'a@b.co' },
    });
    fireEvent.change(screen.getByPlaceholderText('First name'), {
      target: { value: 'Ja' },
    });
    fireEvent.change(screen.getByPlaceholderText('Last name'), {
      target: { value: 'Do' },
    });
    fireEvent.change(screen.getByLabelText('-- Select One --'), {
      target: { value: '12' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'secret' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'secret' },
    });
    const notesField = container.querySelector('textarea');
    expect(notesField).not.toBeNull();
    fireEvent.change(notesField!, { target: { value: 'ok' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(registerComponentMocks.register).toHaveBeenCalledWith(
        'a@b.co',
        'Ja',
        'Do',
        12,
        'secret',
        'secret',
        'ok',
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
    render(<RegisterComponent />);

    await waitFor(() => {
      expect(registerComponentMocks.getSellers).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(screen.getByPlaceholderText('Enter email address'), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('First name'), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByPlaceholderText('Last name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText('-- Select One --'), {
      target: { value: '12' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'secret123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'different123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
    expect(registerComponentMocks.register).not.toHaveBeenCalled();
  });
});

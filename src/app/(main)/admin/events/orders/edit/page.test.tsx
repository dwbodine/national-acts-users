import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/common/adminPageComponent', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock('@/components/admin/events/orders/adminOrderEditComponent', () => ({
  default: ({ Id }: { Id: number }) => <div>Editing partner order {Id}</div>,
}));

import AdminOrdersEdit from './page';

describe('order edit links', () => {
  it('opens the explicit partner order ID', async () => {
    render(await AdminOrdersEdit({ searchParams: Promise.resolve({ partnerOrderId: '202' }) }));
    expect(screen.getByText('Editing partner order 202')).toBeInTheDocument();
  });

  it.each([{ id: '202' }, { partnerOrderId: '-1' }, { partnerOrderId: 'unknown' }])(
    'rejects legacy or invalid IDs instead of looking up an unrelated mapping: %o',
    async (params) => {
      render(await AdminOrdersEdit({ searchParams: Promise.resolve(params) }));
      expect(screen.getByText(/This order link is no longer valid/)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Go to events' })).toHaveAttribute(
        'href',
        '/admin/events',
      );
      expect(screen.queryByText(/Editing partner order/)).not.toBeInTheDocument();
    },
  );
});

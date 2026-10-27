import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import moment from 'moment';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { adminService } from '@/services';

import AdminPaymentsIndex from './adminPaymentsIndexComponent';

const navigation = vi.hoisted(() => ({ push: vi.fn(), dispatch: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => navigation }));
vi.mock('react-redux', () => ({ useDispatch: () => navigation.dispatch }));

vi.mock('@/services', () => ({ adminService: { getMissingPayments: vi.fn() } }));
vi.mock('@/components/common/PageHeaderComponent', () => ({
  default: () => <h1>Missing Payments</h1>,
}));

const emptyReport = {
  totalOrders: 0,
  missingPaymentIntents: 0,
  missingPercentage: null,
  months: [],
  orders: [],
  limit: 100,
  offset: 0,
  startDate: '2026-10-01',
  endDateExclusive: '2026-10-27',
};

describe('AdminPaymentsIndex', () => {
  beforeEach(() => {
    vi.mocked(adminService.getMissingPayments).mockResolvedValue({ report: emptyReport });
  });

  it('loads month to date and includes the entire selected through date', async () => {
    render(<AdminPaymentsIndex />);
    expect(await screen.findByText(/No missing payments found/)).toBeInTheDocument();
    expect(adminService.getMissingPayments).toHaveBeenCalledWith(
      moment().startOf('month').format('YYYY-MM-DD'),
      moment().add(1, 'day').format('YYYY-MM-DD'),
      0,
    );
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2026-09-01' } });
    fireEvent.change(screen.getByLabelText('Through'), { target: { value: '2026-09-30' } });
    fireEvent.click(screen.getByRole('button', { name: 'Show missing payments' }));
    await waitFor(() =>
      expect(adminService.getMissingPayments).toHaveBeenLastCalledWith(
        '2026-09-01',
        '2026-10-01',
        0,
      ),
    );
  });

  it('displays failures and allows retrying', async () => {
    vi.mocked(adminService.getMissingPayments).mockResolvedValueOnce({ error: 'Request failed' });
    render(<AdminPaymentsIndex />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Request failed');
    fireEvent.click(screen.getByRole('button', { name: 'Show missing payments' }));
    expect(await screen.findByText(/No missing payments found/)).toBeInTheDocument();
  });

  it('shows order details and paginates using the applied dates', async () => {
    vi.mocked(adminService.getMissingPayments).mockResolvedValueOnce({
      report: {
        ...emptyReport,
        missingPaymentIntents: 101,
        orders: [
          {
            TicketSocketOrderId: 1,
            NativeOrderId: 42,
            TicketSocketId: 4,
            EventId: 5,
            EventTitle: 'Test concert',
            CustomerEmail: 'customer@example.com',
            IsManualTransfer: 1,
          } as never,
        ],
      },
    });
    render(<AdminPaymentsIndex />);
    expect(await screen.findByText('customer@example.com')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Add'));
    expect(navigation.dispatch.mock.calls[0]?.[0]).toMatchObject({
      type: 'adminSelection/setMissingPaymentOrder',
      payload: {
        TicketSocketOrderId: 1,
        NativeOrderId: 42,
        TicketSocketId: 4,
        EventId: 5,
        EventTitle: 'Test concert',
        CustomerEmail: 'customer@example.com',
      },
    });
    expect(navigation.push).toHaveBeenCalledWith('/admin/missing-payments/edit');
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2026-01-01' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() =>
      expect(adminService.getMissingPayments).toHaveBeenLastCalledWith(
        moment().startOf('month').format('YYYY-MM-DD'),
        moment().add(1, 'day').format('YYYY-MM-DD'),
        100,
      ),
    );
  });

  it('prevents requesting an inverted range', async () => {
    render(<AdminPaymentsIndex />);
    await screen.findByText(/No missing payments found/);
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2027-01-01' } });
    expect(screen.getByRole('button', { name: 'Show missing payments' })).toBeDisabled();
    expect(screen.getByRole('alert')).toHaveTextContent('Select a start date');
  });
});

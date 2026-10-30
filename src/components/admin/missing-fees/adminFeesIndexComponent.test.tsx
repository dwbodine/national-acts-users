import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { adminService } from '@/services';
import { MissingFeesReport } from '@/types/missingFees';

import AdminFeesIndex from './adminFeesIndexComponent';

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  dates: { start: 1790812800, end: 1793318400 },
}));
vi.mock('react-redux', () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: () => mocks.dates,
}));
vi.mock('@/services', () => ({
  adminService: { getMissingFees: vi.fn(), updatePaymentIntent: vi.fn() },
}));
vi.mock('@/components/common/PageHeaderComponent', () => ({
  default: () => <h1>Missing Fees</h1>,
}));

const report: MissingFeesReport = {
  total: 101,
  limit: 100,
  offset: 0,
  payments: [
    {
      StripePaymentIntentId: 42,
      PaymentIntentId: 'pi_existing',
      Description: 'Order 123',
      DateReceived: '2026-10-01T12:00:00Z',
      Total: '100.00',
      Currency: 'eur',
      StripeAccount: 'acct_existing',
      ProcessingFeeCurrency: 'usd',
      ProcessingFee: '3.50',
      RadarFee: null,
      Insurance: '1.250000',
    },
  ],
};

describe('AdminFeesIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(adminService.getMissingFees).mockResolvedValue({ report });
    vi.mocked(adminService.updatePaymentIntent).mockResolvedValue({ success: true });
  });

  it('applies inclusive through dates and age filters and paginates with the applied filters', async () => {
    render(<AdminFeesIndex />);
    await screen.findByRole('button', { name: 'Edit fees for pi_existing' });
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2026-09-01' } });
    fireEvent.change(screen.getByLabelText('Through'), { target: { value: '2026-09-30' } });
    fireEvent.change(screen.getByLabelText('Minimum age (days)'), { target: { value: '14' } });
    fireEvent.click(screen.getByRole('button', { name: 'Show missing fees' }));
    await waitFor(() =>
      expect(adminService.getMissingFees).toHaveBeenLastCalledWith(
        '2026-09-01',
        '2026-10-01',
        14,
        0,
      ),
    );
    await screen.findByRole('button', { name: 'Edit fees for pi_existing' });
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2026-08-01' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() =>
      expect(adminService.getMissingFees).toHaveBeenLastCalledWith(
        '2026-09-01',
        '2026-10-01',
        14,
        100,
      ),
    );
  });

  it('prefills fees and saves only the existing local ID and fee fields, preserving zero and unknown values', async () => {
    render(<AdminFeesIndex />);
    fireEvent.click(await screen.findByRole('button', { name: 'Edit fees for pi_existing' }));
    expect(screen.getByLabelText('Processing fee *')).toHaveValue(3.5);
    expect(screen.getByLabelText('Insurance')).toHaveValue(1.25);
    fireEvent.change(screen.getByLabelText('Processing fee *'), { target: { value: '4.25' } });
    fireEvent.change(screen.getByLabelText('Radar fee'), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText('Insurance'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save fees' }));
    await screen.findByText('Payment intent fees updated.');
    expect(adminService.updatePaymentIntent).toHaveBeenCalledWith({
      StripePaymentIntentId: 42,
      ProcessingFee: '4.25',
      RadarFee: '0',
      Insurance: null,
    });
    expect(adminService.getMissingFees).toHaveBeenCalledTimes(2);
  });

  it('retains the form on API failure and permits retry or cancel', async () => {
    vi.mocked(adminService.updatePaymentIntent).mockResolvedValueOnce({ error: 'Conflict' });
    render(<AdminFeesIndex />);
    fireEvent.click(await screen.findByRole('button', { name: 'Edit fees for pi_existing' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save fees' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Conflict');
    expect(screen.getByLabelText('Insurance')).toHaveValue(1.25);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('region', { name: 'Edit payment fees' })).not.toBeInTheDocument();
    expect(adminService.updatePaymentIntent).toHaveBeenCalledTimes(1);
  });

  it('shows report errors and supports retrying an empty report', async () => {
    vi.mocked(adminService.getMissingFees)
      .mockResolvedValueOnce({ error: 'Unavailable' })
      .mockResolvedValueOnce({ report: { ...report, total: 0, payments: [] } });
    render(<AdminFeesIndex />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Unavailable');
    fireEvent.click(screen.getByRole('button', { name: 'Show missing fees' }));
    expect(
      await screen.findByText('No missing fees found for this date range.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });
});

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { adminService } from '@/services';

import AdminPaymentsEdit from './adminPaymentEditComponent';

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  dispatch: vi.fn(),
  ticketSocketId: 4,
}));
vi.mock('next/navigation', () => ({ useRouter: () => mocks }));
vi.mock('react-redux', () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: () => ({
    TicketSocketId: mocks.ticketSocketId,
    NativeOrderId: 42,
    NativeEventId: 5,
    TicketPartnerOrderId: 9,
    EventTitle: 'Test concert',
    CustomerEmail: 'customer@example.com',
  }),
}));
vi.mock('@/services', () => ({ adminService: { updatePaymentIntent: vi.fn() } }));
vi.mock('@/components/common/PageHeaderComponent', () => ({
  default: ({ pageTitle }: { pageTitle: string }) => <h1>{pageTitle}</h1>,
}));

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText(/^Payment Amount/), { target: { value: '123.45' } });
  for (const [label, value] of [
    ['Stripe payment intent ID (starts with "pi_")', 'pi_test'],
    ['Payment Succeeded time (Pacific)', '2026-10-26T12:30:00'],
    ['Stripe Processing fees (Not including Radar)', '3.45'],
  ])
    fireEvent.change(screen.getByLabelText(`${label} *`), {
      target: { value },
    });
}

describe('AdminPaymentsEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.ticketSocketId = 4;
  });
  it('prefills order details and saves decimal strings and the selected order link', async () => {
    vi.mocked(adminService.updatePaymentIntent).mockResolvedValue({ success: true });
    render(<AdminPaymentsEdit />);
    expect(screen.getByRole('heading')).toHaveTextContent('Order 42');
    expect(screen.getByLabelText('Customer email (if available)')).toHaveValue(
      'customer@example.com',
    );
    expect(screen.getByLabelText('Description (from Stripe) *')).toHaveValue(
      'tickets.nationalactsvip.com - Order 42',
    );
    for (const label of [
      'Partner order ID *',
      'Native order ID',
      'Native event ID',
      'Event name',
    ]) {
      expect(screen.queryByLabelText(label)).not.toBeInTheDocument();
    }
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: 'Save payment intent' }));
    await waitFor(() =>
      expect(adminService.updatePaymentIntent).toHaveBeenCalledWith(
        expect.objectContaining({
          PaymentIntentId: 'pi_test',
          Total: '123.45',
          ProcessingFee: '3.45',
          TicketPartnerOrderId: 9,
          NativeOrderId: 42,
          NativeEventId: 5,
          EventName: 'Test concert',
          DateReceived: '2026-10-26T19:30:00.000Z',
          Status: 'succeeded',
          ProcessingFeeCurrency: 'usd',
          StripeAccount: 'acct_2SUqOXVCz6LqWAA1fabb',
        }),
      ),
    );
    expect(mocks.push).toHaveBeenCalledWith('/admin/missing-payments');
  });
  it.each([
    ['', false],
    ['0', false],
    ['12.50', true],
  ])('sets insurance verification for insurance amount "%s"', async (amount, verified) => {
    vi.mocked(adminService.updatePaymentIntent).mockResolvedValue({ success: true });
    render(<AdminPaymentsEdit />);
    expect(screen.queryByRole('checkbox', { name: 'Insurance verified' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Application fee')).not.toBeInTheDocument();
    fillRequiredFields();
    fireEvent.change(screen.getByLabelText('Insurance (TicketSocket Stripe Connect fee)'), {
      target: { value: amount },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save payment intent' }));
    await waitFor(() =>
      expect(adminService.updatePaymentIntent).toHaveBeenCalledWith(
        expect.objectContaining({
          Insurance: amount || undefined,
          ApplicationFee: amount || undefined,
          InsuranceVerified: verified,
        }),
      ),
    );
  });

  it.each([
    [1, 'secure.nationalactsvip.com', 'usd'],
    [2, 'europe.nationalactsvip.com', 'eur'],
    [3, 'australia.nationalactsvip.com', 'aud'],
    [4, 'tickets.nationalactsvip.com', 'usd'],
    [5, 'japan.nationalactsvip.com', 'jpy'],
    [6, 'secure.savingabelvip.com', 'usd'],
  ])(
    'uses the source URL and currency for TicketSocket account %s',
    async (id, sourceUrl, currency) => {
      mocks.ticketSocketId = Number(id);
      vi.mocked(adminService.updatePaymentIntent).mockResolvedValue({ success: true });
      render(<AdminPaymentsEdit />);
      expect(screen.queryByLabelText('Source URL *')).not.toBeInTheDocument();
      fillRequiredFields();
      const exchangeRate = screen.queryByLabelText(/Exchange rate/);
      const showExchangeRate = [2, 3, 5].includes(Number(id));
      if (showExchangeRate) {
        expect(exchangeRate).toHaveValue(1);
        expect(exchangeRate).toBeRequired();
        fireEvent.change(exchangeRate!, { target: { value: '1.25' } });
      } else {
        expect(exchangeRate).not.toBeInTheDocument();
      }
      fireEvent.click(screen.getByRole('button', { name: 'Save payment intent' }));
      await waitFor(() =>
        expect(adminService.updatePaymentIntent).toHaveBeenCalledWith(
          expect.objectContaining({
            SourceUrl: sourceUrl,
            Currency: currency,
            ExchangeRate: showExchangeRate ? '1.25' : '1',
          }),
        ),
      );
    },
  );

  it.each([
    ['2026-01-15T12:30', '2026-01-15T20:30:00.000Z'],
    ['2026-07-15T12:30', '2026-07-15T19:30:00.000Z'],
    ['2026-07-15T23:30', '2026-07-16T06:30:00.000Z'],
  ])('converts Pacific date %s to UTC', async (localDate, utcDate) => {
    vi.mocked(adminService.updatePaymentIntent).mockResolvedValue({ success: true });
    render(<AdminPaymentsEdit />);
    fillRequiredFields();
    fireEvent.change(screen.getByLabelText('Payment Succeeded time (Pacific) *'), {
      target: { value: localDate },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save payment intent' }));
    await waitFor(() =>
      expect(adminService.updatePaymentIntent).toHaveBeenCalledWith(
        expect.objectContaining({ DateReceived: utcDate }),
      ),
    );
  });

  it('keeps the form available when the API rejects a payment', async () => {
    vi.mocked(adminService.updatePaymentIntent).mockResolvedValue({
      error: 'Payment already exists',
    });
    render(<AdminPaymentsEdit />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: 'Save payment intent' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Payment already exists');
    expect(mocks.push).not.toHaveBeenCalled();
  });
});

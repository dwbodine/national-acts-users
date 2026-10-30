'use client';

import moment from 'moment-timezone';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'rsuite';

import PageHeader from '@/components/common/PageHeaderComponent';
import { setMissingPaymentOrder } from '@/lib/adminSelectionSlice';
import { RootState } from '@/lib/store';
import { adminService } from '@/services';
import { PaymentIntentInput } from '@/types/missingPayments';

const sourceUrls: Partial<Record<number, string>> = {
  1: 'secure.nationalactsvip.com',
  2: 'europe.nationalactsvip.com',
  3: 'australia.nationalactsvip.com',
  4: 'tickets.nationalactsvip.com',
  5: 'japan.nationalactsvip.com',
  6: 'secure.savingabelvip.com',
};

const currencies: Partial<Record<number, string>> = {
  1: 'usd',
  2: 'eur',
  3: 'aud',
  4: 'usd',
  5: 'jpy',
  6: 'usd',
};

export default function AdminPaymentsEdit({ returnTo }: { returnTo?: string }) {
  const { selectedMissingPaymentOrder: order, start } = useSelector(
    (state: RootState) => state.adminSelection,
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const returnPath = returnTo ?? '/admin/missing-payments';

  useEffect(() => {
    if (!order) router.replace(returnPath);
  }, [order, returnPath, router]);

  if (!order) return null;

  const showExchangeRate = [2, 3, 5].includes(order.TicketSocketId);

  const fields = [
    {
      name: 'PaymentIntentId',
      label: 'Stripe payment intent ID (starts with \"pi_\")',
      required: true,
      max: 100,
      pattern: 'pi_.+',
    },
    { name: 'Description', label: 'Description (from Stripe)', required: true, max: 255 },
    {
      name: 'DateReceived',
      label: 'Payment Succeeded time (Pacific)',
      required: true,
      type: 'datetime-local',
      step: '60',
    },
    {
      name: 'Total',
      label: 'Payment Amount (Total paid in native currency)',
      required: true,
      type: 'number',
      step: '0.01',
      max: 99999999.99,
    },
    {
      name: 'ProcessingFee',
      label: 'Stripe Processing fees (Not including Radar)',
      required: true,
      type: 'number',
      step: '0.01',
      max: 99999999.99,
    },
    {
      name: 'RadarFee',
      label: 'Radar fee (USD)',
      type: 'number',
      step: '0.01',
      max: 99999999.99,
    },
    {
      name: 'Insurance',
      label: 'Insurance (TicketSocket Stripe Connect fee)',
      type: 'number',
      step: '0.000001',
      max: 999999999999.999999,
    },
    {
      name: 'ExchangeRate',
      label: 'Exchange rate (for EUR, AUD or JPY)',
      required: showExchangeRate,
      type: 'number',
      step: '0.000001',
      max: 9999.999999,
    },
    { name: 'CustomerName', label: 'Customer name', max: 100 },
    { name: 'CustomerEmail', label: 'Customer email (if available)', type: 'email', max: 100 },
    { name: 'CustomerPhone', label: 'Customer phone (if available)' },
    {
      name: 'PaymentMethod',
      label: 'Payment method ("card", "link", "affirm", "klarna", etc.)',
      max: 32,
    },
  ];

  const defaults: Record<string, string> = {
    DateReceived:
      start == null ? '' : moment.unix(start).tz('America/Los_Angeles').format('YYYY-MM-DDTHH:mm'),
    Description: `${sourceUrls[order.TicketSocketId] ?? ''} - Order ${order.NativeOrderId}`,
    CustomerName: order.CustomerName ?? '',
    CustomerEmail: order.CustomerEmail ?? '',
    PaymentMethod: 'card',
    ExchangeRate: '1',
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    const sourceUrl = sourceUrls[order.TicketSocketId];
    const currency = currencies[order.TicketSocketId];
    if (!sourceUrl || !currency) {
      setError('No source URL or currency is configured for this TicketSocket account.');
      return;
    }
    const data = new FormData(event.currentTarget);
    const getValue = (name: string) => {
      const entry = data.get(name);
      return typeof entry === 'string' ? entry.trim() : '';
    };
    const getOptionalValue = (name: string) => getValue(name) || undefined;
    const values: PaymentIntentInput = {
      PaymentIntentId: getValue('PaymentIntentId'),
      Description: getValue('Description'),
      DateReceived: moment.tz(getValue('DateReceived'), 'America/Los_Angeles').utc().toISOString(),
      Total: getValue('Total'),
      ProcessingFee: getValue('ProcessingFee'),
      RadarFee: getOptionalValue('RadarFee'),
      Currency: currency,
      SourceUrl: sourceUrl,
      ExchangeRate: showExchangeRate ? getValue('ExchangeRate') : '1',
      TicketPartnerOrderId: order.TicketPartnerOrderId ?? undefined,
      NativeOrderId: Number(order.NativeOrderId),
      NativeEventId: Number(order.NativeEventId),
      EventName: order.EventTitle ?? undefined,
      CustomerName: getOptionalValue('CustomerName'),
      CustomerEmail: getOptionalValue('CustomerEmail'),
      CustomerPhone: getOptionalValue('CustomerPhone'),
      Status: 'succeeded',
      PaymentMethod: getOptionalValue('PaymentMethod'),
      StripeAccount: 'acct_2SUqOXVCz6LqWAA1fabb',
      ProcessingFeeCurrency: 'usd',
      Insurance: getOptionalValue('Insurance'),
      ApplicationFee: getOptionalValue('Insurance'),
      InsuranceVerified: Number(getValue('Insurance')) > 0,
    };
    setSaving(true);
    setError('');
    try {
      const result = await adminService.updatePaymentIntent(values);
      if (!result.success) {
        setError(result.error || 'Unable to save payment intent.');
        return;
      }
      dispatch(setMissingPaymentOrder(undefined));
      router.push(returnPath);
    } catch {
      setError('Unable to save payment intent. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader pageTitle={`Add Payment Intent - Order ${order.NativeOrderId}`} />
      <div className="admin-container">
        <header>
          <p>
            Record an existing successful Stripe payment and link it to this order. -{' '}
            <strong>Amounts are in the local currency - USD, EUR, etc.</strong>
          </p>
          <p>&nbsp;</p>
          <p>
            Account: <strong>{order.AccountName ?? 'Unknown'}</strong>
          </p>
          <p>
            {' '}
            Ticket Socket Order : <strong>{order.NativeOrderId ?? 'Unmapped'}</strong>
          </p>
          <p>
            Event:{' '}
            <strong>
              {order.EventTitle ?? 'Unknown'} (Ticket Socket Event: {order.NativeEventId})
            </strong>
          </p>
          <p>
            {' '}
            Event Date: <strong>{order.EventDate}</strong>
          </p>
          <p>
            Venue:{' '}
            <strong>
              {[order.Venue, order.City, order.State].filter(Boolean).join(', ') || 'Unknown'}
            </strong>
          </p>
          <p>
            Customer:{' '}
            <strong>
              {order.CustomerName || 'Unknown'} ({order.CustomerEmail})
            </strong>
          </p>
          <p>
            {' '}
            Purchased: <strong>{order.PurchaseDate ?? 'Unknown'}</strong>
          </p>
        </header>

        <p> Required fields are marked *.</p>
        {!order.TicketPartnerOrderId && (
          <p>A partner order ID is required to link this payment to an eligible order.</p>
        )}
        <form onSubmit={(event) => void submit(event)}>
          <fieldset disabled={saving}>
            {fields
              .filter((field) => field.name !== 'ExchangeRate' || showExchangeRate)
              .map((field) => (
                <div
                  className="rs-form-group"
                  key={field.name}
                  style={{ marginTop: 5, marginBottom: 10 }}
                >
                  <label htmlFor={field.name}>
                    {field.label}
                    {field.required ? ' *' : ''}
                  </label>
                  <input
                    className="rs-input"
                    style={
                      field.type === 'datetime-local'
                        ? { display: 'block', width: 'auto', maxWidth: '100%' }
                        : undefined
                    }
                    id={field.name}
                    name={field.name}
                    type={field.type ?? 'text'}
                    required={field.required}
                    defaultValue={defaults[field.name] ?? ''}

                    min={field.type === 'number' ? (field.name.endsWith('Id') ? 1 : 0) : undefined}
                    max={field.type === 'number' ? field.max : undefined}
                    maxLength={field.type !== 'number' ? field.max : undefined}
                    step={field.step}
                    pattern={field.pattern}
                  />
                </div>
              ))}
            {error && <p role="alert">{error}</p>}
            <div>
              <Button appearance="primary" type="submit" loading={saving}>
                Save payment intent
              </Button>{' '}
              <Button onClick={() => router.push(returnPath)}>Cancel</Button>
            </div>
          </fieldset>
        </form>
      </div>
    </>
  );
}

'use client';

import moment from 'moment-timezone';
import { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table } from 'rsuite';

import PageHeader from '@/components/common/PageHeaderComponent';
import { setAdminDates } from '@/lib/adminSelectionSlice';
import { RootState } from '@/lib/store';
import { adminService } from '@/services';
import { MissingFeePayment, MissingFeesReport } from '@/types/missingFees';

const { Column, HeaderCell, Cell } = Table;

function FeeEditor({
  payment,
  onClose,
  onSaved,
}: {
  payment: MissingFeePayment;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    const data = new FormData(event.currentTarget);
    const value = (name: string) => {
      const entry = data.get(name);
      return typeof entry === 'string' ? entry.trim() : '';
    };
    setSaving(true);
    setError('');
    try {
      const result = await adminService.updatePaymentIntent({
        StripePaymentIntentId: payment.StripePaymentIntentId,
        ProcessingFee: value('ProcessingFee'),
        RadarFee: value('RadarFee') || null,
        Insurance: value('Insurance') || null,
      });
      if (result.success) onSaved();
      else setError(result.error || 'Unable to save payment intent.');
    } catch {
      setError('Unable to save payment intent. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section aria-label="Edit payment fees">
      <h2>Update fees: {payment.Description}</h2>
      <p>Fees are always recorded in USD.</p>
      <p>Processing fee excludes Radar. </p>
      <p>Leave Radar fee or insurance blank for an unknown amount; enter 0 for a confirmed zero.</p>
      <form onSubmit={(event) => void submit(event)}>
        <fieldset disabled={saving}>
          {(
            [
              ['ProcessingFee', 'Processing fee', '0.01', 99999999.99],
              ['RadarFee', 'Radar fee', '0.01', 99999999.99],
              ['Insurance', 'Insurance', '0.000001', 999999999999.999999],
            ] as const
          ).map(([name, label, step, max]) => (
            <div className="rs-form-group" key={name}>
              <label htmlFor={`fee-${name}`}>
                {label}
                {name === 'ProcessingFee' ? ' *' : ''}
              </label>
              <input
                className="rs-input"
                id={`fee-${name}`}
                name={name}
                type="number"
                required={name === 'ProcessingFee'}
                min="0"
                max={max}
                step={step}
                defaultValue={payment[name] ?? ''}
              />
            </div>
          ))}
          {error && <p role="alert">{error}</p>}
          <Button appearance="primary" type="submit" loading={saving}>
            Save fees
          </Button>{' '}
          <Button onClick={onClose}>Cancel</Button>
        </fieldset>
      </form>
    </section>
  );
}

export default function AdminFeesIndex() {
  const dispatch = useDispatch();
  const savedDates = useSelector((state: RootState) => state.adminSelection);
  const [dates, setDates] = useState(() => ({
    start: (savedDates.start == null
      ? moment().startOf('month')
      : moment.unix(savedDates.start)
    ).format('YYYY-MM-DD'),
    end: (savedDates.end == null ? moment() : moment.unix(savedDates.end)).format('YYYY-MM-DD'),
    days: 0,
  }));
  const [selection, setSelection] = useState(() => ({ ...dates, offset: 0 }));
  const [report, setReport] = useState<MissingFeesReport>();
  const [payment, setPayment] = useState<MissingFeePayment>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const valid = Boolean(
    dates.start &&
    dates.end &&
    dates.start <= dates.end &&
    Number.isInteger(dates.days) &&
    dates.days >= 1,
  );

  useEffect(() => {
    dispatch(
      setAdminDates({ start: moment(selection.start).unix(), end: moment(selection.end).unix() }),
    );
  }, [dispatch, selection.start, selection.end]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      setReport(undefined);
      try {
        const result = await adminService.getMissingFees(
          selection.start,
          moment(selection.end).add(1, 'day').format('YYYY-MM-DD'),
          selection.days,
          selection.offset,
        );
        if (!active) return;
        setReport(result.report);
        setError(result.error || (result.report ? '' : 'Unable to load missing fees.'));
      } catch {
        if (active) setError('Unable to load missing fees. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [selection]);

  return (
    <>
      <PageHeader pageTitle="Missing Fees" />
      <div className="admin-container">
        <p>
          Review succeeded payments without imported payment or charge fee records. Date filters use
          UTC; received times are shown in Pacific time. A manual fee update may leave the payment
          in this report until a fee record is imported.
        </p>
        {message && <p role="status">{message}</p>}
        {payment ? (
          <FeeEditor
            key={payment.StripePaymentIntentId}
            payment={payment}
            onClose={() => setPayment(undefined)}
            onSaved={() => {
              setPayment(undefined);
              setMessage('Payment intent fees updated.');
              setSelection({ ...selection });
            }}
          />
        ) : (
          <>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (valid) {
                  setMessage('');
                  setSelection({ ...dates, offset: 0 });
                }
              }}
            >
              <label htmlFor="missing-fees-start">From </label>
              <input
                id="missing-fees-start"
                type="date"
                required
                value={dates.start}
                onChange={(event) => setDates({ ...dates, start: event.target.value })}
              />{' '}
              <label htmlFor="missing-fees-end">Through </label>
              <input
                id="missing-fees-end"
                type="date"
                required
                min={dates.start}
                value={dates.end}
                onChange={(event) => setDates({ ...dates, end: event.target.value })}
              />{' '}
              <Button type="submit" appearance="primary" disabled={!valid || loading}>
                Show missing fees
              </Button>
              {!valid && <p role="alert">Select a valid date range.</p>}
            </form>
            {loading && <p role="status">Loading missing fees...</p>}
            {error && <p role="alert">{error}</p>}
            {!loading && report && (
              <>
                <p>{report.total} payments missing fee records.</p>
                {report.payments.length === 0 ? (
                  <p>No missing fees found for this date range.</p>
                ) : (
                  <Table
                    height={500}
                    data={report.payments}
                    rowKey="StripePaymentIntentId"
                    bordered
                    cellBordered
                    wordWrap
                  >
                    {(
                      [
                        ['Description', 'Description', 300],
                        ['DateReceived', 'Received (Pacific)', 200],
                        ['Total', 'Payment total', 140],
                        ['Currency', 'Payment currency', 140],
                        ['ProcessingFee', 'Processing fee (USD)', 140],
                        ['RadarFee', 'Radar fee (USD)', 140],
                        ['Insurance', 'Insurance (USD)', 140],
                      ] as const
                    ).map(([key, label, width]) => (
                      <Column key={key} width={width}>
                        <HeaderCell>{label}</HeaderCell>
                        <Cell>
                          {(row: MissingFeePayment) =>
                            key === 'DateReceived'
                              ? moment
                                  .utc(row.DateReceived)
                                  .tz('America/Los_Angeles')
                                  .format('MM/DD/YYYY h:mm A z')
                              : (row[key] ?? 'Unknown')
                          }
                        </Cell>
                      </Column>
                    ))}
                    <Column width={160} fixed="right">
                      <HeaderCell>Update fees</HeaderCell>
                      <Cell>
                        {(row: MissingFeePayment) => (
                          <Button
                            appearance="primary"
                            onClick={() => {
                              setMessage('');
                              setPayment(row);
                            }}
                            aria-label={`Edit fees for ${row.PaymentIntentId}`}
                          >
                            Edit fees
                          </Button>
                        )}
                      </Cell>
                    </Column>
                  </Table>
                )}
                <Button
                  disabled={selection.offset === 0}
                  onClick={() =>
                    setSelection({
                      ...selection,
                      offset: Math.max(0, selection.offset - report.limit),
                    })
                  }
                >
                  Previous
                </Button>{' '}
                <span>Page {Math.floor(selection.offset / report.limit) + 1}</span>{' '}
                <Button
                  disabled={selection.offset + report.limit >= report.total}
                  onClick={() =>
                    setSelection({ ...selection, offset: selection.offset + report.limit })
                  }
                >
                  Next
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

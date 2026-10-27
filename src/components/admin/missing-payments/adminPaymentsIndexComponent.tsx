'use client';

import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table } from 'rsuite';

import PageHeader from '@/components/common/PageHeaderComponent';
import { setAdminDates, setMissingPaymentOrder } from '@/lib/adminSelectionSlice';
import { RootState } from '@/lib/store';
import { adminService } from '@/services';
import { MissingPaymentOrder, MissingPaymentsReport } from '@/types/missingPayments';

const { Column, HeaderCell, Cell } = Table;

export default function AdminPaymentsIndex() {
  const dispatch = useDispatch();
  const router = useRouter();
  const savedDates = useSelector((state: RootState) => state.adminSelection);
  const [dates, setDates] = useState(() => ({
    start: (savedDates.start == null
      ? moment().startOf('month')
      : moment.unix(savedDates.start)
    ).format('YYYY-MM-DD'),
    end: (savedDates.end == null ? moment() : moment.unix(savedDates.end)).format('YYYY-MM-DD'),
  }));
  const [selection, setSelection] = useState(() => ({ ...dates, offset: 0 }));
  const [report, setReport] = useState<MissingPaymentsReport>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const valid = Boolean(dates.start && dates.end && dates.start <= dates.end);

  useEffect(() => {
    dispatch(
      setAdminDates({
        start: moment(selection.start, 'YYYY-MM-DD').unix(),
        end: moment(selection.end, 'YYYY-MM-DD').unix(),
      }),
    );
  }, [dispatch, selection.start, selection.end]);

  useEffect(() => {
    let active = true;
    const loadReport = async (): Promise<void> => {
      try {
        const response = await adminService.getMissingPayments(
          selection.start,
          moment(selection.end).add(1, 'day').format('YYYY-MM-DD'),
          selection.offset,
        );
        if (!active) return;
        setReport(response.report);
        setError(response.error || (response.report ? '' : 'Unable to load missing payments.'));
      } catch {
        if (!active) return;
        setError('Unable to load missing payments. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadReport();
    return () => {
      active = false;
    };
  }, [selection]);

  const addPaymentIntent = (order: MissingPaymentOrder) => {
    if (!order.TicketSocketOrderId || isNaN(order.TicketSocketOrderId)) {
      return;
    }
    dispatch(setMissingPaymentOrder(order));
    router.push('/admin/missing-payments/edit');
  };

  const load = (offset: number, start = selection.start, end = selection.end) => {
    setLoading(true);
    setError('');
    setReport(undefined);
    setSelection({ start, end, offset });
  };

  return (
    <>
      <PageHeader pageTitle="Missing Payments" />
      <div className="admin-container">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (valid) load(0, dates.start, dates.end);
          }}
        >
          <label htmlFor="missing-payments-start">From </label>
          <input
            id="missing-payments-start"
            type="date"
            required
            value={dates.start}
            onChange={(event) => setDates({ ...dates, start: event.target.value })}
          />{' '}
          <label htmlFor="missing-payments-end">Through </label>
          <input
            id="missing-payments-end"
            type="date"
            required
            min={dates.start}
            value={dates.end}
            onChange={(event) => setDates({ ...dates, end: event.target.value })}
          />{' '}
          <Button appearance="primary" type="submit" disabled={!valid || loading}>
            Show missing payments
          </Button>
          {!valid && <p role="alert">Select a start date on or before the through date.</p>}
        </form>
        <p>
          <strong>
            Orders without a linked successful Stripe payment are listed for review.&nbsp;&nbsp; A
            missing link does not necessarily mean the customer has not paid.
          </strong>
        </p>
        {loading && <p role="status">Loading missing payments…</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && report && (
          <>
            <h2>Monthly payment coverage</h2>
            <Table data={report.months} rowKey="Month" autoHeight bordered cellBordered wordWrap>
              <Column flexGrow={1} minWidth={140}>
                <HeaderCell>Month</HeaderCell>
                <Cell>
                  {(month: MissingPaymentsReport['months'][number]) =>
                    moment(month.Month, 'YYYY-MM').format('MMMM YYYY')
                  }
                </Cell>
              </Column>
              <Column flexGrow={1} minWidth={140}>
                <HeaderCell>Total orders</HeaderCell>
                <Cell dataKey="TotalOrders" />
              </Column>
              <Column flexGrow={1} minWidth={140}>
                <HeaderCell>Missing payments</HeaderCell>
                <Cell dataKey="MissingPaymentIntents" />
              </Column>
              <Column flexGrow={1} minWidth={100}>
                <HeaderCell>Missing %</HeaderCell>
                <Cell>
                  {(month: MissingPaymentsReport['months'][number]) =>
                    `${month.MissingPercentage}%`
                  }
                </Cell>
              </Column>
            </Table>
            <h2>Orders missing linked successful payments</h2>
            {report.orders.length === 0 ? (
              <p>No missing payments found for this date range.</p>
            ) : (
              <Table
                height={500}
                data={report.orders.map((order) => ({
                  ...order,
                  rowKey: `${order.TicketSocketId}-${order.TicketSocketOrderId}`,
                }))}
                rowKey="rowKey"
                bordered
                cellBordered
                wordWrap
              >
                <Column width={180}>
                  <HeaderCell>Order ID</HeaderCell>
                  <Cell>{(order: MissingPaymentOrder) => `${order.NativeOrderId}`}</Cell>
                </Column>
                <Column width={180}>
                  <HeaderCell>Event ID</HeaderCell>
                  <Cell>{(order: MissingPaymentOrder) => `${order.NativeEventId}`}</Cell>
                </Column>
                <Column width={180}>
                  <HeaderCell>Account</HeaderCell>
                  <Cell>{(order: MissingPaymentOrder) => `${order.AccountName ?? '?'}`}</Cell>
                </Column>
                <Column width={260}>
                  <HeaderCell>Event / IDs</HeaderCell>
                  <Cell>
                    {(order: MissingPaymentOrder) =>
                      `${order.EventTitle ?? '?'} (${order.EventId} / ${order.NativeEventId})`
                    }
                  </Cell>
                </Column>
                <Column width={180}>
                  <HeaderCell>Event date</HeaderCell>
                  <Cell>{(order: MissingPaymentOrder) => order.EventDate ?? '?'}</Cell>
                </Column>
                <Column width={240}>
                  <HeaderCell>Venue</HeaderCell>
                  <Cell>
                    {(order: MissingPaymentOrder) =>
                      [order.Venue, order.City, order.State].filter(Boolean).join(', ') || '?'
                    }
                  </Cell>
                </Column>
                <Column width={180}>
                  <HeaderCell>Purchase date</HeaderCell>
                  <Cell>{(order: MissingPaymentOrder) => order.PurchaseDate ?? '?'}</Cell>
                </Column>
                <Column width={180}>
                  <HeaderCell>Customer</HeaderCell>
                  <Cell>{(order: MissingPaymentOrder) => order.CustomerName || '?'}</Cell>
                </Column>
                <Column width={260}>
                  <HeaderCell>Email</HeaderCell>
                  <Cell>{(order: MissingPaymentOrder) => order.CustomerEmail || '?'}</Cell>
                </Column>
                <Column flexGrow={1} minWidth={140}>
                  <HeaderCell>Add Missing Payment</HeaderCell>
                  <Cell>
                    {(order: MissingPaymentOrder) => (
                      <button
                        className="rs-btn rs-btn-primary"
                        id={order.TicketSocketOrderId.toString()}
                        onClick={() => addPaymentIntent(order)}
                      >
                        Add
                      </button>
                    )}
                  </Cell>
                </Column>
              </Table>
            )}
            <div>
              <Button
                disabled={selection.offset === 0}
                onClick={() => load(Math.max(0, selection.offset - 100))}
              >
                Previous
              </Button>{' '}
              <span>Page {Math.floor(selection.offset / 100) + 1}</span>{' '}
              <Button
                disabled={selection.offset + report.orders.length >= report.missingPaymentIntents}
                onClick={() => load(selection.offset + 100)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

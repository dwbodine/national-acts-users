'use client';

import { Col, Row } from 'rsuite';

import TwoColumnStatRow from '@/components/common/widgets/TwoColumnStatRow';
import { SalesByAccountWidgetProps } from '@/types/props';

export default function SalesByAccountWidget(props: SalesByAccountWidgetProps) {
  const accountName = props.AccountName;
  const accountTotals = props.AccountTotals;
  const selectedYear = props.SelectedYear;

  let ticketsPerTransaction = 0;
  let averagePurchaseAmountUsd = 0;
  let pricePerTicketUsd = 0;
  let serviceFeePerTicketUsd = 0;
  const tickets = accountTotals?.Tickets ?? 0;
  if (tickets > 0) {
    pricePerTicketUsd = (accountTotals?.RevenueUsd ?? 0) / tickets;
    serviceFeePerTicketUsd = (accountTotals?.ServiceFeesUsd ?? 0) / tickets;
  }
  if (accountTotals?.Purchases) {
    ticketsPerTransaction = tickets / accountTotals.Purchases;
    averagePurchaseAmountUsd = (accountTotals?.TotalRevenueUsd ?? 0) / accountTotals.Purchases;
  }

  return (
    <Row className="sales-stat-block">
      <Col>
        <Row>
          <Col className="sales-stat-block-title">
            Summary By Account {selectedYear ? selectedYear : ''}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-subtitle">{accountName}</Col>
        </Row>
        <TwoColumnStatRow label="Transactions:" value={accountTotals?.Purchases} isInteger />
        <TwoColumnStatRow label="Tickets:" value={accountTotals?.Tickets} isInteger />
        <TwoColumnStatRow label="Refunds:" value={accountTotals?.TicketsRefunded} isInteger />
        <TwoColumnStatRow label="Revenue:" value={accountTotals?.RevenueUsd} isCurrency />
        <TwoColumnStatRow label="Service Fees:" value={accountTotals?.ServiceFeesUsd} isCurrency />
        <TwoColumnStatRow
          label="Revenue Refunded:"
          value={accountTotals?.RevenueRefundedUsd}
          isCurrency
        />
        <TwoColumnStatRow
          label="S.Fees Refunded:"
          value={accountTotals?.ServiceFeeRevenueRefundedUsd}
          isCurrency
        />
        <TwoColumnStatRow
          label="Total Revenue:"
          value={accountTotals?.TotalRevenueUsd}
          isCurrency
        />
        <TwoColumnStatRow label="Tickets per transaction:" value={ticketsPerTransaction} />
        <TwoColumnStatRow label="Avg. Purchase:" value={averagePurchaseAmountUsd} isCurrency />
        <TwoColumnStatRow label="Avg. Price Per Ticket:" value={pricePerTicketUsd} isCurrency />
        <TwoColumnStatRow
          label="Avg. Service Fee Per Ticket:"
          value={serviceFeePerTicketUsd}
          isCurrency
        />
      </Col>
    </Row>
  );
}

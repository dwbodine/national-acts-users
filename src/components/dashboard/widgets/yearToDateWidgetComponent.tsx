'use client';

import moment from 'moment';
import { Col, Row } from 'rsuite';

import TwoColumnStatRow from '@/components/common/widgets/TwoColumnStatRow';
import { YearToDateWidgetProps } from '@/types/props';

export default function YearToDateWidget(props: YearToDateWidgetProps) {
  const totals = props.Totals;
  const projectedYearTotalRevenue = props.ProjectedYearTotalRevenue;
  const selectedYear = props.SelectedYear;
  const currentYear = moment().year();

  let ticketsPerTransaction = 0;
  let averagePurchaseAmount = 0;
  if (totals?.orders) {
    ticketsPerTransaction = (totals?.tickets ?? 0) / totals.orders;
    averagePurchaseAmount = (totals?.totalRevenueUsd ?? 0) / totals.orders;
  }

  const title =
    selectedYear === currentYear ? 'Year-to-Date stats' : `${selectedYear} Yearly Stats`;

  return (
    <Row className="sales-stat-block">
      <Col>
        <Row>
          <Col className="sales-stat-block-title">{title}</Col>
        </Row>
        <TwoColumnStatRow label="Transactions:" value={totals?.orders} isInteger />
        <TwoColumnStatRow label="Tickets:" value={totals?.tickets} isInteger />
        <TwoColumnStatRow label="Refunds:" value={totals?.numTicketsRefunded} isInteger />
        <TwoColumnStatRow label="Revenue:" value={totals?.ticketRevenueUsd} isCurrency />
        <TwoColumnStatRow label="Service Fees:" value={totals?.serviceFeesRevenueUsd} isCurrency />
        <TwoColumnStatRow label="Revenue Refunded:" value={totals?.revenueRefunded} isCurrency />
        <TwoColumnStatRow
          label="S.Fees Refunded:"
          value={totals?.serviceFeeRevenueRefunded}
          isCurrency
        />
        <TwoColumnStatRow label="Total Revenue:" value={totals?.totalRevenueUsd} isCurrency />
        <TwoColumnStatRow label="Tickets per transaction:" value={ticketsPerTransaction} />
        <TwoColumnStatRow label="Avg. Purchase:" value={averagePurchaseAmount} isCurrency />
        <TwoColumnStatRow
          label="Avg. Price Per Ticket:"
          value={totals?.pricePerTicket}
          isCurrency
        />
        <TwoColumnStatRow
          label="Avg. Service Fee Per Ticket:"
          value={totals?.serviceFeePerTicket}
          isCurrency
        />
        {selectedYear === currentYear && (
          <TwoColumnStatRow label="Yearly Proj.:" value={projectedYearTotalRevenue} isCurrency />
        )}
      </Col>
    </Row>
  );
}

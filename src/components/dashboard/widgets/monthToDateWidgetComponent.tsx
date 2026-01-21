'use client';

import { Col, Row } from 'rsuite';

import TwoColumnStatRow from '@/components/common/widgets/TwoColumnStatRow';
import { MonthToDateWidgetProps } from '@/types/props';

export default function MonthToDateWidget(props: MonthToDateWidgetProps) {
  const dashBoardData = props.DashBoardData;

  let ticketsPerTransaction = 0;
  let averagePurchaseAmount = 0;
  if (dashBoardData?.monthToDatePurchases) {
    ticketsPerTransaction =
      (dashBoardData?.monthToDateTickets ?? 0) / dashBoardData.monthToDatePurchases;
    averagePurchaseAmount =
      (dashBoardData?.monthToDateTotalRevenueUsd ?? 0) / dashBoardData.monthToDatePurchases;
  }

  return (
    <Row className="sales-stat-block">
      <Col>
        <Row>
          <Col className="sales-stat-block-title">Month-to-Date stats</Col>
        </Row>
        <TwoColumnStatRow
          label="Transactions:"
          value={dashBoardData?.monthToDatePurchases}
          isInteger
        />
        <TwoColumnStatRow label="Tickets:" value={dashBoardData?.monthToDateTickets} isInteger />
        <TwoColumnStatRow
          label="Refunds:"
          value={dashBoardData?.monthToDateTicketsRefunded}
          isInteger
        />
        <TwoColumnStatRow
          label="Revenue:"
          value={dashBoardData?.monthToDateRevenueUsd}
          isCurrency
        />
        <TwoColumnStatRow
          label="Service Fees:"
          value={dashBoardData?.monthToDateServiceFeesUsd}
          isCurrency
        />
        <TwoColumnStatRow
          label="Revenue Refunded:"
          value={dashBoardData?.monthToDateRevenueRefundedUsd}
          isCurrency
        />
        <TwoColumnStatRow
          label="S.Fees Refunded:"
          value={dashBoardData?.monthToDateServiceFeesRefundedUsd}
          isCurrency
        />
        <TwoColumnStatRow
          label="Total Revenue:"
          value={dashBoardData?.monthToDateTotalRevenueUsd}
          isCurrency
        />
        <TwoColumnStatRow label="Tickets per transaction:" value={ticketsPerTransaction} />
        <TwoColumnStatRow label="Avg. Purchase:" value={averagePurchaseAmount} isCurrency />
        <TwoColumnStatRow
          label="Avg. Price Per Ticket:"
          value={dashBoardData?.monthToDatePricePerTicketUsd}
          isCurrency
        />
        <TwoColumnStatRow
          label="Avg. Service Fee Per Ticket:"
          value={dashBoardData?.monthToDateServiceFeePerTicketUsd}
          isCurrency
        />
        <TwoColumnStatRow
          label="Monthly Proj.:"
          value={dashBoardData?.projectedMonthTotalRevenueUsd}
          isCurrency
        />
      </Col>
    </Row>
  );
}

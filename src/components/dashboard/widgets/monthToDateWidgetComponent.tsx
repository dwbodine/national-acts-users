'use client';

import { Col, Row } from 'rsuite';

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
        <Row>
          <Col className="sales-stat-block-name">Transactions:</Col>
          <Col className="sales-stat-block-value">{dashBoardData?.monthToDatePurchases ?? '0'}</Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Tickets:</Col>
          <Col className="sales-stat-block-value">{dashBoardData?.monthToDateTickets ?? '0'}</Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Refunds:</Col>
          <Col className="sales-stat-block-value">
            {dashBoardData?.monthToDateTicketsRefunded ?? '0'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Revenue:</Col>
          <Col className="sales-stat-block-value">
            ${dashBoardData?.monthToDateRevenueUsd?.toFixed(2) ?? '0.00'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Service Fees:</Col>
          <Col className="sales-stat-block-value">
            ${dashBoardData?.monthToDateServiceFeesUsd?.toFixed(2) ?? '0.00'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Revenue Refunded:</Col>
          <Col className="sales-stat-block-value">
            ${dashBoardData?.monthToDateRevenueRefundedUsd?.toFixed(2) ?? '0.00'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">S.Fees Refunded:</Col>
          <Col className="sales-stat-block-value">
            ${dashBoardData?.monthToDateServiceFeesRefundedUsd?.toFixed(2) ?? '0.00'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Total Revenue:</Col>
          <Col className="sales-stat-block-value">
            ${dashBoardData?.monthToDateTotalRevenueUsd?.toFixed(2) ?? '0.00'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Tickets per transaction:</Col>
          <Col className="sales-stat-block-value">{ticketsPerTransaction.toFixed(2) ?? '0'}</Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Avg. Purchase:</Col>
          <Col className="sales-stat-block-value">
            ${averagePurchaseAmount.toFixed(2) ?? '0.00'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Avg. Price Per Ticket:</Col>
          <Col className="sales-stat-block-value">
            ${dashBoardData?.monthToDatePricePerTicketUsd?.toFixed(2) ?? '0.00'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Avg. Service Fee Per Ticket:</Col>
          <Col className="sales-stat-block-value">
            ${dashBoardData?.monthToDateServiceFeePerTicketUsd?.toFixed(2) ?? '0.00'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Monthly Proj.:</Col>
          <Col className="sales-stat-block-value">
            ${dashBoardData?.projectedMonthTotalRevenueUsd?.toFixed(2) ?? '0.00'}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

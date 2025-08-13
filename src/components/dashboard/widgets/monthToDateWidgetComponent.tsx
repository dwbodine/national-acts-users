"use client";

import { Col, Row } from 'react-bootstrap';
import { MonthToDateWidgetProps } from '@/types/props';

export default function MonthToDateWidget(props: MonthToDateWidgetProps) {
  const dashBoardData = props.DashBoardData;

  let ticketsPerTransaction = 0;
  let averagePurchaseAmount = 0;
  if (dashBoardData?.monthToDatePurchases) {
    ticketsPerTransaction =
      (dashBoardData?.monthToDateTickets ?? 0) / dashBoardData.monthToDatePurchases;
    averagePurchaseAmount =
      (dashBoardData?.monthToDateTotalRevenue ?? 0) / dashBoardData.monthToDatePurchases;
  }

  return (
    <Row className="sales-stat-block">
      <Col>
        <Row>
          <Col className="sales-stat-block-title">Month-to-Date stats</Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Transactions:</Col>
          <Col className="sales-stat-block-value">
            {dashBoardData?.monthToDatePurchases ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Tickets:</Col>
          <Col className="sales-stat-block-value">
            {dashBoardData?.monthToDateTickets ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Refunds:</Col>
          <Col className="sales-stat-block-value">
            {dashBoardData?.monthToDateTicketsRefunded ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Revenue:</Col>
          <Col className="sales-stat-block-value">
            ${dashBoardData?.monthToDateRevenue?.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Service Fees:</Col>
          <Col className="sales-stat-block-value">
            ${dashBoardData?.monthToDateServiceFees?.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Revenue Refunded:</Col>
          <Col className="sales-stat-block-value">
            ${dashBoardData?.monthToDateRevenueRefunded?.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">S.Fees Refunded:</Col>
          <Col className="sales-stat-block-value">
            ${dashBoardData?.monthToDateServiceFeesRefunded?.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Total Revenue:</Col>
          <Col className="sales-stat-block-value">
            ${dashBoardData?.monthToDateTotalRevenue?.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Tickets per transaction:</Col>
          <Col className="sales-stat-block-value">
            {ticketsPerTransaction.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Avg. Purchase:</Col>
          <Col className="sales-stat-block-value">
            ${averagePurchaseAmount.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Avg. Price Per Ticket:</Col>
          <Col className="sales-stat-block-value">
            ${dashBoardData?.monthToDatePricePerTicket?.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Avg. Service Fee Per Ticket:</Col>
          <Col className="sales-stat-block-value">
            ${dashBoardData?.monthToDateServiceFeePerTicket?.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Monthly Proj.:</Col>
          <Col className="sales-stat-block-value">
            ${dashBoardData?.projectedMonthTotalRevenue?.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

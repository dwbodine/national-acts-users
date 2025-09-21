import { Col, Row } from 'react-bootstrap';
import { SalesByAccountWidgetProps } from '@/types/props';

export default function SalesByAccountWidget(props: SalesByAccountWidgetProps) {
  const accountName = props.AccountName;
  const accountTotals = props.AccountTotals;
  const selectedYear = props.SelectedYear;

  let ticketsPerTransaction = 0;
  let averagePurchaseAmountUsd = 0;
  let pricePerTicketUsd = 0;
  let serviceFeePerTicketUsd = 0;
  const tickets = (accountTotals?.Tickets ?? 0);
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
          <Col className="sales-stat-block-title">Summary By Account {selectedYear ? selectedYear : ''}</Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-subtitle">{accountName}</Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Transactions:</Col>
          <Col className="sales-stat-block-value">
            {accountTotals?.Purchases ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Tickets:</Col>
          <Col className="sales-stat-block-value">{accountTotals?.Tickets ?? '0'}</Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Refunds:</Col>
          <Col className="sales-stat-block-value">
            {accountTotals?.TicketsRefunded ?? '0'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Revenue:</Col>
          <Col className="sales-stat-block-value">
            ${accountTotals?.RevenueUsd?.toFixed(2) ?? '0.00'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Service Fees:</Col>
          <Col className="sales-stat-block-value">
            ${accountTotals?.ServiceFeesUsd?.toFixed(2) ?? '0.00'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Revenue Refunded:</Col>
          <Col className="sales-stat-block-value">
            ${accountTotals?.RevenueRefundedUsd?.toFixed(2) ?? '0.00'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">S.Fees Refunded:</Col>
          <Col className="sales-stat-block-value">
            ${accountTotals?.ServiceFeeRevenueRefundedUsd?.toFixed(2) ?? '0.00'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Total Revenue:</Col>
          <Col className="sales-stat-block-value">
            ${accountTotals?.TotalRevenueUsd?.toFixed(2) ?? '0.00'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Tickets per transaction:</Col>
          <Col className="sales-stat-block-value">
            {ticketsPerTransaction.toFixed(2) ?? '0'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Avg. Purchase:</Col>
          <Col className="sales-stat-block-value">
            ${averagePurchaseAmountUsd.toFixed(2) ?? '0.00'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Avg. Price Per Ticket:</Col>
          <Col className="sales-stat-block-value">
            ${pricePerTicketUsd.toFixed(2) ?? '0.00'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Avg. Service Fee Per Ticket:</Col>
          <Col className="sales-stat-block-value">
            ${serviceFeePerTicketUsd.toFixed(2) ?? '0.00'}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

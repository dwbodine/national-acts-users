import { ITicketSalesData } from '@/types/event';
import { Col, Row } from 'react-bootstrap';

export default function SalesByAccountWidget(props: any) {
  const accountName = props.accountName as string | undefined;
  const accountTotals = props.accountTotals as ITicketSalesData | undefined;
  const selectedYear = props.selectedYear as number | undefined;

  let ticketsPerTransaction = 0;
  let averagePurchaseAmount = 0;
  let pricePerTicket = 0;
  let serviceFeePerTicket = 0;
  let tickets = accountTotals?.Tickets ?? 0;
  if (tickets > 0) {
    pricePerTicket = (accountTotals?.Revenue ?? 0) / tickets;
    serviceFeePerTicket = (accountTotals?.ServiceFees ?? 0) / tickets;
  }
  if (accountTotals?.Purchases) {
    ticketsPerTransaction = tickets / accountTotals.Purchases;
    averagePurchaseAmount = (accountTotals?.TotalRevenue ?? 0) / accountTotals.Purchases;
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
          <Col className="sales-stat-block-value">{accountTotals?.Tickets ?? 'n/a'}</Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Refunds:</Col>
          <Col className="sales-stat-block-value">
            {accountTotals?.TicketsRefunded ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Revenue:</Col>
          <Col className="sales-stat-block-value">
            ${accountTotals?.Revenue?.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Service Fees:</Col>
          <Col className="sales-stat-block-value">
            ${accountTotals?.ServiceFees?.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Revenue Refunded:</Col>
          <Col className="sales-stat-block-value">
            ${accountTotals?.RevenueRefunded?.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">S.Fees Refunded:</Col>
          <Col className="sales-stat-block-value">
            ${accountTotals?.ServiceFeeRevenueRefunded?.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Total Revenue:</Col>
          <Col className="sales-stat-block-value">
            ${accountTotals?.TotalRevenue?.toFixed(2) ?? 'n/a'}
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
            ${pricePerTicket.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Avg. Service Fee Per Ticket:</Col>
          <Col className="sales-stat-block-value">
            ${serviceFeePerTicket.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

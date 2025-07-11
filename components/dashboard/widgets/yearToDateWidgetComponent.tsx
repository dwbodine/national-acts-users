import { YearToDateWidgetProps } from '@/types/props';
import moment from 'moment';
import { Col, Row } from 'react-bootstrap';

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

  const title = (selectedYear != currentYear) ? `${selectedYear} Yearly Stats` : "Year-to-Date stats";

  return (
    <Row className="sales-stat-block">
      <Col>
        <Row>
          <Col className="sales-stat-block-title">{title}</Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Transactions:</Col>
          <Col className="sales-stat-block-value">{totals?.orders ?? 'n/a'}</Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Tickets:</Col>
          <Col className="sales-stat-block-value">{totals?.tickets ?? 'n/a'}</Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Refunds:</Col>
          <Col className="sales-stat-block-value">
            {totals?.numTicketsRefunded ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Revenue:</Col>
          <Col className="sales-stat-block-value">
            ${totals?.ticketRevenueUsd?.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Service Fees:</Col>
          <Col className="sales-stat-block-value">
            ${totals?.serviceFeesRevenueUsd?.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Revenue Refunded:</Col>
          <Col className="sales-stat-block-value">
            ${totals?.revenueRefunded?.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">S.Fees Refunded:</Col>
          <Col className="sales-stat-block-value">
            ${totals?.serviceFeeRevenueRefunded?.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Total Revenue:</Col>
          <Col className="sales-stat-block-value">
            ${totals?.totalRevenueUsd?.toFixed(2) ?? 'n/a'}
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
            ${totals?.pricePerTicket?.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-name">Avg. Service Fee Per Ticket:</Col>
          <Col className="sales-stat-block-value">
            ${totals?.serviceFeePerTicket?.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
        <Row hidden={selectedYear != currentYear}>
          <Col className="sales-stat-block-name">Yearly Proj.:</Col>
          <Col className="sales-stat-block-value">
            ${projectedYearTotalRevenue?.toFixed(2) ?? 'n/a'}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

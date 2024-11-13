import { ISalesData } from '@/types/user';
import moment from 'moment';
import { Col, Row } from 'react-bootstrap';

export default function SalesPerMonthWidget(props: any) {
  const salesPerMonth = props.salesPerMonth as ISalesData[] | undefined;

  let salesRows: any[] = [];
  const currentYear = moment().year();

  if (salesPerMonth != undefined) {
    for (let i = 0; i < 12; i++) {
      const monthName = moment([currentYear, i, 1]).format('MMMM');
      const monthVal = salesPerMonth.find((x) => x.key == i + 1)?.value ?? 0;
      const key = `salePerMonth${i}`;
      salesRows.push(
        <Row key={key}>
          <Col className="sales-stat-block-name">{monthName}</Col>
          <Col className="sales-stat-block-value">${monthVal.toFixed(2)}</Col>
        </Row>,
      );
    }
  }

  return (
    <Row className="sales-stat-block">
      <Col>
        <Row>
          <Col className="sales-stat-block-title">Sales Per Month {currentYear}</Col>
        </Row>
        {salesRows}
      </Col>
    </Row>
  );
}

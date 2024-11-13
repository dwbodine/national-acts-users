import { ISalesData } from '@/types/user';
import moment from 'moment';
import { Col, Row } from 'react-bootstrap';

export default function SalesPerDayOfWeekWidget(props: any) {
  const salesPerDayMonth = props.salesPerDayMonth as ISalesData[] | undefined;
  const salesPerDayYear = props.salesPerDayYear as ISalesData[] | undefined;

  const today = moment();
  const currentYear = today.year();
  const currentDay = today.day();
  const firstDayOfMonthDate = moment([currentYear, today.month(), 1]);
  const firstDayOfMonth = firstDayOfMonthDate.day();
  const firstWeekOfMonth = firstDayOfMonthDate.week();
  const firstDayOfYear = moment([currentYear, 1, 1]).day();

  let salesRows: any[] = [];

  for (let i = 1; i <= 7; i++) {
    const dayNumber = i % 7;
    const dayName = moment().day(dayNumber).format('ddd');

    let numberOfDaysInYear = today.week();
    if (dayNumber >= firstDayOfYear && dayNumber <= currentDay) {
      numberOfDaysInYear += 1;
    }

    let numberOfDaysInMonth = today.week() - firstWeekOfMonth;
    if (dayNumber >= firstDayOfMonth && dayNumber <= currentDay) {
      numberOfDaysInMonth += 1;
    }

    let monthVal = salesPerDayMonth?.find((x) => x.key == dayNumber)?.value ?? 0;
    if (monthVal > 0 && numberOfDaysInMonth > 0) {
      monthVal = monthVal / numberOfDaysInMonth;
    }
    let yearVal = salesPerDayYear?.find((x) => x.key == dayNumber)?.value ?? 0;
    if (yearVal > 0 && numberOfDaysInYear) {
      yearVal = yearVal / numberOfDaysInYear;
    }

    const key = `salePerDay${i}`;
    salesRows.push(
      <Row key={key}>
        <Col>
          {dayName} ${monthVal.toFixed(2)}
        </Col>
        <Col>
          {dayName} ${yearVal.toFixed(2)}
        </Col>
      </Row>,
    );
  }

  return (
    <Row className="sales-stat-block">
      <Col>
        <Row>
          <Col className="sales-stat-block-title">Average Sales by Day of Week</Col>
        </Row>
        <Row>
          <Col className="sales-stat-block-subtitle">Current Month</Col>
          <Col className="sales-stat-block-subtitle">Average For Year</Col>
        </Row>
        {salesRows}
      </Col>
    </Row>
  );
}

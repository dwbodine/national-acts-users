import { ISalesData } from '@/types/user';
import moment from 'moment';
import { Col, Row } from 'react-bootstrap';

export default function SalesPerDayOfWeekWidget(props: any) {
  const salesPerDayMonth = props.salesPerDayMonth as ISalesData[] | undefined;
  const salesPerDayYear = props.salesPerDayYear as ISalesData[] | undefined;
  const selectedYear = props.selectedYear as number | undefined;
  const currentYear = moment().year();

  const today = moment();
  const currentDay = today.day();
  const firstDayOfMonthDate = moment([currentYear, today.month(), 1]);
  const firstDayOfMonth = firstDayOfMonthDate.day();
  const firstWeekOfMonth = firstDayOfMonthDate.week();
  const firstDayOfYear = moment([currentYear, 1, 1]).day();

  let salesRows: any[] = [];

  if (salesPerDayMonth != undefined || salesPerDayYear != undefined) {
    for (let i = 1; i <= 7; i++) {
      const dayNumber = i % 7;
      const dayName = moment().day(dayNumber).format('ddd');

      let numberOfWeeksInYear = today.week();
      if (dayNumber >= firstDayOfYear && dayNumber <= currentDay) {
        numberOfWeeksInYear += 1;
      }

      let numberOfWeeksInMonth = today.week() - firstWeekOfMonth + 1;
      if (dayNumber >= firstDayOfMonth && dayNumber <= currentDay) {
        numberOfWeeksInMonth += 1;
      }

      let monthVal = salesPerDayMonth?.find((x) => x.key == dayNumber)?.value ?? 0;
      if (monthVal > 0 && numberOfWeeksInMonth > 0) {
        monthVal = monthVal / numberOfWeeksInMonth;
      }
      let yearVal = salesPerDayYear?.find((x) => x.key == dayNumber)?.value ?? 0;
      if (yearVal > 0 && numberOfWeeksInYear > 0) {
        yearVal = yearVal / numberOfWeeksInYear;
      }

      const key = `salePerDay${i}`;
      if (currentYear != selectedYear) {
        salesRows.push(
          <Row key={key}>
            <Col>
              {dayName} ${yearVal.toFixed(2)}
            </Col>
          </Row>,
        );
      } else {
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
    }
  }

  return (
    <Row className="sales-stat-block">
      <Col>
        <Row>
          <Col className="sales-stat-block-title">Average Sales by Day of Week {(currentYear != selectedYear) ? selectedYear : ''}</Col>
        </Row>
        <Row hidden={currentYear != selectedYear}>
          <Col className="sales-stat-block-subtitle">Current Month</Col>
          <Col className="sales-stat-block-subtitle">Average For Year</Col>
        </Row>
        {salesRows}
      </Col>
    </Row>
  );
}

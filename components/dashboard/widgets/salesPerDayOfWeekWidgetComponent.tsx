import moment from "moment";
import { Col, Row } from "react-bootstrap";

export default function SalesPerDayOfWeekWidget(props: any) {
    
    const salesPerDayMonthMap = props.salesPerDayMonth as Map<number, number> | undefined;
    const salesPerDayYearMap = props.salesPerDayYear as Map<number, number> | undefined;

    const today = moment();
    const currentYear = today.year();
    const currentDay = today.day();
    const firstDayOfMonthDate = moment([currentYear, today.month(), 1]);
    const firstDayOfMonth = firstDayOfMonthDate.day();
    const firstWeekOfMonth = firstDayOfMonthDate.week();
    const firstDayOfYear = moment([currentYear, 1, 1]).day();
    
    let salesRows: any[] = [];
    if (salesPerDayMonthMap && salesPerDayYearMap) {
        for (let i=1; i <= 7; i++) {
            const dayName = moment().day(i).format('ddd');
            const dayNumber = i % 7;
            let numberOfDaysInYear = today.week();
            if (dayNumber >= firstDayOfYear && dayNumber <= currentDay) {
                numberOfDaysInYear += 1;
            }
            let numberOfDaysInMonth = (today.week() - firstWeekOfMonth);
            if (dayNumber >= firstDayOfMonth && dayNumber <= currentDay) {
                numberOfDaysInMonth += 1;
            }
            let monthVal = (salesPerDayMonthMap.get(dayNumber) ?? 0) / numberOfDaysInMonth;
            let yearVal = (salesPerDayYearMap.get(dayNumber) ?? 0) / numberOfDaysInYear;
            salesRows.push(<Row><Col>{dayName} ${monthVal.toFixed(2)}</Col><Col>{dayName} ${yearVal.toFixed(2)}</Col></Row>);
        }
    }

    return (       
        <Row className="sales-stat-block">
            <Col>
                <Row>
                    <Col className="sales-stat-block-title">Average Sales by Day of Week:</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-subtitle">Current Month</Col><Col className="sales-stat-block-subtitle">Average For Year</Col>
                </Row>
                {salesRows}
            </Col>
        </Row>
    );
    
}
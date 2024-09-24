import moment from "moment";
import { Col, Row } from "react-bootstrap";

export default function SalesPerMonthWidget(props: any) {
    
    const salesPerMonthMap = props.salesPerMonth as Map<number, number> | undefined;

    let salesRows: any[] = [];
    const currentYear = moment().year();
    if (salesPerMonthMap && salesPerMonthMap.size > 0) {
        for (let i=0; i < 12; i++) {
            const monthName = moment([currentYear, i, 1]).format('MMMM');
            const monthVal = salesPerMonthMap.get(i+1) ?? 0;
            salesRows.push(<Row><Col className="sales-stat-block-name">{monthName}</Col><Col className="sales-stat-block-value">${monthVal.toFixed(2)}</Col></Row>);
        }
    }

    return (       
        <Row className="sales-stat-block">
            <Col>
                <Row>
                    <Col className="sales-stat-block-title">Sales Per Month {currentYear}:</Col>
                </Row>
                {salesRows}
            </Col>
        </Row>
    );
    
}
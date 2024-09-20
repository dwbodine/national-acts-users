import { IDashboardData, IDashboardTotals, ITopSeller } from "@/types/user";
import { Col, Row } from "react-bootstrap";

export default function MonthToDateWidget(props: any) {
    
    const dashBoardData = props.DashBoardData as IDashboardData | undefined;
 
    return (       
        <Row className="sales-stat-block">
            <Col>
                <Row>
                    <Col className="sales-stat-block-title">Month-to-Date stats:</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Transactions:</Col>
                    <Col className="sales-stat-block-value">{dashBoardData?.monthToDatePurchases ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Tickets sold:</Col>
                    <Col className="sales-stat-block-value">{dashBoardData?.monthToDateTickets ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Tickets refunded:</Col>
                    <Col className="sales-stat-block-value">{dashBoardData?.monthToDateTicketsRefunded ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Ticket Revenue:</Col>
                    <Col className="sales-stat-block-value">${dashBoardData?.monthToDateRevenue?.toFixed(2) ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Service Fee Revenue:</Col>
                    <Col className="sales-stat-block-value">${dashBoardData?.monthToDateServiceFees?.toFixed(2) ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Total Revenue:</Col>
                    <Col className="sales-stat-block-value">${dashBoardData?.monthToDateTotalRevenue?.toFixed(2) ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Proj. Monthly Revenue:</Col>
                    <Col className="sales-stat-block-value">${dashBoardData?.projectedMonthTotalRevenue?.toFixed(2) ?? 'n/a'}</Col>
                </Row>
            </Col>
        </Row>
    );
    
}
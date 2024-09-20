import { IDashboardTotals, ITopSeller } from "@/types/user";
import { Col, Row } from "react-bootstrap";

export default function YearToDateWidget(props: any) {
    
    const totals = props.totals as IDashboardTotals | undefined;
    const projectedMonthTotalRevenue = props.projectedMonthTotalRevenue as number | undefined;
    const projectedYearTotalRevenue = props.projectedYearTotalRevenue as number | undefined;
 
    return (       
        <Row className="sales-stat-block">
            <Col>
                <Row>
                    <Col className="sales-stat-block-title">Year-to-Date stats:</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Transactions:</Col>
                    <Col className="sales-stat-block-value">{totals?.orders ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Tickets sold:</Col>
                    <Col className="sales-stat-block-value">{totals?.tickets ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Tickets refunded:</Col>
                    <Col className="sales-stat-block-value">{totals?.ticketsRefunded ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Ticket Revenue:</Col>
                    <Col className="sales-stat-block-value">${totals?.ticketRevenueUsd?.toFixed(2) ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Service Fee Revenue:</Col>
                    <Col className="sales-stat-block-value">${totals?.serviceFeesRevenueUsd?.toFixed(2) ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Total Revenue:</Col>
                    <Col className="sales-stat-block-value">${totals?.totalRevenueUsd?.toFixed(2) ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Proj. Yearly Revenue:</Col>
                    <Col className="sales-stat-block-value">${projectedYearTotalRevenue?.toFixed(2) ?? 'n/a'}</Col>
                </Row>
            </Col>
        </Row>
    );
    
}
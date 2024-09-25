import { IDashboardTotals, ITopSeller } from "@/types/user";
import { Col, Row } from "react-bootstrap";

export default function YearToDateWidget(props: any) {
    
    const totals = props.totals as IDashboardTotals | undefined;
    const projectedYearTotalRevenue = props.projectedYearTotalRevenue as number | undefined;

    let ticketsPerTransaction = 0;
    let averagePurchaseAmount = 0;
    if (totals?.orders) {
        ticketsPerTransaction = (totals?.tickets ?? 0) / totals.orders;
        averagePurchaseAmount = (totals?.totalRevenueUsd ?? 0) / totals.orders;
    }
 
    return (       
        <Row className="sales-stat-block">
            <Col>
                <Row>
                    <Col className="sales-stat-block-title">Year-to-Date stats</Col>
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
                    <Col className="sales-stat-block-value">{totals?.ticketsRefunded ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Revenue:</Col>
                    <Col className="sales-stat-block-value">${totals?.ticketRevenueUsd?.toFixed(2) ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Service Fees:</Col>
                    <Col className="sales-stat-block-value">${totals?.serviceFeesRevenueUsd?.toFixed(2) ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Total Revenue:</Col>
                    <Col className="sales-stat-block-value">${totals?.totalRevenueUsd?.toFixed(2) ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Tickets per transaction:</Col>
                    <Col className="sales-stat-block-value">{ticketsPerTransaction.toFixed(2) ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Avg. Purchase:</Col>
                    <Col className="sales-stat-block-value">${averagePurchaseAmount.toFixed(2) ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Yearly Proj.:</Col>
                    <Col className="sales-stat-block-value">${projectedYearTotalRevenue?.toFixed(2) ?? 'n/a'}</Col>
                </Row>
            </Col>
        </Row>
    );
    
}
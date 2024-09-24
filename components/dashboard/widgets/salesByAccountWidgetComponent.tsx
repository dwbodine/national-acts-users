import { ITicketSalesData } from "@/types/event";
import { IDashboardTotals, ITopSeller } from "@/types/user";
import { Col, Row } from "react-bootstrap";

export default function SalesByAccountWidget(props: any) {
    
    const accountName = props.accountName as string | undefined;
    const accountTotals = props.accountTotals as ITicketSalesData | undefined;

    let ticketsPerTransaction = 0;
    let averagePurchaseAmount = 0;
    if (accountTotals?.Purchases) {
        ticketsPerTransaction = (accountTotals?.Tickets ?? 0) / accountTotals.Purchases;
        averagePurchaseAmount = (accountTotals?.TotalRevenue ?? 0) / accountTotals.Purchases;
    }
 
    return (       
        <Row className="sales-stat-block">
            <Col>
                <Row>
                    <Col className="sales-stat-block-title">Summary By Account</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-subtitle">{accountName}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Transactions:</Col>
                    <Col className="sales-stat-block-value">{accountTotals?.Purchases ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Tickets:</Col>
                    <Col className="sales-stat-block-value">{accountTotals?.Tickets ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Refunds:</Col>
                    <Col className="sales-stat-block-value">{accountTotals?.TicketsRefunded ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Revenue:</Col>
                    <Col className="sales-stat-block-value">${accountTotals?.Revenue?.toFixed(2) ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Service Fees:</Col>
                    <Col className="sales-stat-block-value">${accountTotals?.ServiceFees?.toFixed(2) ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Total Revenue:</Col>
                    <Col className="sales-stat-block-value">${accountTotals?.TotalRevenue?.toFixed(2) ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Tickets per transaction:</Col>
                    <Col className="sales-stat-block-value">{ticketsPerTransaction.toFixed(2) ?? 'n/a'}</Col>
                </Row>
                <Row>
                    <Col className="sales-stat-block-name">Avg. Purchase:</Col>
                    <Col className="sales-stat-block-value">${averagePurchaseAmount.toFixed(2) ?? 'n/a'}</Col>
                </Row>
            </Col>
        </Row>
    );
    
}
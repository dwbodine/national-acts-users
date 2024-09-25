import { ITopSeller, ITopSellingLocation } from "@/types/user";
import { Col, Row } from "react-bootstrap";

export default function TopSellingLocationsWidget(props: any) {
    
    const topSellers = props.topSellers as ITopSellingLocation[] | undefined;
    const dateRange = props.dateRange as string | undefined;
    const title = props.title as string | undefined;

    let sellerRows: any[] = [];
    if (topSellers && topSellers.length > 0) {
        topSellers.forEach((seller, i) => {
            const key = `top10${i}`;
            if (seller.tooltip) {
                sellerRows.push(<Row key={key}><Col className="sales-stat-block-name-tooltip" title={seller.tooltip}>{i+1}. {seller.location}</Col><Col className="sales-stat-block-value">${seller.revenueUsd.toFixed(2)}</Col></Row>);
            } else {
                sellerRows.push(<Row key={key}><Col className="sales-stat-block-name">{i+1}. {seller.location}</Col><Col className="sales-stat-block-value">${seller.revenueUsd.toFixed(2)}</Col></Row>);
            }            
        })
    }

    return (       
        <Row className="sales-stat-block">
            <Col>
                <Row>
                    <Col className="sales-stat-block-title-no-margin">Top {topSellers?.length} Selling {title}</Col>
                </Row>
                <Row hidden={!dateRange}>
                    <Col className="sales-stat-block-subtitle-no-margin">({dateRange})</Col>
                </Row>
                {sellerRows}
            </Col>
        </Row>
    );
    
}
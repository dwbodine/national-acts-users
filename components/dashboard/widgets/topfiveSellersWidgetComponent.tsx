import { ITopSeller } from "@/types/user";
import { Col, Row } from "react-bootstrap";

export default function TopFiveSellersWidget(props: any) {
    
    const topFiveSellers = props.topFiveSellers as ITopSeller[] | undefined;
    let sellerRows: any[] = [];
    if (topFiveSellers && topFiveSellers.length > 0) {
        topFiveSellers.forEach((seller) => {
            sellerRows.push(<Row><Col className="sales-stat-block-name">{seller.sellerName}</Col><Col className="sales-stat-block-value">${seller.revenueUsd.toFixed(2)}</Col></Row>);
        })
    }

    return (       
        <Row className="sales-stat-block">
            <Col>
                <Row>
                    <Col className="sales-stat-block-title">Top Five Sellers:</Col>
                </Row>
                {sellerRows}
            </Col>
        </Row>
    );
    
}
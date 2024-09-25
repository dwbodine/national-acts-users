import { ITopSeller } from "@/types/user";
import { Col, Row } from "react-bootstrap";

export default function TopSellersWidget(props: any) {
    
    const topSellers = props.topSellers as ITopSeller[] | undefined;
    let sellerRows: any[] = [];
    if (topSellers && topSellers.length > 0) {
        topSellers.forEach((seller, i) => {
            const key = `topSeller${i}`;
            sellerRows.push(<Row key={key}><Col className="sales-stat-block-name">{i+1}. {seller.sellerName}</Col><Col className="sales-stat-block-value">${seller.revenueUsd.toFixed(2)}</Col></Row>);
        })
    }

    return (       
        <Row className="sales-stat-block">
            <Col>
                <Row>
                    <Col className="sales-stat-block-title">Top {topSellers?.length} Sellers:</Col>
                </Row>
                {sellerRows}
            </Col>
        </Row>
    );
    
}
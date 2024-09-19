import { Col, Row } from "react-bootstrap";
import { Progress } from 'rsuite';

export default function RevenueGoalsWidget(props: any) {
    
    const percentGoal = props.percentGoal as number | undefined;
    const title = props.percentTitle as string;

    let wholePercent = 0.0;
    if (percentGoal) {
        wholePercent = Math.round((percentGoal * 100) * 100) / 100;
    }

    return (       
        <Row className="sales-stat-block">
            <Col>
                <Row>
                    <Col className="sales-stat-block-title">{title}:</Col>
                </Row>
                <Row>
                    <Col className="revenue-widget-progress">
                        <Progress.Circle percent={wholePercent} strokeColor="#ffc107" />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
    
}
import { Col, Container, Row } from "react-bootstrap";
import ReportsIndexBar from "./reportsIndexBarComponent";

export default function ReportsIndex() { 
    return (
        <>
            <ReportsIndexBar />
            <Container fluid>
                <Row>
                    <Col>
                        reports
                    </Col>
                </Row>
            </Container>
        </>
    );
}
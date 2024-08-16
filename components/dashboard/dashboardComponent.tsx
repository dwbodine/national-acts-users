import { Col, Container, Row } from "react-bootstrap";
import DashboardBar from "./dashboardBarComponent"

export default function Dashboard() {
    return (
        <>
            <DashboardBar />
            <Container fluid>
                <Row>
                    <Col>
                        coming soon...
                    </Col>
                </Row>
            </Container>
        </>
    );
}
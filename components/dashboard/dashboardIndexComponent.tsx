import { Col, Container, Row } from "react-bootstrap";
import DashboardBar from "./dashboardBarComponent"
import UserActivityTable from "./userActivityTableComponent";

export default function DashboardIndex() {
    return (
        <>
            <DashboardBar />
            <Container fluid>
                <Row>
                    <Col>
                        <UserActivityTable />
                    </Col>
                </Row>
            </Container>
        </>
    );
}
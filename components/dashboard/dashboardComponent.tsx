import { Col, Container, Row } from "react-bootstrap";
import DashboardBar from "./dashboardBarComponent"
import UserActivityTable from "./userActivityBarComponent";

export default function Dashboard() {
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
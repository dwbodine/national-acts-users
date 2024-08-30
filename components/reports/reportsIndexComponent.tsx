import { Col, Container, Row } from "react-bootstrap";
import ReportsIndexBar from "./reportsIndexBarComponent";
import ReportsList from "./reportsListComponent";

export default function ReportsIndex() { 
    return (
        <>
            <ReportsIndexBar />
            <Container fluid>
                <Row>
                    <Col>
                        <ReportsList />
                    </Col>
                </Row>
            </Container>
        </>
    );
}
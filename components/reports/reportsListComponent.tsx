import { SyntheticEvent } from "react";
import router from 'next/router';
import { Col, Row } from "react-bootstrap";

export default function ReportsList() {
    const goToReport = (e: SyntheticEvent) => {
        e.preventDefault();
        const id = e.currentTarget.id;
        switch (id) {
            case "report-customer-export":
                router.push('/reports/customer-export/')
                break;
            default:
                break;
        }
    };

    return (
        <>
            <Row className="admin-container">
                <Col>
                    <ul>
                        <li><a id="report-customer-export" className="admin-link" onClick={goToReport}>Export Customer Data</a></li>
                    </ul>
                </Col>
            </Row>
        </>
    );
}
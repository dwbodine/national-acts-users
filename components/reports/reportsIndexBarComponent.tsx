import { Col, Row } from 'react-bootstrap';

export default function ReportsIndexBar() {
  let pageTitle: string = 'Reports';
  return (
    <Row className="page-header">
      <Col sm={6} xs={12} className="title-container">
        <div className="title">{pageTitle}</div>
      </Col>
    </Row>
  );
}

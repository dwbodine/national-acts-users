'use client';

import { Col, Row } from 'rsuite';

export default function AdminIndexBar() {
  const pageTitle: string = 'Admin';
  return (
    <Row className="page-header">
      <Col sm={6} xs={12} className="title-container">
        <div className="title">{pageTitle}</div>
      </Col>
    </Row>
  );
}

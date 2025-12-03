'use client';

import { Col, Container, Row } from 'rsuite';

import ReportsIndexBar from './reportsIndexBarComponent';
import ReportsList from './reportsListComponent';

export default function ReportsIndex() {
  return (
    <>
      <ReportsIndexBar />
      <Container className="fluid">
        <Row>
          <Col>
            <ReportsList />
          </Col>
        </Row>
      </Container>
    </>
  );
}

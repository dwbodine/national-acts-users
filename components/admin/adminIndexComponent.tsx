import { Col, Container, Row } from 'react-bootstrap';
import AdminIndexBar from './adminIndexBarComponent';
import AdminList from './adminListComponent';

export default function AdminIndex() {
  return (
    <>
      <AdminIndexBar />
      <Container fluid>
        <Row>
          <Col>
            <AdminList />
          </Col>
        </Row>
      </Container>
    </>
  );
}

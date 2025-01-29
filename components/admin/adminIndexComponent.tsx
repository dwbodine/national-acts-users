import { Col, Container, Row } from 'react-bootstrap';
import AdminIndexBar from './adminIndexBarComponent';
import AdminList from './adminListComponent';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetAdminSelection } from '@/lib/adminEventsSelectionSlice';

export default function AdminIndex() {
  const dispatch = useDispatch();
  useEffect(() => {
      const timeoutId = setTimeout(() => {
        dispatch(resetAdminSelection());
      }, 300);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatch]);
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

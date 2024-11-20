import { useGetLogs } from '@/hooks/admin/useGetLogs';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

export default function AdminLogIndex() {

  const [logs, setLogs] = useState<string | undefined>(undefined);
  const { getAllLogs } = useGetLogs();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (logs == undefined) {
        getAllLogs().then((response) => {
          if (response.logs && !response.errorMessage) {
            setLogs(response.logs);
          }
        });
      }
    }, 200);
    return () => {
      clearTimeout(timeoutId);
    };
  });


  return (
    <>
      <Container fluid>
        <Row>
          <Col className="log-table">
          {logs}
          </Col>
        </Row>
      </Container>
    </>
  );
}

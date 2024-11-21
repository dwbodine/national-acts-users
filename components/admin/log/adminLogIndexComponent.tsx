import { useGetLogs } from '@/hooks/admin/useGetLogs';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import moment from 'moment';
 

export default function AdminLogIndex() {

  const [logs, setLogs] = useState<string[] | undefined>(undefined);
  const { getAllLogs } = useGetLogs();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (logs == undefined) {
        getAllLogs().then((response) => {
          if (response.logs && !response.errorMessage) {
            setLogs(response.logs.split('\n'));
          }
        });
      }
    }, 200);
    return () => {
      clearTimeout(timeoutId);
    };
  });

  let logRows: any[] = [];
  if (logs && logs.length > 0) {
    for (const log of logs) {
      logRows.push(<p>{log}</p>);
    }
  }

  return (
    <>
      <Container fluid>
        <Row>
          <h5>API Error Log - {moment().format('YYYY-DD-MM HH:mm:ss')}</h5>
        </Row>
        <Row>
          <Col className="log-table">
          {logRows}
          </Col>
        </Row>
      </Container>
    </>
  );
}

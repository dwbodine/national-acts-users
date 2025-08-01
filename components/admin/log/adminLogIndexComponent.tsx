import { Col, Container, Row } from 'react-bootstrap';
import { ReactElement, useEffect, useState } from 'react';
import moment from 'moment';
import { useGetLogs } from '@/hooks/admin/useGetLogs';

export default function AdminLogIndex() {

  const [logs, setLogs] = useState<string[] | undefined>(undefined);
  const [cronLogs, setCronLogs] = useState<string[] | undefined>(undefined);
  const { getAllLogs, getAllCronLogs } = useGetLogs();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (logs === undefined) {
        getAllLogs().then((response) => {
          if (response.logs && !response.errorMessage) {
            setLogs(response.logs.split('\n'));
          }
        });
      }
      if (cronLogs === undefined) {
        getAllCronLogs().then((response) => {
          if (response.logs && !response.errorMessage) {
            setCronLogs(response.logs.split('\\r\\n'));
          }
        });
      }
    }, 200);
    return () => {
      clearTimeout(timeoutId);
    };
  });

  const logRows: ReactElement[] = [];
  if (logs && logs.length > 0) {
    for (const log of logs) {
      logRows.push(<p>{log}</p>);
    }
  }

  const cronLogRows: ReactElement[] = [];
  if (cronLogs && cronLogs.length > 0) {
    for (const log of cronLogs) {
      cronLogRows.push(<p>{log.replaceAll('"', '')}</p>);
    }
  }

  return (
    <>
      <Container fluid>
        <Row>
          <h5>Cron Log - {moment().format('YYYY-MM-DD HH:mm:ss')}</h5>
        </Row>
        <Row>
          <Col className="log-table">
            {cronLogRows}
          </Col>
        </Row>
        <Row>
          <h5>API Error Log - {moment().format('YYYY-MM-DD HH:mm:ss')}</h5>
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

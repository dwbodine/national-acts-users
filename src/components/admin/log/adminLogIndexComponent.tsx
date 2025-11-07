'use client';

import { Col, Container, Row } from 'rsuite';
import { ReactElement, useEffect, useState } from 'react';
import { LogResponse } from '@/types/responses';
import moment from 'moment';
import { useGetLogs } from '@/hooks/admin/useGetLogs';

export default function AdminLogIndex() {
  const [logs, setLogs] = useState<string[] | undefined>(undefined);
  const [cronLogs, setCronLogs] = useState<string[] | undefined>(undefined);
  const { getAllLogs, getAllCronLogs } = useGetLogs();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (logs === undefined) {
        void getAllLogs().then((response: LogResponse) => {
          if (response.logs && !response.error) {
            setLogs(response.logs.split('\n'));
          }
        });
      }
      if (cronLogs === undefined) {
        void getAllCronLogs().then((response: LogResponse) => {
          if (response.logs && !response.error) {
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
      cronLogRows.push(<p>{log.replace('"', '')}</p>);
    }
  }

  return (
    <>
      <Container className="fluid">
        <Row>
          <h5>Cron Log - {moment().format('YYYY-MM-DD HH:mm:ss')}</h5>
        </Row>
        <Row>
          <Col className="log-table">{cronLogRows}</Col>
        </Row>
        <Row>
          <h5>API Error Log - {moment().format('YYYY-MM-DD HH:mm:ss')}</h5>
        </Row>
        <Row>
          <Col className="log-table">{logRows}</Col>
        </Row>
      </Container>
    </>
  );
}

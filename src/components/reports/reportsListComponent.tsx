'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Col, Row } from 'rsuite';

import { setReloadReportData } from '@/lib/adminReportsSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';

export default function ReportsList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const goToReport = (reportId: string) => {
    switch (reportId) {
      case 'report-customer-export':
        router.push('/reports/customer-export');
        break;
      case 'report-missing-venues':
        router.push('/reports/missing-venues');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    dispatch(setIsLoading(false));
    dispatch(setReloadReportData(true));
  }, [dispatch]);

  return (
    <>
      <Row className="admin-container">
        <Col>
          <ul>
            <li>
              <a
                id="report-customer-export"
                className="admin-link"
                onClick={() => goToReport('report-customer-export')}
              >
                Export Customer Data
              </a>
            </li>
            <li>
              <a
                id="report-missing-venues"
                className="admin-link"
                onClick={() => goToReport('report-missing-venues')}
              >
                Missing Venues Report
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </>
  );
}

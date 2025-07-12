import { useEffect } from 'react';
import router from 'next/router';
import { Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { setReloadReportData } from '@/lib/adminReportsSelectionSlice';

export default function ReportsList() {
  const dispatch = useDispatch();
  const goToReport = (reportId: string) => {
    switch (reportId) {
      case 'report-customer-export':
        router.push('/reports/customer-export/');
        break;
      case 'report-missing-venues':
        router.push('/reports/missing-venues/');
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
              <a id="report-customer-export" className="admin-link" onClick={() => goToReport('report-customer-export')}>
                Export Customer Data
              </a>
            </li>
            <li>
              <a id="report-missing-venues" className="admin-link" onClick={() => goToReport('report-missing-venues')}>
                Missing Venues Report
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </>
  );
}

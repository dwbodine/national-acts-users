import { SyntheticEvent, useEffect } from 'react';
import router from 'next/router';
import { Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '@/lib/globalSelectionSlice';

export default function ReportsList() {
  const dispatch = useDispatch();
  const goToReport = (e: SyntheticEvent) => {
    e.preventDefault();
    const id = e.currentTarget.id;
    switch (id) {
      case 'report-customer-export':
        router.push('/reports/customer-export/');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    dispatch(setIsLoading(false));
  }, [dispatch]);

  return (
    <>
      <Row className="admin-container">
        <Col>
          <ul>
            <li>
              <a id="report-customer-export" className="admin-link" onClick={goToReport}>
                Export Customer Data
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </>
  );
}

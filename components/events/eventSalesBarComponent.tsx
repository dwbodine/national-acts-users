import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../src/lib/store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { setAdminDateRange } from '@/lib/adminEventsSelectionSlice';
import { useEffect } from 'react';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import router from 'next/router';
import moment from 'moment';
import { DatePicker } from 'rsuite';
import { EventTabView, DateRange } from '@/types/user';
import getSelectedAdminEventDateRange from '@/utils/getSelectedAdminEventDateRange';

export default function EventSalesBar() {
  const dispatch = useDispatch();
  const { getUser } = useCurrentUser();
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);
  const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);

  let pageTitle: string = 'Admin Events View';

  const onDateChange = (date: Date) => {
    const selectedDate = moment(date).unix();
    const tabView = currentReportSelection.eventTabView ?? EventTabView.Week;
    const dateRange = getSelectedAdminEventDateRange(selectedDate, tabView)
    dispatch(setAdminDateRange(dateRange));
  };

  useEffect(() => {
    const user = getUser();
    if (!user?.isAdmin) {
      router.push('/');
    } else if (currentReportSelection.start == undefined) {
      const selectedDate = moment().unix();
      const tabView = currentReportSelection.eventTabView ?? EventTabView.Week;
      const dateRange = getSelectedAdminEventDateRange(selectedDate, tabView)
      dispatch(setAdminDateRange(dateRange));
    }
  }, [windowSizeJson, getUser, currentReportSelection, dispatch]);

  const startDate = currentReportSelection.start ? moment.unix(currentReportSelection.start).toDate() : null;
  let datePickerlabel = '';
  switch (currentReportSelection.eventTabView) {
    case EventTabView.Agenda:
    case EventTabView.Month:
      datePickerlabel = "Month beginning";
      break;
    default:
      datePickerlabel = "Week beginning (Monday)";
      break;
  }

  return (
    <>
      <Row className="page-header">
        <Col sm={6} xs={12} className="title-container">
          <div className="title">{pageTitle}</div>
        </Col>
        <Col sm={6} xs={12} className="control-container no-print">
          <label className="events-datepicker-label">{datePickerlabel}:</label>
          <DatePicker
            format="M/d/yyyy"
            onSelect={onDateChange}
            value={startDate}
            oneTap
            cleanable={false}
          />
        </Col>
      </Row>
    </>
  );
}

import { Col, Row } from 'react-bootstrap';
import { DEFAULT_EVENT_TAB_VIEW, EVENTS_AGENDA_VIEW_BREAKPOINT } from '@/constants';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from 'rsuite';
import { EventTabView } from '@/types/user';
import type { RootState } from '../../lib/store';
import getSelectedAdminEventDateRange from '@/utils/getSelectedAdminEventDateRange';
import moment from 'moment';
import router from 'next/router';
import { setAdminDateRange } from '@/lib/adminEventsSelectionSlice';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useEffect } from 'react';
import { useWindowSize } from '@/hooks/common/useWindowSize';

export default function EventSalesBar() {
  const dispatch = useDispatch();
  const { getUser } = useCurrentUser();
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);
  const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);
  const agendaOnly = windowSize.width < EVENTS_AGENDA_VIEW_BREAKPOINT;

  const pageTitle: string = 'Admin Events View';

  const onDateChange = (date: Date) => {
    const selectedDate = moment(date).unix();
    const tabView = currentReportSelection.eventTabView ?? (agendaOnly ? EventTabView.Agenda : DEFAULT_EVENT_TAB_VIEW);
    const dateRange = getSelectedAdminEventDateRange(selectedDate, tabView)
    dispatch(setAdminDateRange(dateRange));
  };

  useEffect(() => {
    const user = getUser();
    if (!user?.isAdmin) {
      router.push('/');
    } else if (currentReportSelection.start === undefined) {
      const selectedDate = moment().unix();
      const tabView = currentReportSelection.eventTabView ?? (agendaOnly ? EventTabView.Agenda : DEFAULT_EVENT_TAB_VIEW);
      const dateRange = getSelectedAdminEventDateRange(selectedDate, tabView)
      dispatch(setAdminDateRange(dateRange));
    }
  }, [windowSizeJson, getUser, currentReportSelection, dispatch, agendaOnly]);

  let startDate = currentReportSelection.start ? moment.unix(currentReportSelection.start).toDate() : null;
  if (currentReportSelection.eventTabView === EventTabView.Month) {
    startDate = currentReportSelection.periodStart ? moment.unix(currentReportSelection.periodStart).toDate() : null;
  }

  let datePickerlabel = "Week beginning (Monday)";
  switch (currentReportSelection.eventTabView) {
    case EventTabView.Agenda:
    case EventTabView.Month:
      datePickerlabel = "Month beginning";
      break;
    default:
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

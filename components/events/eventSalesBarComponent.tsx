import DateRangeSelector from '../common/dateRangeSelectorComponent';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../src/lib/store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ResetButton from '../common/resetButtonComponent';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import PrintButton from '../common/printButtonComponent';
import {
  resetAdminSelection,
  setAdminDateRange,
  setReloadAdminEvents,
} from '@/lib/adminEventsSelectionSlice';
import { SyntheticEvent, useEffect } from 'react';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import AdminHiddenCheck from './hiddenCheckComponent';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import router from 'next/router';
import AdminInactiveCheck from './inactiveCheckComponent';
import AdminDeletedCheck from './deletedCheckComponent';
import moment from 'moment';
import { DatePicker } from 'rsuite';

export default function EventSalesBar() {
  const dispatch = useDispatch();
  const { getUser } = useCurrentUser();
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);
  const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);
  const hasEvents = currentReportSelection?.currentEvents?.length ?? 0 > 0;

  let pageTitle: string = 'Admin Events View';

  const onDateChange = (date: Date, event?: SyntheticEvent<Element, Event> | undefined) => {
    let reportSelection = { ...currentReportSelection };
    reportSelection.start = moment(date).startOf('week').add(1, 'day').startOf('day').unix();
    reportSelection.end = moment(date).startOf('week').add(7, 'days').startOf('day').unix();
    dispatch(setIsLoading(true));
    dispatch(setAdminDateRange(reportSelection));
    dispatch(setReloadAdminEvents(true));
  };

  const onResetClick = () => {
    dispatch(setIsLoading(true));
    dispatch(resetAdminSelection());
  };

  useEffect(() => {
    const user = getUser();
    if (!user?.isAdmin) {
      router.push('/');
    }
  }, [windowSizeJson, getUser]);

  const startDate = currentReportSelection.start ? moment.unix(currentReportSelection.start).toDate() : moment().startOf('week').toDate();

  return (
    <>
      <Row className="page-header">
        <Col sm={6} xs={12} className="title-container">
          <div className="title">{pageTitle}</div>
        </Col>
        <Col sm={6} xs={12} className="control-container no-print">
          <label className="events-datepicker-label">Week beginning (Monday):</label>
          <DatePicker
            disabled={!hasEvents}
            format="M/d/yyyy"
            onChangeCalendarDate={onDateChange}
            value={startDate}
            oneTap
            cleanable={false}
          />
        </Col>
      </Row>
    </>
  );
}

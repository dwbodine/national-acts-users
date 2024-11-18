import DateRangeSelector from '../common/dateRangeSelectorComponent';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../src/lib/store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ResetButton from '../common/resetButtonComponent';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import PrintButton from '../common/printButtonComponent';
import {
  resetSelection,
  setDateRange,
  setReloadEvents,
} from '@/lib/adminEventsSelectionSlice';
import { useEffect } from 'react';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import AdminHiddenCheck from './hiddenCheckComponent';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import router from 'next/router';
import AdminInactiveCheck from './inactiveCheckComponent';
import AdminDeletedCheck from './deletedCheckComponent';

export default function EventSalesBar() {
  const dispatch = useDispatch();
  const { getUser } = useCurrentUser();
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);
  const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);
  const hasEvents = currentReportSelection?.currentEvents?.length ?? 0 > 0;
  const dateRangeTitle = 'Event date range';

  let pageTitle: string = 'Admin Events View';

  const onDateChange = (selectedStart: number, selectedEnd: number) => {
    let reportSelection = { ...currentReportSelection };
    reportSelection.start = selectedStart;
    reportSelection.end = selectedEnd;
    reportSelection.retainDateSelection = true;
    dispatch(setIsLoading(true));
    dispatch(setDateRange(reportSelection));
    dispatch(setReloadEvents(true));
  };

  const onResetClick = () => {
    dispatch(setIsLoading(true));
    dispatch(resetSelection());
  };

  useEffect(() => {
    const user = getUser();
    if (!user?.isAdmin) {
      router.push('/');
    }
  }, [windowSizeJson, getUser]);
  return (
    <>
      <Row className="page-header">
        <Col sm={6} xs={12} className="title-container">
          <div className="title">{pageTitle}</div>
        </Col>
        <Col sm={6} xs={12} className="control-container no-print">
          <DateRangeSelector
            dateRangeTitle={dateRangeTitle}
            selectedStart={currentReportSelection?.start}
            selectedEnd={currentReportSelection?.end}
            disabled={!hasEvents}
            onDateChange={onDateChange}
          />
        </Col>
      </Row>
      <Row className="admin-check-row">
        <Col md={10} sm={12}>
          <AdminInactiveCheck />
          <AdminDeletedCheck />
          <AdminHiddenCheck />
        </Col>
      </Row>
      <Row
        className="no-print admin-button-row"
      >
        <Col md={10} sm={12}>
          <ResetButton
            OnResetClick={onResetClick}
          />
          {!windowSize.isMobile &&
            hasEvents ? (
            <PrintButton />
          ) : (
            ''
          )}
        </Col>
      </Row>
    </>
  );
}

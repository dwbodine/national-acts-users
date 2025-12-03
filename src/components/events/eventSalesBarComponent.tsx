'use client';

import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DEFAULT_EVENT_TAB_VIEW, EVENTS_AGENDA_VIEW_BREAKPOINT } from '@/constants';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { setAdminDateRange } from '@/lib/adminEventsSelectionSlice';
import { EventTabView } from '@/types/user';
import getSelectedAdminEventDateRange from '@/utils/getSelectedAdminEventDateRange';

import type { RootState } from '../../lib/store';
import PageHeader from '../common/PageHeaderComponent';

export default function EventSalesBar() {
  const dispatch = useDispatch();
  const { getUser } = useCurrentUser();
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);
  const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);
  const agendaOnly = windowSize.width < EVENTS_AGENDA_VIEW_BREAKPOINT;
  const router = useRouter();

  const pageTitle: string = 'Admin Events View';

  const onDateChange = (date: Date) => {
    const selectedDate = moment(date).unix();
    const tabView =
      currentReportSelection.eventTabView ??
      (agendaOnly ? EventTabView.Agenda : DEFAULT_EVENT_TAB_VIEW);
    const dateRange = getSelectedAdminEventDateRange(selectedDate, tabView);
    dispatch(setAdminDateRange(dateRange));
  };

  useEffect(() => {
    const user = getUser();
    if (!user?.isAdmin) {
      router.push('/');
    } else if (currentReportSelection.start === undefined) {
      const selectedDate = moment().unix();
      const tabView =
        currentReportSelection.eventTabView ??
        (agendaOnly ? EventTabView.Agenda : DEFAULT_EVENT_TAB_VIEW);
      const dateRange = getSelectedAdminEventDateRange(selectedDate, tabView);
      dispatch(setAdminDateRange(dateRange));
    }
  }, [windowSizeJson, getUser, currentReportSelection, dispatch, agendaOnly, router]);

  let startDate = currentReportSelection.start
    ? moment.unix(currentReportSelection.start).toDate()
    : null;
  if (currentReportSelection.eventTabView === EventTabView.Month) {
    startDate = currentReportSelection.periodStart
      ? moment.unix(currentReportSelection.periodStart).toDate()
      : null;
  }

  let datePickerlabel = 'Week beginning (Monday)';
  switch (currentReportSelection.eventTabView) {
    case EventTabView.Agenda:
    case EventTabView.Month:
      datePickerlabel = 'Month beginning';
      break;
    default:
      break;
  }

  return (
    <PageHeader
      pageTitle={pageTitle}
      showDatePicker={true}
      datePickerTitle={datePickerlabel}
      datePickerStart={startDate}
      onDatePickerChange={onDateChange}
    />
  );
}

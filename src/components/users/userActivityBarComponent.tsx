'use client';

import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/lib/store';
import { setReloadActivities, setUserActivityDateRange } from '@/lib/userActivitySelectionSlice';

import PageHeader from '../common/PageHeaderComponent';

export default function UserActivityBar() {
  const dispatch = useDispatch();
  const currentUserActivitySelection = useSelector(
    (state: RootState) => state.userActivitySelection,
  );
  const dateRangeTitle = 'Selected date range';

  const pageTitle: string = `User Activity`;

  const submitReport = () => {
    dispatch(setReloadActivities(true));
  };

  const onDateChange = (selectedStart: number, selectedEnd: number) => {
    const userActivitySelection = { ...currentUserActivitySelection };
    userActivitySelection.start = selectedStart;
    userActivitySelection.end = selectedEnd;
    dispatch(setUserActivityDateRange(userActivitySelection));
    submitReport();
  };

  return (
    <PageHeader
      pageTitle={pageTitle}
      showDateRange={true}
      dateRangeTitle={dateRangeTitle}
      dateRangeStart={currentUserActivitySelection?.start}
      dateRangeEnd={currentUserActivitySelection?.end}
      dateRangeDisabled={false}
      onDateRangeChange={onDateChange}
    />
  );
}

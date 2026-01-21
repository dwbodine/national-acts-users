'use client';

import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from 'rsuite';

import { setShowInactive } from '@/lib/adminEventsSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';

import type { RootState } from '../../lib/store';

export default function InactiveCheck() {
  const dispatch = useDispatch();
  const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);

  const handleChange = (checked: boolean) => {
    dispatch(setShowInactive(checked));
    dispatch(setIsLoading(true));
  };

  return (
    <span className="inactive-check">
      <Checkbox
        checked={currentReportSelection.showInactive}
        onChange={(_, checked) => handleChange(checked)}
        disabled={currentReportSelection.showDeleted}
      >
        Show inactive events?
      </Checkbox>
    </span>
  );
}

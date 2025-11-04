'use client';

import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent } from 'react';
import { FormCheck } from 'rsuite';
import type { RootState } from '../../lib/store';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { setShowInactive } from '@/lib/adminEventsSelectionSlice';

export default function InactiveCheck() {
  const dispatch = useDispatch();
  const currentReportSelection = useSelector(
    (state: RootState) => state.eventAdminSelection,
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setShowInactive(event.target.checked));
    dispatch(setIsLoading(true));
  };

  return (
    <span className="inactive-check">
      <FormCheck
        checked={currentReportSelection.showInactive}
        onChange={handleChange}
        disabled={currentReportSelection.showDeleted}
        label="Show inactive events?"
      />
    </span>
  );
}

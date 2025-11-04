'use client';

import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent } from 'react';
import { FormCheck } from 'rsuite';
import type { RootState } from '../../lib/store';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { setShowDeleted } from '@/lib/adminEventsSelectionSlice';

export default function AdminDeletedCheck() {
  const dispatch = useDispatch();
  const currentReportSelection = useSelector(
    (state: RootState) => state.eventAdminSelection,
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setShowDeleted(event.target.checked));
    dispatch(setIsLoading(true));
  };

  return (
    <span className="deleted-check">
      <FormCheck
        checked={currentReportSelection.showDeleted}
        onChange={handleChange}
        label="Show deleted events?"
      />
    </span>
  );
}

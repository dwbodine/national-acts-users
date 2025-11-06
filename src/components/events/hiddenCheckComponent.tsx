'use client';

import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from 'rsuite';
import type { RootState } from '../../lib/store';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { setShowHidden } from '@/lib/adminEventsSelectionSlice';

export default function AdminHiddenCheck() {
  const dispatch = useDispatch();
  const currentReportSelection = useSelector(
    (state: RootState) => state.eventAdminSelection,
  );

  const handleChange = (checked: boolean) => {
    dispatch(setShowHidden(checked));
    dispatch(setIsLoading(true));
  };

  return (
    <span className="hidden-check">
      <Checkbox
        checked={currentReportSelection.showHidden}
        onChange={(_, checked) => handleChange(checked)}
      >
        Show hidden events?
      </Checkbox>
    </span>
  );
}

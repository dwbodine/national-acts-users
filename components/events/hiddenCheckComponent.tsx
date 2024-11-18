import { ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../src/lib/store';
import { FormCheck } from 'react-bootstrap';
import { setShowHidden } from '@/lib/adminEventsSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';

export default function AdminHiddenCheck() {
  const dispatch = useDispatch();
  const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setShowHidden(event.target.checked));
    dispatch(setIsLoading(true));
  };

  return (
    <span className="hidden-check">
      <FormCheck
        checked={currentReportSelection.showHidden}
        onChange={handleChange}
        label="Show hidden events?"
      />
    </span>
  );
}

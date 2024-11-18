import { ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../src/lib/store';
import { FormCheck } from 'react-bootstrap';
import { setShowInactive } from '@/lib/adminEventsSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';

export default function InactiveCheck() {
  const dispatch = useDispatch();
  const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);

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

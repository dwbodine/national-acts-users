import { ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../src/lib/store';
import { FormCheck } from 'react-bootstrap';
import { setShowDeleted } from '@/lib/adminEventsSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';

export default function AdminDeletedCheck() {
  const dispatch = useDispatch();
  const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);

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

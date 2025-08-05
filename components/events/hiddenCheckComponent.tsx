import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent } from 'react';
import { FormCheck } from 'react-bootstrap';
import type { RootState } from '../../src/lib/store';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { setShowHidden } from '@/lib/adminEventsSelectionSlice';


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

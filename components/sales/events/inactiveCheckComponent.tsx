import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent } from 'react';
import { FormCheck } from 'react-bootstrap';
import type { RootState } from '../../../src/lib/store';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { setShowInactive } from '@/lib/reportSelectionSlice';

export default function InactiveCheck() {
  const dispatch = useDispatch();
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setShowInactive(event.target.checked));
    dispatch(setIsLoading(true));
  };

  return (
    <span className="inactive-check">
      <FormCheck
        checked={currentReportSelection.showInactive}
        onChange={handleChange}
        disabled={
          currentReportSelection.showDeleted ||
          currentReportSelection.seller.sellerId <= 0
        }
        label="Show inactive events?"
      />
    </span>
  );
}

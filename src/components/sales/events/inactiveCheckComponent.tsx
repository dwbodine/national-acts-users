'use client';

import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from 'rsuite';
import type { RootState } from '../../../lib/store';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { setShowInactive } from '@/lib/reportSelectionSlice';

export default function InactiveCheck() {
  const dispatch = useDispatch();
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

  const handleChange = (checked: boolean) => {
    dispatch(setShowInactive(checked));
    dispatch(setIsLoading(true));
  };

  return (
    <span className="inactive-check">
      <Checkbox
        checked={currentReportSelection.showInactive}
        onChange={(_, checked) => handleChange(checked)}
        disabled={currentReportSelection.showDeleted || currentReportSelection.seller.sellerId <= 0}
      >
        Show inactive events?
      </Checkbox>
    </span>
  );
}

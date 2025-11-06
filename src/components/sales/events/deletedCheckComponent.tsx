'use client';

import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from 'rsuite';
import type { RootState } from '../../../lib/store';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { setShowDeleted } from '@/lib/reportSelectionSlice';

export default function DeletedCheck() {
  const dispatch = useDispatch();
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

  const handleChange = (checked: boolean) => {
    dispatch(setShowDeleted(checked));
    dispatch(setIsLoading(true));
  };

  return (
    <span className="deleted-check">
      <Checkbox
        checked={currentReportSelection.showDeleted}
        onChange={(_, checked) => handleChange(checked)}
        disabled={currentReportSelection.seller.sellerId <= 0}
      >
        Show deleted events?
      </Checkbox>
    </span>
  );
}

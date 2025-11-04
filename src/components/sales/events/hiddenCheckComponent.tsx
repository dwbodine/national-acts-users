'use client';

import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent } from 'react';
import { FormCheck } from 'rsuite';
import type { RootState } from '../../../lib/store';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { setShowHidden } from '@/lib/reportSelectionSlice';

export default function HiddenCheck() {
  const dispatch = useDispatch();
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setShowHidden(event.target.checked));
    dispatch(setIsLoading(true));
  };

  return (
    <span className="hidden-check">
      <FormCheck
        checked={currentReportSelection.showHidden}
        onChange={handleChange}
        disabled={currentReportSelection.seller.sellerId <= 0}
        label="Show hidden events?"
      />
    </span>
  );
}

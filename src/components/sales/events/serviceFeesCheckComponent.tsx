'use client';

import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent } from 'react';
import { FormCheck } from 'rsuite';
import type { RootState } from '../../../lib/store';
import { setHideServiceFees } from '@/lib/reportSelectionSlice';

export default function ServiceFeesCheck() {
  const dispatch = useDispatch();
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setHideServiceFees(event.target.checked));
  };

  return (
    <span className="service-fees-check">
      <FormCheck
        checked={currentReportSelection.hideServiceFees}
        onChange={handleChange}
        disabled={
          currentReportSelection.seller.sellerId <= 0 ||
          currentReportSelection.hideRevenue
        }
        label="Hide service fees?"
      />
    </span>
  );
}

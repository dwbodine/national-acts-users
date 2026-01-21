'use client';

import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from 'rsuite';

import { setHideServiceFees } from '@/lib/reportSelectionSlice';

import type { RootState } from '../../../lib/store';

export default function ServiceFeesCheck() {
  const dispatch = useDispatch();
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

  const handleChange = (checked: boolean) => {
    dispatch(setHideServiceFees(checked));
  };

  return (
    <span className="service-fees-check">
      <Checkbox
        checked={currentReportSelection.hideServiceFees}
        onChange={(_, checked) => handleChange(checked)}
        disabled={currentReportSelection.seller.sellerId <= 0 || currentReportSelection.hideRevenue}
      >
        Hide service fees?
      </Checkbox>
    </span>
  );
}

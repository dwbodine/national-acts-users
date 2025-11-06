'use client';

import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from 'rsuite';
import type { RootState } from '../../../lib/store';
import { setHideRevenue } from '@/lib/reportSelectionSlice';

export default function RevenueCheck() {
  const dispatch = useDispatch();
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

  const handleChange = (checked: boolean) => {
    dispatch(setHideRevenue(checked));
  };

  return (
    <span className="revenue-check">
      <Checkbox
        checked={currentReportSelection.hideRevenue}
        onChange={(_, checked) => handleChange(checked)}
        disabled={currentReportSelection.seller.sellerId <= 0}
      >
        Hide revenue items?
      </Checkbox>
    </span>
  );
}

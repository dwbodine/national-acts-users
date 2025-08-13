"use client";

import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent } from 'react';
import { FormCheck } from 'react-bootstrap';
import type { RootState } from '../../../lib/store';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { setShowDeleted } from '@/lib/reportSelectionSlice';

export default function DeletedCheck() {
  const dispatch = useDispatch();
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setShowDeleted(event.target.checked));
    dispatch(setIsLoading(true));
  };

  return (
    <span className="deleted-check">
      <FormCheck
        checked={currentReportSelection.showDeleted}
        onChange={handleChange}
        disabled={currentReportSelection.seller.sellerId <= 0}
        label="Show deleted events?"
      />
    </span>
  );
}

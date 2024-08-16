import { ChangeEvent } from 'react';
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../../../src/lib/store';
import { FormCheck } from 'react-bootstrap';
import { setShowInactive } from '@/lib/reportSelectionSlice';

export default function InactiveCheck() {
    const dispatch = useDispatch(); 
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setShowInactive(event.target.checked));
    };
    
    return (
        <span className="inactive-check">
            <FormCheck checked={currentReportSelection.showInactive} onChange={handleChange} disabled={currentReportSelection.showDeleted || (currentReportSelection.seller.sellerId <= 0)} /> Show inactive events?
        </span>
    );        
 
}

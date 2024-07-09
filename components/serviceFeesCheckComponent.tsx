import { ChangeEvent } from 'react';
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../src/lib/store';
import { FormCheck } from 'react-bootstrap';
import { setHideServiceFees } from '@/lib/reportSelectionSlice';

export default function ServiceFeesCheck() {
    const dispatch = useDispatch(); 
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setHideServiceFees(event.target.checked));
    };
    
    return (
        <div className="service-fees-check">
            <FormCheck checked={currentReportSelection.hideServiceFees} onChange={handleChange} disabled={(currentReportSelection.seller.sellerId <= 0)}/> Hide service fees?
        </div>
    );        
 
}

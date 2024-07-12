import { ChangeEvent } from 'react';
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../src/lib/store';
import { FormCheck } from 'react-bootstrap';
import { setHideRevenue } from '@/lib/reportSelectionSlice';

export default function RevenueCheck() {
    const dispatch = useDispatch(); 
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setHideRevenue(event.target.checked));
    };
    
    return (
        <span className="revenue-check">
            <FormCheck checked={currentReportSelection.hideRevenue} onChange={handleChange} disabled={(currentReportSelection.seller.sellerId <= 0)}/> Hide revenue items?
        </span>
    );        
 
}

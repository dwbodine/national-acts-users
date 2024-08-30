import { ChangeEvent } from 'react';
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../../../src/lib/store';
import { FormCheck } from 'react-bootstrap';
import { setShowHidden } from '@/lib/reportSelectionSlice';

export default function HiddenCheck() {
    const dispatch = useDispatch(); 
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setShowHidden(event.target.checked));
    };
    
    return (
        <span className="hidden-check">
            <FormCheck checked={currentReportSelection.showHidden} onChange={handleChange} disabled={(currentReportSelection.seller.sellerId <= 0)} label="Show hidden events?" />
        </span>
    );        
 
}

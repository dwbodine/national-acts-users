import { ChangeEvent } from 'react';
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../../../src/lib/store';
import { FormCheck } from 'react-bootstrap';
import { setShowDeleted } from '@/lib/reportSelectionSlice';

export default function DeletedCheck() {
    const dispatch = useDispatch(); 
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setShowDeleted(event.target.checked));
    };
    
    return (
        <span className="deleted-check">
            <FormCheck checked={currentReportSelection.showDeleted} onChange={handleChange} disabled={(currentReportSelection.seller.sellerId <= 0)} label="Show deleted events?" />
        </span>
    );        
 
}

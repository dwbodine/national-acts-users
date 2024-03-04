import { ChangeEvent } from 'react';
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../src/lib/store';
import { Checkbox } from 'rsuite';
import { ValueType } from 'rsuite/esm/Checkbox';
import { setShowInactive } from '@/lib/reportSelectionSlice';

export default function InactiveCheck() {
    const dispatch = useDispatch(); 
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

    const handleChange = (value: ValueType | undefined, checked: boolean, event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setShowInactive(checked));
    };
    
    return (
        <>
            <Checkbox onChange={handleChange} disabled={currentReportSelection.showDeleted || (currentReportSelection.sellerId <= 0)} /> Show inactive?
        </>
    );        
 
}

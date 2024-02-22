import { ChangeEvent } from 'react';
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../src/lib/store';
import { Checkbox } from 'rsuite';
import { ValueType } from 'rsuite/esm/Checkbox';
import { setShowDeleted } from '@/lib/reportSelectionSlice';

export default function DeletedCheck() {
    const dispatch = useDispatch(); 
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

    const handleChange = (value: ValueType | undefined, checked: boolean, event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setShowDeleted(checked));
    };
    
    return (
        <div>
            <Checkbox onChange={handleChange}/> Show deleted?
        </div>
    );        
 
}

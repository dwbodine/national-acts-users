import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../../src/lib/store';
import { Button } from 'react-bootstrap';
import { resetSelection } from '@/lib/reportSelectionSlice';

export default function ResetButton() {
    const dispatch = useDispatch(); 
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

    const handleClick = () => {
        dispatch(resetSelection());
    };
    
    return (
        <span className="admin-button">
            <Button onClick={handleClick} disabled={(currentReportSelection.seller.sellerId <= 0)}>Reset</Button>
        </span>
    );        
 
}

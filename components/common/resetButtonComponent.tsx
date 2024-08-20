import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../../src/lib/store';
import { Button } from 'react-bootstrap';
import { resetSelection } from '@/lib/reportSelectionSlice';

export default function ResetButton(props: any) {
    const dispatch = useDispatch(); 
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

    const isDisabled = props.IsDisabled as boolean;
    const onResetClick = props.OnResetClick;

    const handleClick = () => {
        onResetClick();
    };
    
    return (
        <span className="admin-button">
            <Button onClick={handleClick} disabled={isDisabled}>Reset</Button>
        </span>
    );        
 
}

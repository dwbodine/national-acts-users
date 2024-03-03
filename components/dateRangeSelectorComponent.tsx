import { SyntheticEvent } from 'react';
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../src/lib/store';
import { setDateRange, setReloadEvents } from '@/lib/reportSelectionSlice';
import { DateRangePicker } from 'rsuite';
import { DateRange } from 'rsuite/esm/DateRangePicker';
import moment from 'moment';

export default function DateRangeSelector() {
    const dispatch = useDispatch(); 
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

    let start = new Date();
    let end = new Date();

    if (currentReportSelection.start && currentReportSelection.end 
        && currentReportSelection.start > 0 && currentReportSelection.end > 0) {
            start = new Date(currentReportSelection.start * 1000);
            end = new Date(currentReportSelection.end * 1000);
        }

    const handleChange = (value: DateRange | null, event: SyntheticEvent<Element, Event>) => {
        const selectedStart = value ? moment(value[0]).unix() : 0;
        const selectedEnd = value ? moment(value[1]).unix() : 0;
        let reportSelection = { ...currentReportSelection};
        reportSelection.start = selectedStart;
        reportSelection.end = selectedEnd;
        reportSelection.retainDateSelection = true;
        dispatch(setDateRange(reportSelection));
        dispatch(setReloadEvents(true));
    };

    const dateValues: DateRange = [start, end];
    
    return (
        <div>
            <DateRangePicker format="MM/dd/yyyy" character=" – " onChange={handleChange} value={dateValues}/>
        </div>
    );        
 
}

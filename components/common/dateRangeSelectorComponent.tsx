import { SyntheticEvent } from 'react';
import { DateRangePicker } from 'rsuite';
import { DateRange } from 'rsuite/esm/DateRangePicker';
import moment from 'moment';
import { FaCalendar } from 'react-icons/fa';
import 'rsuite/DateRangePicker/styles/index.css';

export default function DateRangeSelector(props: any) {
    
    const title = props.dateRangeTitle;
    const onDateChange = props.onDateChange;
    const selectedStart = props.selectedStart;
    const selectedEnd = props.selectedEnd;
    const disabled = props.disabled;

    let start = new Date();
    let end = new Date();

    if (selectedStart && selectedEnd && selectedStart > 0 && selectedEnd > 0) {
        start = new Date(selectedStart * 1000);
        end = new Date(selectedEnd * 1000);
    }

    const handleChange = (value: DateRange | null, event: SyntheticEvent<Element, Event>) => {
        const selectedStart = value ? moment(value[0]).unix() : 0;
        const selectedEnd = value ? moment(value[1]).unix() : 0;
        if (onDateChange) {
            onDateChange(selectedStart, selectedEnd);
        }
    };

    const dateValues: DateRange = [start, end];
    
    return (
        <>
            <span className="date-range-title">{title}:</span>
            <DateRangePicker caretAs={FaCalendar} placement="bottomEnd" appearance="default" format="MM/dd/yyyy" character=" – " onChange={handleChange} value={dateValues} disabled={disabled}/>
        </>
    );        
 
}

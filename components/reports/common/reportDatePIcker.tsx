import moment from "moment";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { DatePicker } from "rsuite";


export default function ReportDatePicker(props: any) {
    const onChange = props.onChange;
    const [start, setStart] = useState<number>(props.start);
    const [end, setEnd] = useState<number>(props.end);

    const onStartChange = (date: Date | null) => {
        if (!date) {
            return;
        }
        const startDate = moment(date).startOf('day');
        const newStart = startDate.unix();
        let changed: boolean = false;
        if (newStart > end) {
            setStart(end);
            setEnd(newStart);        
            onChange(end, newStart);
        } else if (newStart == end) {
            setStart(newStart);
            setEnd(newStart + 86400);
            onChange(newStart, newStart + 86400);
        } else {
            setStart(newStart);
            onChange(newStart, end);
        }
    };

    const onEndChange = (date: Date | null) => {
        if (!date) {
            return;
        }
        const endDate = moment(date).startOf('day');
        const newEnd = endDate.unix();
        let changed: boolean = false;
        if (newEnd < start) {
            setEnd(start);
            setStart(newEnd);                
            onChange(newEnd, start);
        } else if (newEnd == start) {
            setEnd(newEnd + 86400);
            onChange(start, newEnd + 86400);
        } else {
            setEnd(newEnd);
            onChange(start, newEnd);
        }
    };

    const startDate = moment.unix(start).toDate();
    const endDate = moment.unix(end).toDate();

    return(
        <>
            <Row>
                <Col><label className="admin-report-datepicker-label">Start date:</label><DatePicker id="startDate" format="M/d/yyyy" onChange={onStartChange} value={startDate} oneTap={true} /></Col>
            </Row>
            <Row>
                <Col><label className="admin-report-datepicker-label">End date:</label><DatePicker id="endDate" format="M/d/yyyy" onChange={onEndChange} value={endDate} oneTap={true} /></Col>
            </Row>            
        </>
    );
}
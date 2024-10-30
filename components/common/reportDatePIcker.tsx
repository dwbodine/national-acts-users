import { MINIMUM_UNIX_TIMESTAMP } from "@/constants";
import moment from "moment";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { DatePicker } from "rsuite";


export default function ReportDatePicker(props: any) {
    const onChange = props.onChange;
    const onStartClear = props.onStartClear;
    const onEndClear = props.onEndClear;
    const [start, setStart] = useState<number | undefined>(props.start);
    const [end, setEnd] = useState<number | undefined>(props.end);

    const minStart = MINIMUM_UNIX_TIMESTAMP;

    const onStartChange = (date: Date | null) => {
        if (!date) {
            return;
        }
        const startDate = moment(date).startOf('day');
        let newStart = startDate.unix();
        if (newStart < minStart) {
            newStart = minStart;
        }
        
        setStart(newStart);
        if (onChange) {
            onChange(newStart, end);
        }            
    };

    const onEndChange = (date: Date | null) => {
        if (!date) {
            return;
        }
        const endDate = moment(date).startOf('day');
        let newEnd = endDate.unix();
        if (newEnd < minStart) {
            newEnd = minStart;
        }
        setEnd(newEnd);
        if (onChange) {
            onChange(start, newEnd);
        }        
    };

    const onCleanStart = () => {
        setStart(undefined);
        if (onStartClear) {
            onStartClear();
        }        
    };

    const onCleanEnd = () => {
        setEnd(undefined);
        if (onEndClear) {
            onEndClear();
        }        
    };

    const startDate = start ? moment.unix(start).toDate() : null;
    const endDate = end ? moment.unix(end).toDate() : null;

    return(
        <>
            <Row>
                <Col><label className="admin-report-datepicker-label">Start date:</label><DatePicker id="startDate" format="M/d/yyyy" onChange={onStartChange} value={startDate} oneTap cleanable onClean={onCleanStart} /></Col>
            </Row>
            <Row>
                <Col><label className="admin-report-datepicker-label">End date:</label><DatePicker id="endDate" format="M/d/yyyy" onChange={onEndChange} value={endDate} oneTap cleanable onClean={onCleanEnd} /></Col>
            </Row>            
        </>
    );
}
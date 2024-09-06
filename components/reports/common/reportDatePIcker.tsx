import { MINIMUM_UNIX_TIMESTAMP } from "@/constants";
import moment from "moment";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { DatePicker } from "rsuite";


export default function ReportDatePicker(props: any) {
    const onChange = props.onChange;
    const [start, setStart] = useState<number>(props.start);
    const [end, setEnd] = useState<number>(props.end);

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
        onChange(newStart, end);
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
        onChange(start, newEnd);
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
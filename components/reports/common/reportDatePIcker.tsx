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
        const newStart = moment(date).unix();
        let changed: boolean = false;
        if (newStart > end) {
            setStart(end);
            setEnd(newStart);        
            changed = true;
        } else if (newStart == end) {
            setStart(newStart);
            setEnd(newStart + 86400);
            changed = true;
        } else {
            setStart(newStart);
            changed = true;
        }

        if (changed) {
            onChange(start, end);
        }       
    };

    const onEndChange = (date: Date | null) => {
        if (!date) {
            return;
        }
        const newEnd = moment(date).unix();
        let changed: boolean = false;
        if (newEnd < start) {
            setEnd(start);
            setStart(newEnd);                
            changed = true;
        } else if (newEnd == start) {
            setEnd(newEnd + 86400);
            changed = true;
        } else {
            setEnd(newEnd);
            changed = true;
        }

        if (changed) {
            onChange(start, end);
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
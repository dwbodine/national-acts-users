import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../src/lib/store';
import { Col } from 'react-bootstrap';
import moment from 'moment';
import { VipEvent } from '@/types/event';

export default function WeekDay(props: any) {
    const dispatch = useDispatch();
    const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);

    const weekDate = props.WeekDate ? moment(props.WeekDate) : undefined;
    const events = props.Events as VipEvent[] | undefined;

    let eventRows: any[] = [];
    if (events && events.length > 0) {
        events.forEach((evt) => {
            eventRows.push(<div className="week-day-event">{evt.title}</div>)
        });
    }

    return (
        <Col className="week-day">
            <div className="week-day-name">{weekDate?.format('ddd')}</div>
            <div className="week-day-number">{weekDate?.format('D')}</div>
            {eventRows}
        </Col>
    );
}

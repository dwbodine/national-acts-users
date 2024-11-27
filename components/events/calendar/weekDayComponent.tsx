import { useDispatch, useSelector } from 'react-redux';
import { Col } from 'react-bootstrap';
import moment from 'moment';
import { VipEvent } from '@/types/event';
import { useGetEventStatus } from '@/hooks/common/useGetEventStatus';
import { setExpandedRows } from '@/lib/adminEventsSelectionSlice';
import { RootState } from '@/lib/store';

export default function WeekDay(props: any) {
    const dispatch = useDispatch();
    const { getEventStatusSlug, getEventStatusText } = useGetEventStatus();
    const weekDate = props.WeekDate ? moment(props.WeekDate) : undefined;
    const events = props.Events as VipEvent[] | undefined;
    const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);

    const setRowExpanded = (ticketSocketEventId: number) => {
        let expandedRowKeys = currentReportSelection.expandedRows ? [...currentReportSelection.expandedRows] : [];
        if (expandedRowKeys.includes(ticketSocketEventId)) {
            expandedRowKeys = expandedRowKeys.filter(x => x != ticketSocketEventId);
        } else {
            expandedRowKeys.push(ticketSocketEventId);
        }        
        dispatch(
            setExpandedRows(expandedRowKeys)
        );
    };

    let eventRows: any[] = [];
    if (events && events.length > 0) {
        events.forEach((evt) => {
            const statusSlug = getEventStatusSlug(evt);
            const statusText = getEventStatusText(evt);
            let statusClass = "week-day-event";
            let title = '';
            if (statusSlug != "active") {
                statusClass += ` ${statusSlug}`;
                title = statusText;
            }
            eventRows.push(<div onClick={() => setRowExpanded(evt.ticketSocketEventId)} title={title} className={statusClass}>{evt.title}</div>)
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

import { useDispatch, useSelector } from 'react-redux';
import { Col } from 'react-bootstrap';
import moment from 'moment';
import { VipEvent } from '@/types/event';
import { useGetEventStatus } from '@/hooks/common/useGetEventStatus';
import { setExpandedRows, setFocusControl } from '@/lib/adminEventsSelectionSlice';
import { RootState } from '@/lib/store';

export default function WeekDay(props: any) {
    const dispatch = useDispatch();
    const { getEventStatusSlug, getEventStatusText } = useGetEventStatus();
    const weekDate = props.WeekDate ? moment(props.WeekDate) : undefined;
    const events = props.Events as VipEvent[] | undefined;
    const key = props.WeekDayNumber as number;
    const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);

    const setRowExpanded = (ticketSocketEventId: number) => {
        let expandedRowKeys = currentReportSelection.expandedRows ? [...currentReportSelection.expandedRows] : [];
        let focusControlId = `expandedRow_${ticketSocketEventId}`;
        if (expandedRowKeys.includes(ticketSocketEventId)) {
            expandedRowKeys = expandedRowKeys.filter(x => x != ticketSocketEventId);
            focusControlId = '';
        } else {
            expandedRowKeys.push(ticketSocketEventId);
        }        
        dispatch(
            setExpandedRows(expandedRowKeys)
        );
        dispatch(
            setFocusControl(focusControlId)
        );
    };

    let eventRows: any[] = [];
    if (events && events.length > 0) {
        events.forEach((evt, i) => {
            const statusSlug = getEventStatusSlug(evt);
            const statusText = getEventStatusText(evt);
            let statusClass = "week-day-event";
            let title = '';
            if (statusSlug != "active") {
                statusClass += ` ${statusSlug}`;
                title = statusText;
            }
            eventRows.push(<div key={`wdEvt_${key}_${i}`} onClick={() => setRowExpanded(evt.ticketSocketEventId)} title={title} className={statusClass}>{evt.title}</div>)
        });
    }

    return (
        <Col key={`wd_${key}`} className="week-day">
            <div className="week-day-name">{weekDate?.format('ddd')}</div>
            <div className="week-day-number">{weekDate?.format('D')}</div>
            {eventRows}
        </Col>
    );
}

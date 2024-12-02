import moment from 'moment';
import { VipEvent } from '@/types/event';
import { Col, Row } from 'react-bootstrap';
import WeekDay from './weekDayComponent';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { setAdminDateRange, setReloadAdminEvents } from '@/lib/adminEventsSelectionSlice';

export default function WeekView(props: any) {
    const startOfWeek = props.StartOfWeek ? moment(props.StartOfWeek).startOf('day') : undefined;
    const events = props.Events as VipEvent[] | undefined;

    const dispatch = useDispatch();
    const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);

    const previousWeek = () => {
        let reportSelection = { ...currentReportSelection };
        if (!reportSelection || !reportSelection.start) {
            return;
        }
        reportSelection.start = moment.unix(reportSelection.start).startOf('week').add(-6, 'day').startOf('day').unix();
        reportSelection.end = moment(reportSelection.start).startOf('week').startOf('day').unix();
        dispatch(setIsLoading(true));
        dispatch(setAdminDateRange(reportSelection));
        dispatch(setReloadAdminEvents(true));
    };

    const nextWeek = () => {
        let reportSelection = { ...currentReportSelection };
        if (!reportSelection || !reportSelection.start) {
            return;
        }
        reportSelection.start = moment.unix(reportSelection.start).startOf('week').add(8, 'day').startOf('day').unix();
        reportSelection.end = moment(reportSelection.start).startOf('week').add(14, 'days').startOf('day').unix();
        dispatch(setIsLoading(true));
        dispatch(setAdminDateRange(reportSelection));
        dispatch(setReloadAdminEvents(true));
    };

    let weekdays: any[] = [];
    if (startOfWeek) {
        let displayDate = startOfWeek;
        for (let i = 0; i < 7; i++) {
            let filteredEvents: VipEvent[] = [];
            if (events && events.length > 0) {
                filteredEvents = events.filter(x => moment(x.eventDate).valueOf() >= displayDate.startOf('day').valueOf() && moment(x.eventDate).valueOf() < displayDate.endOf('day').valueOf());
            }
            weekdays.push(<WeekDay key={i} WeekDayNumber={i}
                WeekDate={displayDate.format('YYYY-MM-DD')}
                Events={filteredEvents}
            />);
            displayDate = displayDate.add(1, 'day');
        }
    }

    return (
        <Col className="week-view">
            <Row className="week-view-action">
                <Col className="week-view-action-previous"><a href="#" onClick={previousWeek}><FaArrowLeft />Previous</a></Col>
                <Col className="week-view-action-next"><a href="#" onClick={nextWeek}>Next<FaArrowRight /></a></Col>
            </Row>
            <Row className="week-view-calendar">
                {weekdays}
            </Row>
        </Col>
    );
}

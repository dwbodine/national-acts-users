import moment from 'moment';
import { Note, VipEvent } from '@/types/event';
import { Col, Row } from 'react-bootstrap';
import WeekDay from './weekDayComponent';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { setAdminDateRange, setReloadAdminEvents } from '@/lib/adminEventsSelectionSlice';
import { DateRange, EventTabView } from '@/types/user';
import getSelectedAdminEventDateRange from '@/utils/getSelectedAdminEventDateRange';

export default function WeekView(props: any) {
    const startOfWeek = props.StartOfWeek ? moment(props.StartOfWeek).startOf('day') : undefined;
    const events = props.Events as VipEvent[] | undefined;
    const notes = props.Notes as Note[] | undefined;

    const dispatch = useDispatch();
    const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);

    const previousWeek = () => {
        let reportSelection = { ...currentReportSelection };
        if (!reportSelection || !reportSelection.start) {
            return;
        }
        let previousMonday = moment.unix(reportSelection.start).subtract(7, 'days').startOf('day').unix();
        const dateRange = getSelectedAdminEventDateRange(previousMonday, EventTabView.Week);
        dispatch(setIsLoading(true));
        dispatch(setAdminDateRange(dateRange));
    };

    const nextWeek = () => {
        let reportSelection = { ...currentReportSelection };
        if (!reportSelection || !reportSelection.start) {
            return;
        }
        let nextMonday = moment.unix(reportSelection.start).add(7, 'days').startOf('day').unix();
        const dateRange = getSelectedAdminEventDateRange(nextMonday, EventTabView.Week);
        dispatch(setIsLoading(true));
        dispatch(setAdminDateRange(dateRange));
    };

    let weekdays: any[] = [];
    if (startOfWeek) {
        let displayDate = startOfWeek;
        for (let i = 0; i < 7; i++) {
            let filteredEvents: VipEvent[] = [];
            let filteredNotes: Note[] = [];
            if (events && events.length > 0) {
                filteredEvents = events.filter(x => moment(x.eventDate).valueOf() >= displayDate.startOf('day').valueOf() && moment(x.eventDate).valueOf() <= displayDate.endOf('day').valueOf());
            }
            if (notes && notes.length > 0) {
                filteredNotes = notes.filter(x => moment(x.noteTimestamp).valueOf() >= displayDate.startOf('day').valueOf() && moment(x.noteTimestamp).valueOf() <= displayDate.endOf('day').valueOf())
            }
            weekdays.push(<WeekDay key={i} WeekDayNumber={i}
                WeekDate={displayDate.format('YYYY-MM-DD')}
                Events={filteredEvents}
                Notes={filteredNotes}
            />);
            displayDate = displayDate.add(1, 'day');
        }
    }

    return (
        <Col className="week-view">
            <Row className="week-view-action">
                <Col className="week-view-action-previous"><a href="#" onClick={previousWeek}><FaArrowLeft />Previous Week</a></Col>
                <Col className="week-view-action-next"><a href="#" onClick={nextWeek}>Next Week<FaArrowRight /></a></Col>
            </Row>
            <Row className="week-view-calendar">
                {weekdays}
            </Row>
        </Col>
    );
}

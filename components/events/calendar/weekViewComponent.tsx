import moment from 'moment';
import { VipEvent } from '@/types/event';
import { Col, Row } from 'react-bootstrap';
import WeekDay from './weekDayComponent';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export default function WeekView(props: any) {
    const startOfWeek = props.StartOfWeek ? moment(props.StartOfWeek).startOf('day') : undefined;
    const events = props.Events as VipEvent[] | undefined;

    const dispatch = useDispatch();
    const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);

    const previousWeek = () => {

    };

    const nextWeek = () => {

    };

    let weekdays: any[] = [];
    if (startOfWeek) {
        let displayDate = startOfWeek;
        for (let i = 0; i < 7; i++) {
            let filteredEvents: VipEvent[] = [];
            if (events && events.length > 0) {
                filteredEvents = events.filter(x => moment(x.eventDate).valueOf() >= displayDate.startOf('day').valueOf() && moment(x.eventDate).valueOf() < displayDate.endOf('day').valueOf());
            }
            weekdays.push(<WeekDay
                WeekDate={displayDate.format('YYYY-MM-DD')}
                Events={filteredEvents}
            />);
        }
    }

    return (
        <Col className="week-view">
            <Row className="week-view-action">
                <Col className="week-view-action-previous"><a onClick={previousWeek}><FaArrowLeft />Previous</a></Col>
                <Col className="week-view-action-next"><a onClick={nextWeek}>Next<FaArrowRight /></a></Col>
            </Row>
            <Row className="week-view-calendar">
                {weekdays}
            </Row>
        </Col>
    );
}

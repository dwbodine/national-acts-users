import { setAdminDateRange } from "@/lib/adminEventsSelectionSlice";
import { setIsLoading } from "@/lib/globalSelectionSlice";
import { RootState } from "@/lib/store";
import { Note, VipEvent } from "@/types/event";
import { DateRange } from "@/types/user";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import AgendaDay from "./agendaDayComponent";
import { Col, Row } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";


export default function AgendaView(props: any) {
    const startOfMonth = props.StartOfMonth ? moment(props.StartOfMonth).startOf('day') : undefined;
    const events = props.Events as VipEvent[] | undefined;
    const notes = props.Notes as Note[] | undefined;

    const dispatch = useDispatch();
    const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);

    const previousMonth = () => {
        let reportSelection = { ...currentReportSelection };
        if (!reportSelection || !reportSelection.start) {
            return;
        }
        let dateRange: DateRange = {
            start: 0,
            end: 0
        };
        dateRange.start = moment.unix(reportSelection.start).startOf('month').add(-1, 'month').startOf('day').unix();
        dateRange.end = moment(dateRange.start).endOf('month').endOf('day').unix();
        dispatch(setIsLoading(true));
        dispatch(setAdminDateRange(dateRange));
    };

    const nextMonth = () => {
        let reportSelection = { ...currentReportSelection };
        if (!reportSelection || !reportSelection.start) {
            return;
        }
        let dateRange: DateRange = {
            start: 0,
            end: 0
        };
        dateRange.start = moment.unix(reportSelection.start).startOf('month').add(1, 'month').startOf('day').unix();
        dateRange.end = moment(dateRange.start).endOf('month').endOf('day').unix();
        dispatch(setIsLoading(true));
        dispatch(setAdminDateRange(dateRange));
    };

    let agendaDays: any[] = [];
    if (startOfMonth && events && events.length > 0) {
        let displayDate = startOfMonth;
        for (let i = 0; i < events?.length; i++) {
            let filteredEvents: VipEvent[] = [];
            let filteredNotes: Note[] = [];
            if (events && events.length > 0) {
                filteredEvents = events.filter(x => moment(x.eventDate).valueOf() >= displayDate.startOf('day').valueOf() && moment(x.eventDate).valueOf() < displayDate.endOf('day').valueOf());
            }
            if (notes && notes.length > 0) {
                filteredNotes = notes.filter(x => moment(x.noteTimestamp).valueOf() >= displayDate.startOf('day').valueOf() && moment(x.noteTimestamp).valueOf() < displayDate.endOf('day').valueOf())
            }
            agendaDays.push(<AgendaDay key={i} AgendaDayNumber={i}
                AgendaDate={displayDate.format('YYYY-MM-DD')}
                Events={filteredEvents}
                Notes={filteredNotes}
            />);
            displayDate = displayDate.add(1, 'day');
        }
    }

    return (
        <Col className="agenda-view">
            <Row className="agenda-view-action">
                <Col className="agenda-view-action-previous"><a href="#" onClick={previousMonth}><FaArrowLeft />Previous Month</a></Col>
                <Col className="agenda-view-action-next"><a href="#" onClick={nextMonth}>Next Month<FaArrowRight /></a></Col>
            </Row>
            {agendaDays}
        </Col>
    )
}
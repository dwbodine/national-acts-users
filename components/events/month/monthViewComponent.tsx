import { Col, Row } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Note, VipEvent } from "@/types/event";
import { useDispatch, useSelector } from "react-redux";
import EventDataExpanded from "../../common/eventDataExpandedComponent";
import { EventTabView } from "@/types/user";
import MonthDay from "./monthDayComponent";
import { MonthViewProps } from "@/types/props";
import MonthWeek from "./monthWeekComponent";
import { ReactElement } from "react";
import { RootState } from "@/lib/store";
import getSelectedAdminEventDateRange from "@/utils/getSelectedAdminEventDateRange";
import moment from "moment";
import { setAdminDateRange } from "@/lib/adminEventsSelectionSlice";
import { setIsLoading } from "@/lib/globalSelectionSlice";

export default function MonthView(props: MonthViewProps) {
    const startOfMonth = props.StartOfMonth ? moment(props.StartOfMonth).startOf('day') : undefined;
    const endOfMonth = props.EndOfMonth ? moment(props.EndOfMonth).endOf('day') : undefined;
    const events = props.Events;
    const notes = props.Notes;

    const dispatch = useDispatch();
    const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);

    const previousMonth = () => {
        const reportSelection = { ...currentReportSelection };
        if (!reportSelection || !reportSelection.periodStart) {
            return;
        }
        const pMonth = moment.unix(reportSelection.periodStart).subtract(1, 'month').startOf('day').unix();
        const dateRange = getSelectedAdminEventDateRange(pMonth, EventTabView.Month);
        dispatch(setIsLoading(true));
        dispatch(setAdminDateRange(dateRange));
    };

    const nextMonth = () => {
        const reportSelection = { ...currentReportSelection };
        if (!reportSelection || !reportSelection.periodStart) {
            return;
        }
        const nxtMonth = moment.unix(reportSelection.periodStart).add(1, 'month').startOf('day').unix();
        const dateRange = getSelectedAdminEventDateRange(nxtMonth, EventTabView.Month);
        dispatch(setIsLoading(true));
        dispatch(setAdminDateRange(dateRange));
    };


    const monthDayRows: ReactElement[] = [];
    let monthDays: ReactElement[] = [];
    if (startOfMonth && endOfMonth) {
        let displayDate = startOfMonth.startOf('week').startOf("day");
        let i = 1;
        while (displayDate.valueOf() <= endOfMonth.valueOf()) {
            let filteredEvents: VipEvent[] = [];
            let filteredNotes: Note[] = [];
            
            const currentDate = displayDate;
            if (events && events.length > 0) {
                filteredEvents = events.filter(x => moment(x.eventDate).valueOf() >= currentDate.startOf('day').valueOf() && moment(x.eventDate).valueOf() <= currentDate.endOf('day').valueOf());
            }
            if (notes && notes.length > 0) {
                filteredNotes = notes.filter(x => moment(x.noteTimestamp).valueOf() >= currentDate.startOf('day').valueOf() && moment(x.noteTimestamp).valueOf() <= currentDate.endOf('day').valueOf())
            }        

            monthDays.push(<MonthDay key={i} 
                MonthDayNumber={i}
                WeekDayNumber={parseInt(displayDate.format('d'))}
                MonthDate={displayDate.format('MM/DD/YYYY')}
                Events={filteredEvents}
                Notes={filteredNotes} />);        
                
            if (parseInt(displayDate.format('d')) === 6) {
                monthDayRows.push(<MonthWeek WeekDays={monthDays} />);
                monthDays = [];
            }

            i += 1;
            displayDate = displayDate.add(1, 'day');
        }
        if (monthDays.length > 0) {
            monthDayRows.push(<MonthWeek WeekDays={monthDays} />);
        }        
    }

    const monthName = currentReportSelection.periodStart ? `${moment.unix(currentReportSelection.periodStart).format('MMMM YYYY')}` : '';

    return (
        <Col className="month-view">
            <Row className="month-view-action">
                <Col className="month-view-action-previous"><a href="#" onClick={previousMonth}><FaArrowLeft />Previous Month</a></Col>
                <Col className="month-view-month-name" id="month-view-name">{monthName}</Col>
                <Col className="month-view-action-next"><a href="#" onClick={nextMonth}>Next Month<FaArrowRight /></a></Col>
            </Row>
            <Row>
                <Col>
                    {monthDayRows}
                </Col>
            </Row>    
            <Row>
                <Col>
                    <EventDataExpanded FocusControl="month-view-name" />
                </Col>
            </Row>        
        </Col>
    )
}
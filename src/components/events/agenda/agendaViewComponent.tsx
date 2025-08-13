"use client";

import { Col, Row } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Note, VipEvent } from "@/types/event";
import { useDispatch, useSelector } from "react-redux";
import AgendaDay from "./agendaDayComponent";
import { AgendaViewProps } from "@/types/props";
import { EventTabView } from "@/types/user";
import { ReactElement } from "react";
import { RootState } from "@/lib/store";
import getSelectedAdminEventDateRange from "@/utils/getSelectedAdminEventDateRange";
import moment from "moment";
import { setAdminDateRange } from "@/lib/adminEventsSelectionSlice";
import { setIsLoading } from "@/lib/globalSelectionSlice";

export default function AgendaView(props: AgendaViewProps) {
    const startOfMonth = props.StartOfMonth ? moment(props.StartOfMonth).startOf('day') : undefined;
    const endOfMonth = props.EndOfMonth ? moment(props.EndOfMonth).endOf('day') : undefined;
    const events = props.Events;
    const notes = props.Notes;

    const dispatch = useDispatch();
    const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);

    const previousMonth = () => {
        const reportSelection = { ...currentReportSelection };
        if (!reportSelection || !reportSelection.start) {
            return;
        }
        const prevMonth = moment.unix(reportSelection.start).subtract(1, 'month').startOf('day').unix();
        const dateRange = getSelectedAdminEventDateRange(prevMonth, EventTabView.Agenda);
        dispatch(setIsLoading(true));
        dispatch(setAdminDateRange(dateRange));
    };

    const nextMonth = () => {
        const reportSelection = { ...currentReportSelection };
        if (!reportSelection || !reportSelection.start) {
            return;
        }
        const nxtMonth = moment.unix(reportSelection.start).add(1, 'month').startOf('day').unix();
        const dateRange = getSelectedAdminEventDateRange(nxtMonth, EventTabView.Agenda);
        dispatch(setIsLoading(true));
        dispatch(setAdminDateRange(dateRange));
    };

    const agendaDays: ReactElement[] = [];
    if (startOfMonth && endOfMonth && events && events.length > 0) {
        let dDate = moment(startOfMonth);
        let i = 1;
        while (dDate.valueOf() <= endOfMonth.valueOf()) {
            let filteredEvents: VipEvent[] = [];
            let filteredNotes: Note[] = [];
            const currentDate = dDate;
            if (events && events.length > 0) {
                filteredEvents = events.filter(x => moment(x.eventDate).valueOf() >= currentDate.startOf('day').valueOf() && moment(x.eventDate).valueOf() <= currentDate.endOf('day').valueOf());
            }
            if (notes && notes.length > 0) {
                filteredNotes = notes.filter(x => moment(x.noteTimestamp).valueOf() >= currentDate.startOf('day').valueOf() && moment(x.noteTimestamp).valueOf() <= currentDate.endOf('day').valueOf())
            }
            agendaDays.push(<AgendaDay key={i} AgendaDayNumber={i}
                AgendaDate={dDate.format('MM/DD/YYYY')}
                Events={filteredEvents}
                Notes={filteredNotes}
            />);
            i += 1;
            dDate = dDate.add(1, 'day');
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
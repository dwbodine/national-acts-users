'use client';

import moment from 'moment';
import { ReactElement } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'rsuite';

import { setAdminDateRange } from '@/lib/adminEventsSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { Note, VipEvent } from '@/types/event';
import { MonthViewProps } from '@/types/props';
import { EventTabView } from '@/types/user';
import getSelectedAdminEventDateRange from '@/utils/getSelectedAdminEventDateRange';

import EventDataExpanded from '../../common/eventDataExpandedComponent';
import MonthDay from './monthDayComponent';
import MonthWeek from './monthWeekComponent';

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
    const pMonth = moment
      .unix(reportSelection.periodStart)
      .subtract(1, 'month')
      .startOf('day')
      .unix();
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
    let displayDate = startOfMonth.startOf('week').startOf('day');
    let i = 1;
    while (displayDate.valueOf() <= endOfMonth.valueOf()) {
      let filteredEvents: VipEvent[] = [];
      let filteredNotes: Note[] = [];

      const currentDate = displayDate;
      if (events && events.length > 0) {
        filteredEvents = events.filter(
          (x) =>
            moment(x.eventDate).valueOf() >= currentDate.startOf('day').valueOf() &&
            moment(x.eventDate).valueOf() <= currentDate.endOf('day').valueOf(),
        );
      }
      if (notes && notes.length > 0) {
        filteredNotes = notes.filter(
          (x) =>
            moment(x.noteTimestamp).valueOf() >= currentDate.startOf('day').valueOf() &&
            moment(x.noteTimestamp).valueOf() <= currentDate.endOf('day').valueOf(),
        );
      }

      monthDays.push(
        <MonthDay
          key={i}
          MonthDayNumber={i}
          WeekDayNumber={parseInt(displayDate.format('d'))}
          MonthDate={displayDate.format('YYYY-MM-DD')}
          Events={filteredEvents}
          Notes={filteredNotes}
        />,
      );

      if (parseInt(displayDate.format('d')) === 6) {
        monthDayRows.push(<MonthWeek key={`monthWeek_${i}`} WeekDays={monthDays} />);
        monthDays = [];
      }

      i += 1;
      displayDate = displayDate.add(1, 'day');
    }
    if (monthDays.length > 0) {
      monthDayRows.push(<MonthWeek WeekDays={monthDays} />);
    }
  }

  const monthName = currentReportSelection.periodStart
    ? `${moment.unix(currentReportSelection.periodStart).format('MMMM YYYY')}`
    : '';

  return (
    <Col xs={24} className="month-view">
      <Row className="month-view-action">
        <Col className="month-view-action-previous">
          <a href="#" onClick={previousMonth}>
            <FaArrowLeft />
            Previous Month
          </a>
        </Col>
        <Col className="month-view-month-name" id="month-view-name">
          {monthName}
        </Col>
        <Col className="month-view-action-next">
          <a href="#" onClick={nextMonth}>
            Next Month
            <FaArrowRight />
          </a>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>{monthDayRows}</Col>
      </Row>
      <Row>
        <Col xs={24}>
          <EventDataExpanded FocusControl="month-view-name" />
        </Col>
      </Row>
    </Col>
  );
}

'use client';

import { Col, Row } from 'rsuite';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Note, VipEvent } from '@/types/event';
import { useDispatch, useSelector } from 'react-redux';
import { EventTabView } from '@/types/user';
import { ReactElement } from 'react';
import { RootState } from '@/lib/store';
import WeekDay from './weekDayComponent';
import { WeekViewProps } from '@/types/props';
import getSelectedAdminEventDateRange from '@/utils/getSelectedAdminEventDateRange';
import moment from 'moment';
import { setAdminDateRange } from '@/lib/adminEventsSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';

export default function WeekView(props: WeekViewProps) {
  const startOfWeek = props.StartOfWeek;
  const events = props.Events;
  const notes = props.Notes;

  const dispatch = useDispatch();
  const currentReportSelection = useSelector(
    (state: RootState) => state.eventAdminSelection,
  );

  const previousWeek = () => {
    const reportSelection = { ...currentReportSelection };
    if (!reportSelection || !reportSelection.start) {
      return;
    }
    const previousMonday = moment
      .unix(reportSelection.start)
      .subtract(7, 'days')
      .startOf('day')
      .unix();
    const dateRange = getSelectedAdminEventDateRange(previousMonday, EventTabView.Week);
    dispatch(setIsLoading(true));
    dispatch(setAdminDateRange(dateRange));
  };

  const nextWeek = () => {
    const reportSelection = { ...currentReportSelection };
    if (!reportSelection || !reportSelection.start) {
      return;
    }
    const nextMonday = moment
      .unix(reportSelection.start)
      .add(7, 'days')
      .startOf('day')
      .unix();
    const dateRange = getSelectedAdminEventDateRange(nextMonday, EventTabView.Week);
    dispatch(setIsLoading(true));
    dispatch(setAdminDateRange(dateRange));
  };

  const weekdays: ReactElement[] = [];
  if (startOfWeek) {
    let displayDate = moment(startOfWeek);
    for (let i = 0; i < 7; i += 1) {
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
      weekdays.push(
        <WeekDay
          key={i}
          WeekDayNumber={i}
          WeekDate={displayDate.format('YYYY-MM-DD')}
          Events={filteredEvents}
          Notes={filteredNotes}
        />,
      );
      displayDate = displayDate.add(1, 'day');
    }
  }

  const weekName = `Week starting ${moment(startOfWeek).format('MM/DD/YYYY')}`;

  return (
    <Col className="week-view">
      <Row className="week-view-action">
        <Col className="week-view-action-previous">
          <a href="#" onClick={previousWeek}>
            <FaArrowLeft />
            Previous Week
          </a>
        </Col>
        <Col className="week-view-week-name" id="week-view-name">
          {weekName}
        </Col>
        <Col className="week-view-action-next">
          <a href="#" onClick={nextWeek}>
            Next Week
            <FaArrowRight />
          </a>
        </Col>
      </Row>
      <Row className="week-view-calendar">{weekdays}</Row>
    </Col>
  );
}

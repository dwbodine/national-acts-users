import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../src/lib/store';
import { setAdminEvents, setReloadAdminEvents, setAdminNotes, setActiveEventTab, setAdminDateRange } from '@/lib/adminEventsSelectionSlice';
import { useEffect, useState } from 'react';
import router from 'next/router';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { useGetAllEvents } from '@/hooks/event/useGetAllEvents';
import { useGetCalendarNotes } from '@/hooks/event/useGetCalendarNotes';
import AllEventsWeek from './week/allEventsWeekComponent';
import { toast } from 'react-toastify';
import { Button, ButtonGroup } from 'rsuite';
import AllEventsAgenda from './agenda/allEventsAgendaComponent';
import AllEventsMonth from './month/allEventsMonthComponent';
import { Col, Row } from 'react-bootstrap';
import { EventTabView } from '@/types/user';
import moment from 'moment';
import getSelectedAdminEventDateRange from '@/utils/getSelectedAdminEventDateRange';
import { Note } from '@/types/event';
import { EVENTS_AGENDA_VIEW_BREAKPOINT } from '@/constants';

export default function AllEvents() {
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const isLoading = globalSelection.isLoading;
  const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);
  const { getAllEvents } = useGetAllEvents();
  const { getCalendarNotes } = useGetCalendarNotes();
  const dispatch = useDispatch();
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);
  const agendaOnly = windowSize.width < EVENTS_AGENDA_VIEW_BREAKPOINT;

  const allEventsViews: EventTabView[] = [EventTabView.Week, EventTabView.Month, EventTabView.Agenda];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!currentReportSelection.eventTabView) {
        const defaultTabView = agendaOnly ? EventTabView.Agenda : EventTabView.Week;
        dispatch(
          setActiveEventTab(defaultTabView)
        );
        const dateRange = getSelectedAdminEventDateRange(moment().unix(), defaultTabView);
        dispatch(
          setAdminDateRange(dateRange)
        );
      } else if (agendaOnly && currentReportSelection.eventTabView != EventTabView.Agenda) {
        dispatch(
          setActiveEventTab(EventTabView.Agenda)
        );
        const dateRange = getSelectedAdminEventDateRange(moment().unix(), EventTabView.Agenda);
        dispatch(
          setAdminDateRange(dateRange)
        );
      } else if (currentReportSelection &&
        currentReportSelection.reloadEvents &&
        currentReportSelection.start && 
        currentReportSelection.end) {
        dispatch(setReloadAdminEvents(false));
        dispatch(setAdminEvents(undefined));
        dispatch(setAdminNotes(undefined));
        dispatch(setIsLoading(true));
        getAllEvents(currentReportSelection.start, currentReportSelection.end).then((response) => {
          if (!response.eventError && response.events) {
            const filteredEvents = response.events.filter(x => !x.isDeleted && (x.isActive || x.isHidden || x.isCancelled));
            if (currentReportSelection.start && currentReportSelection.end) {
              getCalendarNotes(currentReportSelection.start, currentReportSelection.end)
                .then((resp) => {
                  if (!resp.noteError) {
                    dispatch(setAdminEvents(filteredEvents));
                    const notes: Note[] = resp.notes ? resp.notes : [];
                    dispatch(
                      setAdminNotes(notes)
                    );
                  } else {
                    dispatch(setAdminEvents(filteredEvents));
                    dispatch(setAdminNotes([]));
                  }
                });
            } else {
              dispatch(setAdminEvents(filteredEvents));
              dispatch(setAdminNotes([]));
            }
          } else if (response.statusCode == 401 || response.statusCode == 422) {
            dispatch(setIsLoading(false));
            router.push('/logout/');
          } else {
            dispatch(setIsLoading(false));
            dispatch(setAdminEvents(undefined));
            dispatch(setAdminNotes(undefined));
            toast.error(response.eventError);
          }

        });
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    currentReportSelection,
    dispatch,
    getAllEvents,
    windowSizeJson,
    isLoading,
    getCalendarNotes,
    agendaOnly
  ]);

  const switchView = (key: EventTabView) => {
    if (key != currentReportSelection.eventTabView) {
      dispatch(
        setIsLoading(true)
      );
      dispatch(
        setActiveEventTab(key)
      );
      const dateRange = getSelectedAdminEventDateRange(moment().unix(), key);
      dispatch(
        setAdminDateRange(dateRange)
      );
    }
  };

  const getTabViewText = (key: EventTabView) => {
    let text = '';
    switch (key) {
      case EventTabView.Month:
        text = "Month";
        break;
      case EventTabView.Agenda:
        text = "Agenda";
        break;
      default:
        text = "Week";
        break;
    }
    return text;
  };

  let activeComponent: any = undefined;
  switch (currentReportSelection.eventTabView) {
    case EventTabView.Month:
      activeComponent = <AllEventsMonth />;
      break;
    case EventTabView.Agenda:
      activeComponent = <AllEventsAgenda />;
      break;
    default:
      activeComponent = <AllEventsWeek />;
      break;
  }

  return (
    <>
      <Row>
        <Col className="all-events-buttons">
          <ButtonGroup hidden={agendaOnly}>
            {allEventsViews.map(key => (
              <Button key={key} active={key.valueOf() == currentReportSelection.eventTabView?.valueOf()} onClick={() => switchView(key)}>
                {getTabViewText(key)}
              </Button>
            ))}
          </ButtonGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          {agendaOnly ? <AllEventsAgenda /> : activeComponent}
        </Col>
      </Row>
    </>
  );
}

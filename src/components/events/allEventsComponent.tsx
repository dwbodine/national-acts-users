'use client';

import { Button, ButtonGroup, Col, Row } from 'rsuite';
import { DEFAULT_EVENT_TAB_VIEW, EVENTS_AGENDA_VIEW_BREAKPOINT } from '@/constants';
import { GetEventsResponse, GetNotesResponse } from '@/types/responses';
import { ReactElement, useEffect } from 'react';
import {
  setActiveEventTab,
  setAdminDateRange,
  setAdminEvents,
  setAdminNotes,
  setExpandedEvent,
  setReloadAdminEvents,
} from '@/lib/adminEventsSelectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import AllEventsAgenda from './agenda/allEventsAgendaComponent';
import AllEventsMonth from './month/allEventsMonthComponent';
import AllEventsWeek from './week/allEventsWeekComponent';
import { EventTabView } from '@/types/user';
import { Note } from '@/types/event';
import type { RootState } from '../../lib/store';
import getSelectedAdminEventDateRange from '@/utils/getSelectedAdminEventDateRange';
import moment from 'moment';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';
import { useGetAllEvents } from '@/hooks/event/useGetAllEvents';
import { useGetCalendarNotes } from '@/hooks/event/useGetCalendarNotes';
import { useRouter } from 'next/navigation';
import { useWindowSize } from '@/hooks/common/useWindowSize';

export default function AllEvents() {
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const { isLoading } = globalSelection;
  const currentReportSelection = useSelector(
    (state: RootState) => state.eventAdminSelection,
  );
  const { getAllEvents } = useGetAllEvents();
  const { getCalendarNotes } = useGetCalendarNotes();
  const dispatch = useDispatch();
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);
  const agendaOnly = windowSize.width < EVENTS_AGENDA_VIEW_BREAKPOINT;
  const router = useRouter();

  const allEventsViews: EventTabView[] = [
    EventTabView.Week,
    EventTabView.Month,
    EventTabView.Agenda,
  ];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!currentReportSelection.eventTabView) {
        const defaultTabView = agendaOnly ? EventTabView.Agenda : DEFAULT_EVENT_TAB_VIEW;
        dispatch(setActiveEventTab(defaultTabView));
        const dateRange = getSelectedAdminEventDateRange(moment().unix(), defaultTabView);
        dispatch(setAdminDateRange(dateRange));
      } else if (
        agendaOnly &&
        currentReportSelection.eventTabView !== EventTabView.Agenda
      ) {
        dispatch(setActiveEventTab(EventTabView.Agenda));
        const dateRange = getSelectedAdminEventDateRange(
          moment().unix(),
          EventTabView.Agenda,
        );
        dispatch(setAdminDateRange(dateRange));
      } else if (
        currentReportSelection &&
        currentReportSelection.reloadEvents &&
        currentReportSelection.start &&
        currentReportSelection.end
      ) {
        dispatch(setReloadAdminEvents(false));
        dispatch(setAdminEvents(undefined));
        dispatch(setAdminNotes(undefined));
        dispatch(setIsLoading(true));
        void getAllEvents(currentReportSelection.start, currentReportSelection.end).then(
          (response: GetEventsResponse) => {
            if (!response.error && response.events) {
              const filteredEvents = response.events.filter(
                (x) => !x.isDeleted && (x.isActive || x.isHidden || x.isCancelled),
              );
              if (currentReportSelection.expandedEvent !== undefined) {
                const updatedEvent = filteredEvents.find(
                  (x) =>
                    x.externalEventId ===
                    currentReportSelection.expandedEvent?.externalEventId,
                );
                if (updatedEvent) {
                  dispatch(setExpandedEvent(updatedEvent));
                }
              }
              if (currentReportSelection.start && currentReportSelection.end) {
                void getCalendarNotes(
                  currentReportSelection.start,
                  currentReportSelection.end,
                ).then((resp: GetNotesResponse) => {
                  if (resp.error) {
                    dispatch(setAdminEvents(filteredEvents));
                    dispatch(setAdminNotes([]));
                  } else {
                    dispatch(setAdminEvents(filteredEvents));
                    const notes: Note[] = resp.notes ? resp.notes : [];
                    dispatch(setAdminNotes(notes));
                  }
                });
              } else {
                dispatch(setAdminEvents(filteredEvents));
                dispatch(setAdminNotes([]));
              }
            } else if (response.statusCode === 401 || response.statusCode === 422) {
              dispatch(setIsLoading(false));
              router.push('/logout');
            } else {
              dispatch(setIsLoading(false));
              dispatch(setAdminEvents(undefined));
              dispatch(setAdminNotes(undefined));
              toast.error(response.error);
            }
          },
        );
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
    agendaOnly,
    router,
  ]);

  const switchView = (key: EventTabView) => {
    if (key !== currentReportSelection.eventTabView) {
      dispatch(setIsLoading(true));
      dispatch(setActiveEventTab(key));
      const dateRange = getSelectedAdminEventDateRange(moment().unix(), key);
      dispatch(setAdminDateRange(dateRange));
    }
  };

  const getTabViewText = (key: EventTabView) => {
    switch (key) {
      case EventTabView.Month:
        return 'Month';
        break;
      case EventTabView.Agenda:
        return 'Agenda';
        break;
      default:
        return 'Week';
        break;
    }
  };

  let activeComponent: ReactElement = <AllEventsWeek />;
  switch (currentReportSelection.eventTabView) {
    case EventTabView.Month:
      activeComponent = <AllEventsMonth />;
      break;
    case EventTabView.Agenda:
      activeComponent = <AllEventsAgenda />;
      break;
    default:
      break;
  }

  return (
    <>
      <Row>
        <Col className="all-events-buttons">
          <ButtonGroup hidden={agendaOnly}>
            {allEventsViews.map((key) => (
              <Button
                key={key}
                active={key.valueOf() === currentReportSelection.eventTabView?.valueOf()}
                onClick={() => switchView(key)}
              >
                {getTabViewText(key)}
              </Button>
            ))}
          </ButtonGroup>
        </Col>
      </Row>
      <Row>
        <Col>{agendaOnly ? <AllEventsAgenda /> : activeComponent}</Col>
      </Row>
    </>
  );
}

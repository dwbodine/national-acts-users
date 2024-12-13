import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../src/lib/store';
import { setAdminEvents, setReloadAdminEvents, setAdminNotes } from '@/lib/adminEventsSelectionSlice';
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

export default function AllEvents() {
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const isLoading = globalSelection.isLoading;
  const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);
  const { getAllEvents } = useGetAllEvents();
  const { getCalendarNotes } = useGetCalendarNotes();
  const dispatch = useDispatch();
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);

  const allEventsViews: string[] = ['Week', 'Agenda']; // ['Week', 'Month', 'Agenda'];
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentReportSelection && currentReportSelection.reloadEvents &&
        currentReportSelection.start && currentReportSelection.end) {
        if (!activeKey && !windowSize.isMobile) {
          setActiveKey('Week');
        }
        dispatch(setReloadAdminEvents(false));
        dispatch(setAdminEvents(undefined));
        dispatch(setIsLoading(true));
        getAllEvents(currentReportSelection.start, currentReportSelection.end).then((response) => {
          if (!response.eventError && response.events) {
            const filteredEvents = response.events.filter(x => !x.isDeleted && (x.isActive || x.isHidden || x.isCancelled));
            if (currentReportSelection.start && currentReportSelection.end) {
              getCalendarNotes(currentReportSelection.start, currentReportSelection.end)
                .then((resp) => {
                  dispatch(setAdminEvents(filteredEvents));
                  if (!resp.noteError) {
                    dispatch(
                      setAdminNotes(resp.notes)
                    );
                  };
                });
            } else {
              dispatch(setAdminEvents(filteredEvents));
            }
          } else if (response.statusCode == 401 || response.statusCode == 422) {
            dispatch(setIsLoading(false));
            router.push('/logout/');
          } else {
            dispatch(setIsLoading(false));
            dispatch(setAdminEvents(undefined));
            toast.error(response.eventError);
          }

        });
      }
    }, 300);
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
    activeKey,
    windowSize.isMobile
  ]);

  const switchView = (key: string) => {
    if (key != activeKey) {
      dispatch(
        setIsLoading(true)
      );
      setActiveKey(key);
    }
  };

  let activeComponent: any = undefined;
  switch (activeKey) {
    case 'Month':
      activeComponent = <AllEventsMonth />;
      break;
    case 'Agenda':
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
          <ButtonGroup hidden={windowSize.isMobile}>
            {allEventsViews.map(key => (
              <Button key={key} active={key == activeKey} onClick={() => switchView(key)}>
                {key}
              </Button>
            ))}
          </ButtonGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          {windowSize.isMobile ? <AllEventsAgenda /> : activeComponent}
        </Col>
      </Row>
    </>
  );
}

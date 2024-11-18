import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../src/lib/store';
import { setAdminEvents, setAdminDateRange, setReloadAdminEvents } from '@/lib/adminEventsSelectionSlice';
import { ITicketData, VipEvent } from '@/types/event';
import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { EventReportSelection, User } from '@/types/user';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { CirclesWithBar } from 'react-loader-spinner';
import { getTicketDataFromEvents } from '@/utils/getTicketDataFromEvents';
import EventRow from '../common/eventRowComponent';
import router from 'next/router';
import WidgetBar from '../common/widgets/widgetBarComponent';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import EventMobileRow from '../common/eventMobileRowComponent';
import debouce from 'lodash.debounce';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { Container } from 'react-bootstrap';
import { useGetAllEvents } from '@/hooks/event/useGetAllEvents';

export default function AllEvents() {
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const isLoading = globalSelection.isLoading;
  const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);
  const { getAllEvents } = useGetAllEvents();
  const dispatch = useDispatch();

  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);
  const [searchTerm, setSearchTerm] = useState('');

  let ticketData: ITicketData | undefined = undefined;
  let vipEvents: VipEvent[] | undefined = currentReportSelection.currentEvents;
  let visibleEvents: VipEvent[] = [];
  let searchBarHidden = true;

  const debouncedResults = useMemo(() => {
    return debouce(setSearchTerm, 300);
  }, []);

  const getTicketData = (events: VipEvent[]): ITicketData | undefined => {
    if (!events || events.length == 0) {
      return undefined;
    }

    return getTicketDataFromEvents(events);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentReportSelection.reloadEvents) {
        dispatch(setReloadAdminEvents(false));
        dispatch(setIsLoading(true));
        getAllEvents(currentReportSelection?.start ?? 0, currentReportSelection?.end ?? 0).then((response) => {
          if (!response.eventError && response.events) {
            if (response.events.length > 0) {
              const start = moment(response.events[0].eventDate).unix();
              const end = moment(
                response.events[response.events.length - 1].eventDate,
              ).unix();
              const selection: EventReportSelection = {
                ...currentReportSelection,
                start: start,
                end: end,
              };

              dispatch(setAdminDateRange(selection));
            }
            dispatch(setAdminEvents(response.events));
          } else if (response.statusCode == 401 || response.statusCode == 422) {
            router.push('/logout/');
          } else {
            dispatch(setAdminEvents([]));
          }
          dispatch(setIsLoading(false));
        });
      }
    }, 300);    
    return () => {
      debouncedResults.cancel();
      clearTimeout(timeoutId);
    };
  }, [
    currentReportSelection,
    dispatch,
    getAllEvents,
    debouncedResults,
    windowSizeJson,
    isLoading
  ]);

  const filterEvents = (events: VipEvent[]) => {
    let filteredEvents: VipEvent[] = [];
    visibleEvents = [];

    if (events && events.length > 0) {
      visibleEvents = events.filter((evt) => {
        return (
          (currentReportSelection.showDeleted && evt.isDeleted) ||
          (currentReportSelection.showInactive && !evt.isActive && !evt.isDeleted) ||
          (currentReportSelection.showHidden && evt.isHidden) ||
          (!evt.isHidden &&
            !currentReportSelection.showDeleted &&
            !evt.isDeleted &&
            !currentReportSelection.showInactive &&
            evt.isActive)
        );
      });
    }

    if (visibleEvents.length > 0 && searchTerm && searchTerm.length >= 2) {
      const srch = searchTerm.toLowerCase();
      filteredEvents = visibleEvents.filter((evt) => {
        return (
          evt.title.toLowerCase().includes(srch) ||
          evt.venue?.name?.toLowerCase().includes(srch) ||
          evt.venue?.city?.toLowerCase().includes(srch) ||
          evt.venue?.state?.toLowerCase().includes(srch) ||
          evt.venue?.country?.toLowerCase().includes(srch)
        );
      });
    } else {
      filteredEvents = visibleEvents;
    }
    return filteredEvents;
  };

  const rows = [];
  let totalEvents = 0;
  let totalTickets = 0;
  let totalRevenue = 0.0;
  let totalOrders = 0;
  let ticketsRefunded = 0;
  let revenueRefunded = 0;
  let totalServiceFees = 0;
  let serviceFeesRefunded = 0;

  if (vipEvents && vipEvents.length > 0) {
    if (windowSize.isMobile || vipEvents.length > 10) {
      searchBarHidden = false;
    }
    const filteredEvents = filterEvents(vipEvents);

    totalEvents = filteredEvents.length;
    ticketData = getTicketData(filteredEvents);

    let i = 0;
    for (const evt of filteredEvents) {
      const key = `ev${i}`;
      if (windowSize.isMobile) {
        rows.push(
          <EventMobileRow
            key={key}
            VipEvent={evt}
            HideRevenue={false}
            HideServiceFees={false}
            CanCheckInTickets={false}
            ShowNotes={true}
          />,
        );
      } else {
        rows.push(
          <EventRow
            key={key}
            VipEvent={evt}
            HideRevenue={false}
            HideServiceFees={false}
            ShowNotes={true}
          />,
        );
      }

      if (!evt.isDeleted) {
        totalTickets += evt.totalTickets;
        revenueRefunded += evt.revenueRefunded ?? 0;
        totalRevenue += evt.totalRevenue - (evt.revenueRefunded ?? 0);
        ticketsRefunded += evt.numTicketsRefunded ?? 0;
        
        totalOrders += evt.orders?.filter(x => !x.isComped)?.length ?? 0;
        serviceFeesRefunded += evt.serviceFeeRevenueRefunded ?? 0;
        totalServiceFees += evt.totalServiceFees - (evt.serviceFeeRevenueRefunded ?? 0);        
      }
      i++;
    }
  }

  return (
    <>
      <Container fluid hidden={!isLoading}>
        <Row>
          <Col className="spinner-container">
            <CirclesWithBar height="100" width="100" color="#d12610" />
          </Col>
        </Row>
      </Container>
      <div hidden={isLoading}>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control search-text-input no-print"
          placeholder="Search for events..."
          hidden={searchBarHidden || !visibleEvents || visibleEvents.length == 0}
        />
        <WidgetBar
          TotalShows={totalEvents}
          TicketData={ticketData}
          TotalTickets={totalTickets}
          TotalRevenue={totalRevenue}
          HideRevenue={false}
          TicketsRefunded={ticketsRefunded}
          TotalServiceFees={totalServiceFees}
          HideServiceFees={false}
          RevenueRefunded={revenueRefunded}
          ServiceFeesRefunded={serviceFeesRefunded}
          HideTicketBreakDown={true}
        />
        <Row className="results-container">
          <Col className="results-col">
            {visibleEvents && visibleEvents.length > 0 ? (
              <table className="resultsTable">
                <thead hidden={windowSize.isMobile}>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Venue</th>
                    <th>Location</th>
                    <th>Tickets Sold</th>
                    <th>Revenue (USD)</th>
                    <th className="no-print">
                      Service Fees
                    </th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
                <tfoot hidden={windowSize.isMobile}>
                  <tr>
                    <td colSpan={4}>Total</td>
                    <td className="pull-right">{totalTickets}</td>
                    <td className="pull-right">
                      {totalRevenue.toFixed(2)}
                    </td>
                    <td className="pull-right">
                      {totalServiceFees.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              ''
            )}
            {(!visibleEvents || visibleEvents.length == 0)
             ? (
              <Col className="no-events">No events found</Col>
            ) : (
              ''
            )}
          </Col>
        </Row>
      </div>
    </>
  );
}

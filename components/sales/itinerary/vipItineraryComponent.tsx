import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../src/lib/store';
import { useGetEvents } from '@/hooks/event/useGetEvents';
import { setEvents, setDateRange, setReloadEvents, setTours } from '@/lib/reportSelectionSlice';
import { GetToursResponse, IShirtData, ITicketData, ITicketSalesData, VipEvent } from '@/types/event';
import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { EnumPermission, User, UserReportSelection } from '@/types/user';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { CirclesWithBar } from 'react-loader-spinner';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { getTicketDataFromEvents } from '@/utils/getTicketDataFromEvents';
import { getShirtDataFromEvents } from '@/utils/getShirtData';
import EventRow from '../../common/eventRowComponent';
import router from 'next/router';
import WidgetBar from '../../common/widgets/widgetBarComponent';
import TicketSalesChart from '../../common/ticketSalesChartComponent';
import { getPurchaseDataFromEvents } from '@/utils/getPurchaseData';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import EventMobileRow from '../../common/eventMobileRowComponent';
import { useHasPermission } from '@/hooks/user/useHasPermission';
import debouce from 'lodash.debounce';
import { FULL_PAGE_CHART_BREAKPOINT } from '@/constants';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { Container } from 'react-bootstrap';
import { useGetTours } from '@/hooks/admin/useGetTours';
import { VipItineraryProps } from '@/types/props';

export default function VipItinerary(props: VipItineraryProps) {
  const id = props.SellerId;
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
  const { getUser } = useCurrentUser();
  const [user, setUser] = useState<User | undefined>(undefined);
  const { userHasPermission } = useHasPermission();
  const { getEvents } = useGetEvents();
  const dispatch = useDispatch();
  
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);
  const [searchTerm, setSearchTerm] = useState('');
  

  const vipEvents: VipEvent[] | undefined = currentReportSelection.currentEvents;
  let visibleEvents: VipEvent[] = [];
  
  const debouncedResults = useMemo(() => {
    return debouce(setSearchTerm, 300);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      if (user == undefined) {
        const currentUser = getUser();
        if (currentUser != undefined) {
          setUser(currentUser);
        }
      } 
      
      if (!id || !user || user.userId <= 0 || !user.sellers || !currentReportSelection) {
        return;
      }


      else if (currentReportSelection.seller && currentReportSelection.seller.sellerId > 0) {
        if (currentReportSelection.reloadEvents) {
          dispatch(setReloadEvents(false));
          getEvents(currentReportSelection).then((response) => {
            if (!response.eventError) {
              if (response.events && response.events.length > 0) {
                dispatch(setEvents(response.events));
                const start = moment(response.events[0].eventDate).unix();
                const end = moment(
                  response.events[response.events.length - 1].eventDate,
                ).unix();
                const selection: UserReportSelection = {
                  ...currentReportSelection,
                  start: start,
                  end: end,
                };
                dispatch(setDateRange(selection));
              } else {
                dispatch(setEvents([]));
              }            
            
            } else if (response.statusCode == 401 || response.statusCode == 422) {
              router.push('/logout/');
            } else {
              dispatch(setEvents([]));
              dispatch(setIsLoading(false));
            }
          });
        }
      } else {
        dispatch(setIsLoading(false));
      }
      return () => {
        debouncedResults.cancel();
      };
    }
    fetchEvents();
  }, [
    currentReportSelection,
    dispatch,
    getEvents,
    user,
    debouncedResults,
    windowSizeJson,
    globalSelection.isLoading,
    getUser,
    userHasPermission,
  ]);

  const filterEvents = (events: VipEvent[]) => {
    let filteredEvents: VipEvent[] = [];
    visibleEvents = [];

    if (events && events.length > 0) {
      if (currentReportSelection.selectedTourId && currentReportSelection.selectedTourId > 0) {
        visibleEvents = events.filter((evt) => {
          return (
            (!evt.isDeleted)
          );
        });
      } else {
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
    }

    if (visibleEvents.length > 0 && searchTerm && searchTerm.length >= 2) {
      const srch = searchTerm.toLowerCase();
      filteredEvents = visibleEvents.filter((evt) => {
        return (
          evt.title.toLowerCase().includes(srch) ||
          evt.venue?.name?.toLowerCase().includes(srch) ||
          evt.venue?.city?.toLowerCase().includes(srch) ||
          evt.venue?.state?.toLowerCase().includes(srch) ||
          evt.venue?.country?.countryName?.toLowerCase().includes(srch)
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
  let totalTicketsComped = 0;
  let totalRevenue = 0.0;
  let totalShirts = 0;
  let ticketsRefunded = 0;
  let revenueRefunded = 0;
  let totalServiceFees = 0;
  let serviceFeesRefunded = 0;

  if (vipEvents && vipEvents.length > 0) {
    const filteredEvents = filterEvents(vipEvents);

    totalEvents = filteredEvents.length;

    let i = 0;
    for (const evt of filteredEvents) {
      const key = `ev${i}`;
      if (windowSize.isMobile) {
        rows.push(
          <EventMobileRow
            key={key}
            VipEvent={evt}
            IsAdmin={user?.isAdmin ?? false}
          />,
        );
      } else {
        rows.push(
          <EventRow
            key={key}
            VipEvent={evt}
          />,
        );
      }
      i++;
    }
  }

  return (
    <>
      <Container fluid hidden={!globalSelection.isLoading || !user || user.isAdmin}>
        <Row>
          <Col className="spinner-container">
            <CirclesWithBar height="100" width="100" color="#d12610" />
          </Col>
        </Row>
      </Container>
      <Container fluid hidden={globalSelection.isLoading}>
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
                    <th>Event Status</th>
                    <th>Tickets Sold</th>
                    <th>Tickets Refunded</th>
                    <th>Tickets Comped</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </table>
            ) : (
              ''
            )}
            {(!visibleEvents || visibleEvents.length == 0) &&
            currentReportSelection.seller.sellerId > 0 ? (
              <Col className="no-events">No events found</Col>
            ) : (
              ''
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

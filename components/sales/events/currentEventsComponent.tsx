import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../src/lib/store';
import { useGetEvents } from '@/hooks/event/useGetEvents';
import { setEvents, setDateRange, setReloadEvents, setTours, setSelectedTourId } from '@/lib/reportSelectionSlice';
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

export default function CurrentEvents() {
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
  const { getUser } = useCurrentUser();
  const [user, setUser] = useState<User | undefined>(undefined);
  const { userHasPermission } = useHasPermission();
  const { getEvents } = useGetEvents();
  const dispatch = useDispatch();
  const { getTours } = useGetTours();

  const [chartsHidden, setChartsHidden] = useState(true);
  const [hideRevItem, setHideRevItem] = useState(true);
  const [hideServiceFees, setHideServiceFees] = useState(true);
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);
  const hideTicketChart = windowSize.width < FULL_PAGE_CHART_BREAKPOINT;
  const [searchTerm, setSearchTerm] = useState('');
  const [viewRevenueControls, setViewRevenueControls] = useState(false);
  const [viewRevenueData, setViewRevenueData] = useState(false);
  const [viewServiceFees, setViewServiceFees] = useState(false);
  const [canCheckInTickets, setCanCheckInTickets] = useState(false);
  const [alwaysShowRevenue, setAlwaysShowRevenue] = useState(false);

  let ticketData: ITicketData | undefined = undefined;
  let shirtData: IShirtData | undefined = undefined;
  let vipEvents: VipEvent[] | undefined = currentReportSelection.currentEvents;
  let visibleEvents: VipEvent[] = [];
  let ticketSalesData: ITicketSalesData[] | undefined = undefined;
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

  const getTicketSalesData = (events: VipEvent[]): ITicketSalesData[] | undefined => {
    if (!events || events.length == 0) {
      return undefined;
    }

    return getPurchaseDataFromEvents(events);
  };

  const getShirtData = (events: VipEvent[]): IShirtData | undefined => {
    if (!events || events.length == 0) {
      return undefined;
    }

    return getShirtDataFromEvents(events);
  };

  useEffect(() => {
    if (user == undefined) {
      const currentUser = getUser();
      if (currentUser != undefined) {
        setUser(currentUser);
      }
    } else {
      const vRevenueControls = userHasPermission(
        user,
        EnumPermission.ViewRevenueControls,
      );
      const vRevenueData = userHasPermission(user, EnumPermission.ViewRevenueData);
      setViewRevenueControls(vRevenueControls);
      setViewRevenueData(vRevenueData);
      setViewServiceFees(userHasPermission(user, EnumPermission.ViewServiceFees));
      setCanCheckInTickets(
        !user.disableCheckIn && userHasPermission(user, EnumPermission.CheckInUsers),
      );
      setAlwaysShowRevenue(vRevenueData && !vRevenueControls);
    }

    if (currentReportSelection.seller.sellerId > 0) {
      if (alwaysShowRevenue) {
        setHideRevItem(false);
      } else if (!viewRevenueData) {
        setHideRevItem(true);
      } else {
        setHideRevItem(currentReportSelection.hideRevenue ?? true);
      }

      if (viewServiceFees) {
        setHideServiceFees(currentReportSelection.hideServiceFees ?? true);
      } else {
        setHideServiceFees(true);
      }

      if (currentReportSelection.reloadEvents) {
        setChartsHidden(true);
        dispatch(setReloadEvents(false));
        getEvents(currentReportSelection).then((response) => {
          if (!response.eventError && response.events) {
            if (response.events.length > 0) {
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
              getTours(currentReportSelection.seller.sellerId)
                .then((tourResponse: GetToursResponse) => {
                    dispatch(setSelectedTourId(0));
                    if (!tourResponse.tourError && tourResponse.tours) {
                      dispatch(setTours(tourResponse.tours));
                    } else {
                      dispatch(setTours([]));
                    }
                    dispatch(setIsLoading(false));
                    setChartsHidden(false);
                });
              
            } else {
              dispatch(setEvents([]));
              dispatch(setIsLoading(false));
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
  }, [
    currentReportSelection,
    dispatch,
    getEvents,
    alwaysShowRevenue,
    viewRevenueData,
    viewServiceFees,
    user,
    debouncedResults,
    windowSizeJson,
    globalSelection.isLoading,
    getUser,
    userHasPermission,
    viewRevenueControls,
    getTours,
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

    if (visibleEvents.length > 0 && (currentReportSelection.selectedTourId ?? 0) > 0 && currentReportSelection.tours && currentReportSelection.tours.length > 0) {
      const tour = currentReportSelection.tours.find(x => x.tourId == currentReportSelection.selectedTourId);
      if (tour && tour.events && tour.events.length > 0) {
        const tourEventIds = tour.events.map((x) => { return x.ticketSocketEventId });
        visibleEvents = visibleEvents.filter((x) => {
          return tourEventIds.includes(x.ticketSocketEventId);
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
  let totalTicketsComped = 0;
  let totalRevenue = 0.0;
  let totalShirts = 0;
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
    shirtData = getShirtData(filteredEvents);
    ticketSalesData = getTicketSalesData(filteredEvents);

    let i = 0;
    for (const evt of filteredEvents) {
      const key = `ev${i}`;
      if (windowSize.isMobile) {
        rows.push(
          <EventMobileRow
            key={key}
            VipEvent={evt}
            HideRevenue={hideRevItem}
            HideServiceFees={hideServiceFees}
            CanCheckInTickets={canCheckInTickets}
          />,
        );
      } else {
        rows.push(
          <EventRow
            key={key}
            VipEvent={evt}
            HideRevenue={hideRevItem}
            HideServiceFees={hideServiceFees}
          />,
        );
      }

      if (!evt.isDeleted) {
        totalTickets += evt.totalTickets;
        totalTicketsComped += evt.numTicketsComped ?? 0;
        revenueRefunded += evt.revenueRefunded ?? 0;
        totalRevenue += evt.totalRevenue - (evt.revenueRefunded ?? 0);
        ticketsRefunded += evt.numTicketsRefunded ?? 0;
        
        totalOrders += evt.orders?.filter(x => !x.isComped)?.length ?? 0;
        totalShirts += evt.totalShirts;
        serviceFeesRefunded += evt.serviceFeeRevenueRefunded ?? 0;
        totalServiceFees += evt.totalServiceFees - (evt.serviceFeeRevenueRefunded ?? 0);        
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
      <div hidden={globalSelection.isLoading}>
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
          TotalTickets={totalTickets + totalTicketsComped}
          ShirtData={shirtData}
          TotalShirts={totalShirts}
          TotalRevenue={totalRevenue}
          HideRevenue={hideRevItem}
          TicketsRefunded={ticketsRefunded}
          TotalServiceFees={totalServiceFees}
          HideServiceFees={hideServiceFees}
          RevenueRefunded={revenueRefunded}
          ServiceFeesRefunded={serviceFeesRefunded}
        />
        <TicketSalesChart
          TicketSalesData={ticketSalesData}
          ChartsHidden={chartsHidden}
          HideRevenue={hideRevItem}
          HideMobile={hideTicketChart}
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
                    <th>Event Status</th>
                    <th>Tickets Sold</th>
                    <th>Tickets Comped</th>
                    <th hidden={hideRevItem}>Revenue (USD)</th>
                    <th className="no-print" hidden={hideServiceFees}>
                      Service Fees
                    </th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
                <tfoot hidden={windowSize.isMobile}>
                  <tr>
                    <td colSpan={5}>Total</td>
                    <td className="pull-right">{totalTickets}</td>
                    <td className="pull-right">{totalTicketsComped}</td>
                    <td className="pull-right" hidden={hideRevItem}>
                      {totalRevenue.toFixed(2)}
                    </td>
                    <td className="pull-right" hidden={hideServiceFees}>
                      {totalServiceFees.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
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
      </div>
    </>
  );
}

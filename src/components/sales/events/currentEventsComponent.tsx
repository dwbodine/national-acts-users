'use client';

import { Col, Row } from 'rsuite';
import { EnumPermission, User, UserReportSelection } from '@/types/user';
import { GetEventsResponse, GetToursResponse } from '@/types/responses';
import { IShirtData, ITicketData, ITicketSalesData, VipEvent } from '@/types/event';
import {
  setDateRange,
  setEvents,
  setReloadEvents,
  setTours,
} from '@/lib/reportSelectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import EventMobileRow from '../../common/eventMobileRowComponent';
import EventRow from '../../common/eventRowComponent';
import { FULL_PAGE_CHART_BREAKPOINT } from '@/constants';
import { RingLoader } from 'react-spinners';
import type { RootState } from '../../../lib/store';
import TicketSalesChart from '../../common/ticketSalesChartComponent';
import WidgetBar from '../../common/widgets/widgetBarComponent';
import debouce from 'lodash.debounce';
import getPurchaseDataFromEvents from '@/utils/getPurchaseData';
import getShirtDataFromEvents from '@/utils/getShirtData';
import getTicketDataFromEvents from '@/utils/getTicketDataFromEvents';
import moment from 'moment';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useGetEvents } from '@/hooks/event/useGetEvents';
import { useGetTours } from '@/hooks/admin/useGetTours';
import { useHasPermission } from '@/hooks/user/useHasPermission';
import { useRouter } from 'next/navigation';
import { useWindowSize } from '@/hooks/common/useWindowSize';

export default function CurrentEvents() {
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
  const { getUser } = useCurrentUser();
  const [user, setUser] = useState<User | undefined>(undefined);
  const { userHasPermission } = useHasPermission();
  const { getEvents } = useGetEvents();
  const dispatch = useDispatch();
  const { getTours } = useGetTours();
  const router = useRouter();

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
  const vipEvents: VipEvent[] | undefined = currentReportSelection.currentEvents;
  let visibleEvents: VipEvent[] = [];
  let ticketSalesData: ITicketSalesData[] | undefined = undefined;
  let searchBarHidden = true;

  const debouncedResults = useMemo(() => debouce(setSearchTerm, 300), []);

  const getTicketData = (events: VipEvent[]): ITicketData | undefined => {
    if (!events || events.length === 0) {
      return undefined;
    }

    return getTicketDataFromEvents(events);
  };

  const getTicketSalesData = (events: VipEvent[]): ITicketSalesData[] | undefined => {
    if (!events || events.length === 0) {
      return undefined;
    }

    return getPurchaseDataFromEvents(events);
  };

  const getShirtData = (events: VipEvent[]): IShirtData | undefined => {
    if (!events || events.length === 0) {
      return undefined;
    }

    return getShirtDataFromEvents(events);
  };

  useEffect(() => {
    if (user === undefined) {
      const currentUser = getUser();
      if (currentUser !== undefined) {
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
      } else if (viewRevenueData === false) {
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
        void getEvents(currentReportSelection).then((response: GetEventsResponse) => {
          if (!response.error) {
            if (response.events && response.events.length > 0) {
              dispatch(setEvents(response.events));
              const firstEvent = response.events[0];
              const lastEvent = response.events[response.events.length - 1];
              if (firstEvent && lastEvent) {
                const start = moment(firstEvent.eventDate).unix();
                const end = moment(lastEvent.eventDate).unix();
                const selection: UserReportSelection = {
                  ...currentReportSelection,
                  end,
                  start,
                };
                dispatch(setDateRange(selection));
              }
            } else {
              dispatch(setEvents([]));
            }
            if (currentReportSelection.reloadTours) {
              void getTours(currentReportSelection.seller.sellerId).then(
                (tourResponse: GetToursResponse) => {
                  if (!tourResponse.error && tourResponse.tours) {
                    dispatch(setTours(tourResponse.tours));
                  } else {
                    dispatch(setTours(undefined));
                  }
                  dispatch(setIsLoading(false));
                  setChartsHidden(false);
                },
              );
            } else {
              dispatch(setIsLoading(false));
              setChartsHidden(false);
            }
          } else if (response.statusCode === 401 || response.statusCode === 422) {
            router.push('/logout');
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
    router,
  ]);

  const filterEvents = (events: VipEvent[]) => {
    visibleEvents = [];
    if (events && events.length > 0) {
      if (
        currentReportSelection.selectedTourId &&
        currentReportSelection.selectedTourId > 0
      ) {
        visibleEvents = events.filter((evt) => !evt.isDeleted);
      } else {
        visibleEvents = events.filter(
          (evt) =>
            (currentReportSelection.showDeleted && evt.isDeleted) ||
            (currentReportSelection.showInactive && !evt.isActive && !evt.isDeleted) ||
            (currentReportSelection.showHidden && evt.isHidden) ||
            (!evt.isHidden &&
              !currentReportSelection.showDeleted &&
              !evt.isDeleted &&
              !currentReportSelection.showInactive &&
              evt.isActive),
        );
      }
    }

    let filteredEvents: VipEvent[] = visibleEvents ?? [];
    if (visibleEvents.length > 0 && searchTerm && searchTerm.length >= 2) {
      const srch = searchTerm.toLowerCase();
      filteredEvents = visibleEvents.filter(
        (evt) =>
          evt.title.toLowerCase().includes(srch) ||
          evt.venue?.name?.toLowerCase().includes(srch) ||
          evt.venue?.city?.toLowerCase().includes(srch) ||
          evt.venue?.state?.toLowerCase().includes(srch) ||
          evt.venue?.country?.countryName?.toLowerCase().includes(srch),
      );
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
            IsAdmin={user?.isAdmin ?? false}
          />,
        );
      } else {
        rows.push(
          <EventRow
            key={key}
            VipEvent={evt}
            HideRevenue={hideRevItem}
            HideServiceFees={hideServiceFees}
            IsAdmin={user?.isAdmin ?? false}
          />,
        );
      }

      if (!evt.isDeleted) {
        totalTickets += evt.totalTickets ?? 0;
        totalTicketsComped += evt.numTicketsComped ?? 0;
        revenueRefunded += evt.revenueRefundedUsd ?? 0;
        totalRevenue += (evt.totalRevenueUsd ?? 0) - (evt.revenueRefundedUsd ?? 0);
        ticketsRefunded += evt.numTicketsRefunded ?? 0;

        totalShirts += evt.totalShirts ?? 0;
        serviceFeesRefunded += evt.serviceFeeRevenueRefundedUsd ?? 0;
        totalServiceFees +=
          (evt.totalServiceFeesUsd ?? 0) - (evt.serviceFeeRevenueRefundedUsd ?? 0);
      }
      i += 1;
    }
  }

  const revClass = hideRevItem ? 'no-print' : '';

  return (
    <>
      <div className="fluid" hidden={!globalSelection.isLoading}>
        <Row>
          <Col className="spinner-container">
            <RingLoader size={150} color="#d12610" />
          </Col>
        </Row>
      </div>
      <div hidden={globalSelection.isLoading}>
        <input
          type="text"
          value={searchTerm ?? ''}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control search-text-input no-print"
          placeholder="Search for events..."
          hidden={searchBarHidden || !visibleEvents || visibleEvents.length === 0}
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
          IsAdmin={user?.isAdmin ?? false}
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
                    <th>Tickets Refunded</th>
                    <th>Tickets Comped</th>
                    <th className={revClass} hidden={hideRevItem}>
                      Revenue
                    </th>
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
                    <td className="pull-right">{ticketsRefunded}</td>
                    <td className="pull-right">{totalTicketsComped}</td>
                    <td className={`pull-right ${revClass}`} hidden={hideRevItem}>
                      ${totalRevenue.toFixed(2)}
                    </td>
                    <td className="pull-right no-print" hidden={hideServiceFees}>
                      ${totalServiceFees.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              ''
            )}
            {(!visibleEvents || visibleEvents.length === 0) &&
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

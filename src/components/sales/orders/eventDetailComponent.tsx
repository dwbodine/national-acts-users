'use client';

import debouce from 'lodash.debounce';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, Col, Container, Input, Radio, RadioGroup, Row } from 'rsuite';

import { useGetEventById } from '@/hooks/common/useGetEventById';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import { useGetUserSeller } from '@/hooks/order/useGetUserSeller';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useHasPermission } from '@/hooks/user/useHasPermission';
import {
  setEventSeller,
  setFocusControl,
  setHideOrderRevenue,
  setHideOrderServiceFees,
  setReloadEvents,
  setShowDeletedOrders,
  setShowInactiveOrders,
  setShowOnlyEmails,
  setShowOnlyPhones,
} from '@/lib/reportSelectionSlice';
import { RootState } from '@/lib/store';
import {
  IShirtData,
  IShirtSizeData,
  ITicketData,
  ITicketTypeData,
  Order,
  TicketType,
  VipEvent,
} from '@/types/event';
import { EditProps } from '@/types/props';
import { EnumPermission, User, UserReportSelection } from '@/types/user';
import { downloadCsvFile } from '@/utils/downloadFile';
import { exportEventCustomerDataToCsv, getPacificMoment } from '@/utils/eventUtils';
import getFileNameFromEvent from '@/utils/getFileNameFromEvent';
import getShirtDataFromOrders from '@/utils/getShirtDataFromOrders';
import getTicketDataFromOrders from '@/utils/getTicketDataFromOrders';
import setFocusToControl from '@/utils/setFocusToControl';

import PrintButton from '../../common/printButtonComponent';
import OrderMobileRow from './orderMobileRowComponent';
import OrderRow from './orderRowComponent';

// Optional (recommended): normalize event once after fetch (no later recompute in effects)
function normalizeEvent(evt: VipEvent): VipEvent {
  let computedOrders: Order[] = [];

  if (evt.orders?.length) {
    for (const order of evt.orders) {
      if (order.isComped && order.tickets) {
        for (const ticket of order.tickets) {
          if (ticket.ticketTypeId !== 0 || !evt.ticketSocketEventId) continue;

          computedOrders.push({
            currencyAbbrev: '',
            currencySymbol: '',
            email: ticket.attendeeEmail ?? '',
            eventId: 0,
            exchangeRate: 0,
            hasChargebacks: false,
            hasRefunds: false,
            isActive: true,
            isDeleted: false,
            numTickets: 1,
            orderId: 0,
            phone: ticket.attendeePhone,
            purchaseDate: order.purchaseDate,
            purchaseTimestamp: '',
            purchaserFirstName: ticket.attendeeFirstName ?? '',
            purchaserLastName: ticket.attendeeLastName ?? '',
            revenue: 0,
            revenueUsd: 0,
            ticketSocketEventId: evt.ticketSocketEventId,
            ticketSocketOrderId: order.ticketSocketOrderId,
            tickets: [ticket],
            totalShirts: order.totalShirts,
          });
        }
      } else {
        computedOrders.push(order);
      }
    }

    computedOrders = [...computedOrders].sort((a, b) =>
      a.purchaserLastName?.localeCompare(b.purchaserLastName) ||
      a.purchaserFirstName?.localeCompare(b.purchaserFirstName) ||
      (a.purchaseUnixTimestamp && b.purchaseUnixTimestamp
        ? moment.unix(b.purchaseUnixTimestamp).unix() - moment.unix(a.purchaseUnixTimestamp).unix()
        : 0) ||
      (a.purchaseTimestamp && b.purchaseTimestamp)
        ? moment(b.purchaseTimestamp).unix() - moment(a.purchaseTimestamp).unix()
        : 0,
    );
  }

  return { ...evt, orders: computedOrders };
}

export default function EventDetail(props: EditProps) {
  const id = props.Id;
  const router = useRouter();
  const dispatch = useDispatch();

  const reportSelection = useSelector((state: RootState) => state.reportSelection);
  const sellerId = reportSelection.seller?.sellerId ?? 0;

  const { getUser } = useCurrentUser();
  const { userHasPermission } = useHasPermission();
  const { getEventById } = useGetEventById();
  const { getUserSellerFromEventId } = useGetUserSeller();

  const windowSize = useWindowSize();

  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const [hideRevItem, setHideRevItem] = useState(true);
  const [hideServiceFeeDisplay, setHideServiceFeeDisplay] = useState(true);
  const [showOnlyEmailsDisplay, setShowOnlyEmailsDisplay] = useState(false);
  const [showOnlyPhonesDisplay, setShowOnlyPhonesDisplay] = useState(false);

  const [viewInactiveOrders, setViewInactiveOrders] = useState(false);
  const [viewDeletedOrders, setViewDeletedOrders] = useState(false);
  const [viewServiceFees, setViewServiceFees] = useState(false);
  const [viewRevenueData, setViewRevenueData] = useState(false);
  const [viewRevenueControls, setViewRevenueControls] = useState(false);
  const [canExportCustomerData, setCanExportCustomerData] = useState(false);
  const [viewPrintButton, setViewPrintButton] = useState(false);
  const [canCheckInTickets, setCanCheckInTickets] = useState(false);
  const [alwaysShowRevenue, setAlwaysShowRevenue] = useState(false);

  const [currentDetailEvent, setCurrentDetailEvent] = useState<VipEvent | undefined>(undefined);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'purchaseDate' | 'purchaserName' | 'ticketType'>(
    'purchaserName',
  );
  const debouncedResults = useMemo(() => debouce(setSearchTerm, 300), []);
  useEffect(() => () => debouncedResults.cancel(), [debouncedResults]);

  // Dedupe event fetches (prevents double-fetch in StrictMode/dev and redux-triggered reruns)
  const fetchedEventIdRef = useRef<string | number | null>(null);
  const ordersTableBodyRef = useRef<HTMLTableSectionElement | null>(null);
  const focusAnimationFrameRef = useRef<number | null>(null);

  // 1) Load user once
  useEffect(() => {
    const u = getUser();
    if (!u) return;

    setUser((prev) => {
      // prevent re-setting if it’s the same user
      if (prev?.userId === u.userId) return prev;
      return u;
    });
  }, [getUser]);

  // 2) Compute permission-driven UI flags when user changes
  useEffect(() => {
    if (!user) return;

    const vInactive = userHasPermission(user, EnumPermission.ViewInactiveEvents);
    const vDeleted = userHasPermission(user, EnumPermission.ViewDeletedEvents);
    const vFees = userHasPermission(user, EnumPermission.ViewServiceFees);
    const vRevControls = userHasPermission(user, EnumPermission.ViewRevenueControls);
    const vRevData = userHasPermission(user, EnumPermission.ViewRevenueData);

    setViewInactiveOrders(vInactive);
    setViewDeletedOrders(vDeleted);
    setViewServiceFees(vFees);
    setViewRevenueControls(vRevControls);
    setViewRevenueData(vRevData);

    setCanExportCustomerData(userHasPermission(user, EnumPermission.ExportCustomerData));
    setViewPrintButton(userHasPermission(user, EnumPermission.ViewPrintButton));
    setCanCheckInTickets(
      !user.disableCheckIn && userHasPermission(user, EnumPermission.CheckInUsers),
    );

    setAlwaysShowRevenue(vRevData && !vRevControls);
  }, [user, userHasPermission]);

  // 3) Ensure seller is loaded into redux before fetching event
  useEffect(() => {
    if (!user || !id) return;
    if (user.userId <= 0 || !user.sellers) return;

    if (sellerId > 0) return; // already have seller

    void (async () => {
      const next: UserReportSelection = { ...reportSelection };

      if ((sellerId ?? 0) > 0) {
        const seller = user.sellers?.find((x) => x.sellerId === sellerId);
        if (!seller) {
          router.push('/logout');
          return;
        }
        next.seller = seller;
        next.hideOrderRevenue = true;
        next.hideOrderServiceFees = true;
        dispatch(setEventSeller(next));
        return;
      }

      const sellerResult = await getUserSellerFromEventId(id, user.userId);
      if (sellerResult?.userSeller) {
        next.seller = sellerResult.userSeller;
        next.hideOrderRevenue = true;
        next.hideOrderServiceFees = true;
        dispatch(setEventSeller(next));
      } else {
        router.push('/logout');
      }
    })();
    // intentionally NOT depending on the full reportSelection object
  }, [user, id, sellerId, dispatch, getUserSellerFromEventId, router]);

  // 4) Sync UI toggles driven by redux selection + permissions
  useEffect(() => {
    if (!user) return;
    if (sellerId <= 0) return;

    // Revenue visibility
    if (alwaysShowRevenue) {
      setHideRevItem(false);
    } else if (viewRevenueData === false) {
      setHideRevItem(true);
    } else {
      setHideRevItem(reportSelection.hideOrderRevenue ?? true);
    }

    // Admin-only filters
    if (user.isAdmin) {
      setShowOnlyEmailsDisplay(reportSelection.showOnlyEmails ?? false);
      setShowOnlyPhonesDisplay(reportSelection.showOnlyPhones ?? false);
    } else {
      setShowOnlyEmailsDisplay(false);
      setShowOnlyPhonesDisplay(false);
    }

    // Service fees
    if (viewServiceFees) {
      setHideServiceFeeDisplay(reportSelection.hideOrderServiceFees ?? true);
    } else {
      setHideServiceFeeDisplay(true);
    }
  }, [
    user,
    sellerId,
    alwaysShowRevenue,
    viewRevenueData,
    viewServiceFees,
    reportSelection.hideOrderRevenue,
    reportSelection.hideOrderServiceFees,
    reportSelection.showOnlyEmails,
    reportSelection.showOnlyPhones,
  ]);

  // 5) Fetch event ONCE per id after seller is ready
  useEffect(() => {
    if (!user || !id) return;
    if (sellerId <= 0) return;
    // If a reload was requested via redux, always re-fetch.
    // Otherwise only fetch once per id (dedupe in StrictMode/dev).
    const shouldReload = reportSelection.reloadEvents;

    if (!shouldReload) {
      if (fetchedEventIdRef.current === id) return;
      fetchedEventIdRef.current = id;
    } else {
      // ensure we mark this id so repeated reloads don't double-fetch
      fetchedEventIdRef.current = id;
    }

    void (async () => {
      setIsLoading(true);
      try {
        const results = await getEventById(id);
        if (results?.event) {
          setCurrentDetailEvent(normalizeEvent(results.event));
          document.title = `${results.event.title}`;
        }
      } finally {
        setIsLoading(false);
        // clear the reload flag if it was set
        if (reportSelection.reloadEvents) dispatch(setReloadEvents(false));
      }
    })();
  }, [user, id, sellerId, getEventById, reportSelection.reloadEvents, dispatch]);

  // ---------------------------------------------------------------------------
  // Everything below here is your existing render/build logic (unchanged)
  // ---------------------------------------------------------------------------

  let shirtData: IShirtData | undefined = undefined;
  const hasPhoneData = currentDetailEvent?.hasPhoneData ?? false;
  let hasTicketData = false;
  let hasShirtData = false;
  const hasNonUsaOrders = currentDetailEvent?.hasNonUsaOrders ?? false;
  const currencySymbol: string | undefined = currentDetailEvent?.nonUsaCurrencySymbol;
  const numTicketTypes = currentDetailEvent?.ticketTypes?.length ?? 0;

  const ticketBreakdownRows: ReactElement[] = [];
  const shirtSizeBreakdownRows: ReactElement[] = [];
  const orderRows: ReactElement[] = [];

  let hasOrders = false;
  let searchBarHidden = true;
  let visibleOrders: Order[] = [];
  let lastUpdatedUtc: moment.Moment = moment.utc([1970, 1, 1]);

  const filterOrders = (orders: Order[] | undefined) => {
    visibleOrders = [];

    if (orders?.length) {
      visibleOrders = orders.filter(
        (order) =>
          (reportSelection.showDeletedOrders && order.isDeleted) ||
          (reportSelection.showInactiveOrders && !order.isActive && !order.isDeleted) ||
          (!order.isDeleted && order.isActive),
      );
    }

    let fOrders: Order[] = visibleOrders ?? [];
    if (visibleOrders.length > 0 && searchTerm && searchTerm.length >= 2) {
      const srch = searchTerm.toLowerCase();
      fOrders = visibleOrders.filter(
        (order) =>
          order.purchaserFirstName.toLowerCase().includes(srch) ||
          order.purchaserLastName.toLowerCase().includes(srch),
      );
    }
    return fOrders;
  };

  let totalTickets = 0;

  if (currentDetailEvent) {
    if (
      windowSize.isMobile ||
      (currentDetailEvent.orders && currentDetailEvent.orders.length > 10)
    ) {
      searchBarHidden = false;
    }

    const filteredOrders = filterOrders(currentDetailEvent.orders);

    // Apply user-selected sort
    let sortedOrders: Order[] = filteredOrders ?? [];
    if (sortedOrders.length > 0) {
      if (sortBy === 'purchaseDate') {
        sortedOrders = [...sortedOrders].sort((a, b) => {
          const aUnix =
            a.purchaseUnixTimestamp ??
            (a.purchaseTimestamp ? moment(a.purchaseTimestamp).unix() : 0);
          const bUnix =
            b.purchaseUnixTimestamp ??
            (b.purchaseTimestamp ? moment(b.purchaseTimestamp).unix() : 0);

          const dateDiff = bUnix - aUnix; // newest first
          if (dateDiff !== 0) return dateDiff;

          const lastCmp = (a.purchaserLastName ?? '').localeCompare(b.purchaserLastName ?? '');
          if (lastCmp !== 0) return lastCmp;
          return (a.purchaserFirstName ?? '').localeCompare(b.purchaserFirstName ?? '');
        });
      } else if (sortBy === 'ticketType') {
        sortedOrders = [...sortedOrders].sort((a, b) => {
          const aOrder = a.tickets?.[0]?.ticketTypeOrder;
          const bOrder = b.tickets?.[0]?.ticketTypeOrder;

          if (aOrder === undefined && bOrder === undefined) {
            const lastCmp = (a.purchaserLastName ?? '').localeCompare(b.purchaserLastName ?? '');
            if (lastCmp !== 0) return lastCmp;
            return (a.purchaserFirstName ?? '').localeCompare(b.purchaserFirstName ?? '');
          }
          if (aOrder === undefined) return -1;
          if (bOrder === undefined) return 1;

          const orderDiff = Number(aOrder) - Number(bOrder);
          if (orderDiff !== 0) return orderDiff;

          const lastCmp = (a.purchaserLastName ?? '').localeCompare(b.purchaserLastName ?? '');
          if (lastCmp !== 0) return lastCmp;
          return (a.purchaserFirstName ?? '').localeCompare(b.purchaserFirstName ?? '');
        });
      } else {
        sortedOrders = [...sortedOrders].sort(
          (a, b) =>
            (a.purchaserLastName ?? '').localeCompare(b.purchaserLastName ?? '') ||
            (a.purchaserFirstName ?? '').localeCompare(b.purchaserFirstName ?? ''),
        );
      }
    }

    sortedOrders?.forEach((order, i) => {
      if (order.isActive && !order.isDeleted && !order.isComped) {
        totalTickets += order.numTickets;
      }
      hasOrders = true;

      const orderLastUpdated = moment.utc(order.lastUpdate);
      if (orderLastUpdated.unix() > lastUpdatedUtc.unix()) {
        lastUpdatedUtc = orderLastUpdated;
      }

      const key = `or${i}`;
      if (windowSize.isMobile) {
        orderRows.push(
          <OrderMobileRow
            key={key}
            EventDate={currentDetailEvent?.eventDate}
            EventName={currentDetailEvent?.title}
            Order={order}
            HasPhoneData={hasPhoneData}
            HideRevenue={hideRevItem}
            HideServiceFees={hideServiceFeeDisplay}
            CanCheckInTickets={canCheckInTickets}
            TicketTypes={currentDetailEvent?.ticketTypes}
            ShowOnlyEmails={showOnlyEmailsDisplay}
            ShowOnlyPhones={showOnlyPhonesDisplay}
            IsAdmin={user?.isAdmin ?? false}
          />,
        );
      } else {
        orderRows.push(
          <OrderRow
            key={key}
            EventDate={currentDetailEvent?.eventDate}
            EventName={currentDetailEvent?.title}
            Order={order}
            HasPhoneData={hasPhoneData}
            HideRevenue={hideRevItem}
            HideServiceFees={hideServiceFeeDisplay}
            CanCheckInTickets={canCheckInTickets}
            TicketTypes={currentDetailEvent?.ticketTypes}
            ShowOnlyEmails={showOnlyEmailsDisplay}
            ShowOnlyPhones={showOnlyPhonesDisplay}
            IsAdmin={user?.isAdmin ?? false}
          />,
        );
      }
    });

    const ticketData: ITicketData | undefined = getTicketDataFromOrders(
      sortedOrders,
      currentDetailEvent,
    );
    const ticketTypes = ticketData?.TicketTypes;

    if (ticketTypes?.length) {
      hasTicketData = true;
      let i = 0;

      ticketData.TicketData?.forEach((ticketTypeData: ITicketTypeData[]) => {
        ticketTypes.forEach((ticketType: TicketType) => {
          const key = `ttd${i}`;
          const data = ticketTypeData.find((x) => x.TicketType === ticketType.ticketTypeName);
          const number = data ? data.Number : 0;
          const total = ticketType.totalAvailable > 0 ? `/${ticketType.totalAvailable}` : '';

          if (number > 0 || user?.isAdmin) {
            ticketBreakdownRows.push(
              <div key={key}>
                {ticketType.ticketTypeName} ({number}
                {total})
              </div>,
            );
          }
          i += 1;
        });
      });
    }

    shirtData = getShirtDataFromOrders(sortedOrders);
    const shirtSizes = shirtData?.ShirtSizes ?? [];
    const arr = new Map<string, number>();

    if (shirtSizes.length > 0) {
      hasShirtData = true;
      shirtSizes.forEach((shirtSize: string) => {
        shirtData?.ShirtData?.forEach((shirSizeData: IShirtSizeData[]) => {
          const data = shirSizeData.find((x) => x.ShirtSize === shirtSize);
          let number = arr.get(shirtSize) ?? 0;
          if (data) number += data.Number;
          arr.set(shirtSize, number);
        });
      });

      let i = 0;
      for (const shirtSize of shirtSizes) {
        const key = `ssw${i}`;
        shirtSizeBreakdownRows.push(
          <div key={key}>
            {shirtSize} ({arr.get(shirtSize)})
          </div>,
        );
        i += 1;
      }
    }
  }

  const exportOrdersToCsv = () => {
    if (reportSelection && currentDetailEvent) {
      const showServiceFees = viewServiceFees && !reportSelection.hideOrderServiceFees;
      const showRevenueData = viewRevenueData && !reportSelection.hideOrderRevenue;
      const showOnlyEmails = user?.isAdmin && reportSelection.showOnlyEmails;
      const showOnlyPhones = user?.isAdmin && reportSelection.showOnlyPhones;

      const csvData = exportEventCustomerDataToCsv(
        currentDetailEvent,
        showServiceFees,
        showRevenueData,
        hasPhoneData,
        hasNonUsaOrders,
        currencySymbol,
        showOnlyEmails,
        showOnlyPhones,
      );

      const fileName = getFileNameFromEvent(currentDetailEvent, `orders`);
      downloadCsvFile(fileName, csvData);
    }
  };

  const handleShowInactive = (checked: boolean) => dispatch(setShowInactiveOrders(checked));
  const handleShowDeleted = (checked: boolean) => dispatch(setShowDeletedOrders(checked));

  const handleHideRevenue = (checked: boolean) => dispatch(setHideOrderRevenue(checked));
  const handleHideServiceFees = (checked: boolean) => dispatch(setHideOrderServiceFees(checked));

  const handleShowOnlyEmails = (checked: boolean) => {
    dispatch(setShowOnlyEmails(checked));
    if (checked) dispatch(setShowOnlyPhones(false));
  };

  const handleShowOnlyPhones = (checked: boolean) => {
    dispatch(setShowOnlyPhones(checked));
    if (checked) dispatch(setShowOnlyEmails(false));
  };

  let eventDate = '';
  if (currentDetailEvent?.eventDate !== undefined) {
    if (currentDetailEvent?.eventTime) {
      eventDate = moment(currentDetailEvent.eventTime).format('MM/DD/YYYY h:mm A');
      if (currentDetailEvent.venue?.timezone) eventDate += ` ${currentDetailEvent.venue?.timezone}`;
    } else {
      eventDate = moment(currentDetailEvent.eventDate).format('MM/DD/YYYY');
    }
  }

  let doorsOpen = '';
  if (currentDetailEvent?.doorsOpen) {
    doorsOpen = moment(currentDetailEvent.doorsOpen).format('h:mm A');
    if (currentDetailEvent.venue?.timezone) doorsOpen += ` ${currentDetailEvent.venue?.timezone}`;
  }

  let meetAndGreet = '';
  if (currentDetailEvent?.meetAndGreetTime) {
    meetAndGreet = moment(currentDetailEvent.meetAndGreetTime).format('h:mm A');
    if (currentDetailEvent.venue?.timezone)
      meetAndGreet += ` ${currentDetailEvent.venue?.timezone}`;
  }

  const venue = currentDetailEvent?.venue;
  const venueName = venue?.name;
  const address = venue?.address1;

  let location = `${venue?.city}`;
  if (venue?.state) location += `, ${venue?.state}`;

  const zip = venue?.postalCode;
  const country = venue?.country?.countryName;

  const revClass = hideRevItem ? 'no-print' : '';

  const lastUpdated = getPacificMoment(lastUpdatedUtc);

  // 6) Focus control after the page has finished loading and the orders table has rendered
  useEffect(() => {
    if (!reportSelection.focusControl || isLoading || !currentDetailEvent) return;

    const fc = reportSelection.focusControl;
    const expectedRowCount = orderRows.length;
    const startTime = performance.now();
    let stableFrameCount = 0;
    let lastLayoutKey = '';

    const cancelPendingFocus = () => {
      if (focusAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(focusAnimationFrameRef.current);
        focusAnimationFrameRef.current = null;
      }
    };

    const focusWhenReady = () => {
      const pageLoaded = document.readyState === 'complete';
      const fontsLoaded = !('fonts' in document) || document.fonts.status === 'loaded';
      const renderedRowCount = ordersTableBodyRef.current?.children.length ?? 0;
      const tableRendered = renderedRowCount >= expectedRowCount;
      const target = document.getElementById(fc);

      if (pageLoaded && fontsLoaded && tableRendered && target) {
        const targetRect = target.getBoundingClientRect();
        const tableHeight = ordersTableBodyRef.current
          ?.closest('table')
          ?.getBoundingClientRect().height;
        const layoutKey = [
          Math.round(targetRect.top),
          Math.round(targetRect.left),
          Math.round(targetRect.height),
          renderedRowCount,
          Math.round(tableHeight ?? 0),
          document.body.scrollHeight,
        ].join(':');

        if (layoutKey === lastLayoutKey) {
          stableFrameCount += 1;
        } else {
          lastLayoutKey = layoutKey;
          stableFrameCount = 0;
        }
      } else {
        stableFrameCount = 0;
        lastLayoutKey = '';
      }

      if (pageLoaded && fontsLoaded && tableRendered && target && stableFrameCount >= 2) {
        focusAnimationFrameRef.current = window.requestAnimationFrame(() => {
          setFocusToControl(fc);
          dispatch(setFocusControl(''));
          focusAnimationFrameRef.current = null;
        });
        return;
      }

      if (performance.now() - startTime >= 10000) {
        dispatch(setFocusControl(''));
        cancelPendingFocus();
        return;
      }

      focusAnimationFrameRef.current = window.requestAnimationFrame(focusWhenReady);
    };

    focusAnimationFrameRef.current = window.requestAnimationFrame(focusWhenReady);

    return cancelPendingFocus;
  }, [reportSelection.focusControl, isLoading, currentDetailEvent, orderRows.length, dispatch]);

  return (
    <>
      {!currentDetailEvent ? (
        ''
      ) : (
        <Container className="fluid">
          <Row>
            <Col className="vip-col">
              <Row>
                <Col>
                  <table className="vipDetailsTable">
                    <tbody>
                      <tr>
                        <td className="vipLabel">Event:</td>
                        <td className="vipTitle">{currentDetailEvent.title}</td>
                      </tr>
                      <tr>
                        <td className="vipLabel">Venue:</td>
                        <td>
                          {venueName && <div>{venueName}</div>}
                          {address && <div>{address}</div>}
                          {location && (
                            <div>
                              {location} {zip && <span>{zip}</span>}
                            </div>
                          )}
                          {country && <div>{country}</div>}
                        </td>
                      </tr>
                      <tr>
                        <td className="vipLabel">Date:</td>
                        <td>{eventDate}</td>
                      </tr>
                      <tr>
                        <td className="vipLabel">Total Tickets:</td>
                        <td>{totalTickets}</td>
                      </tr>
                      <tr hidden={!canCheckInTickets} className="no-print">
                        <td className="vipLabel">Checked In:</td>
                        <td>
                          {currentDetailEvent.totalCheckedIn} / {totalTickets}
                        </td>
                      </tr>
                      <tr hidden={hideRevItem} className={revClass}>
                        <td className="vipLabel">Total Revenue:</td>
                        <td>
                          $
                          {(
                            (currentDetailEvent.totalRevenue ?? 0) -
                            (currentDetailEvent.revenueRefunded ?? 0)
                          ).toFixed(2)}
                        </td>
                      </tr>
                      <tr hidden={hideServiceFeeDisplay || !viewServiceFees}>
                        <td className="vipLabel">Total Service Fees:</td>
                        <td>
                          $
                          {(
                            (currentDetailEvent.totalServiceFees ?? 0) -
                            (currentDetailEvent.serviceFeeRevenueRefunded ?? 0)
                          ).toFixed(2)}
                        </td>
                      </tr>
                      <tr hidden={!hasTicketData}>
                        <td className="vipLabel">Ticket Breakdown:</td>
                        <td>{ticketBreakdownRows}</td>
                      </tr>
                      <tr hidden={!hasShirtData}>
                        <td className="vipLabel">Shirt Breakdown:</td>
                        <td>{shirtSizeBreakdownRows}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>

                <Col
                  hidden={
                    !currentDetailEvent.doorsOpen &&
                    !currentDetailEvent.meetAndGreetTime &&
                    !currentDetailEvent.checkInLocation &&
                    !currentDetailEvent.checkInNotes
                  }
                >
                  <table className="vipDetailsTable">
                    <tbody>
                      <tr hidden={!currentDetailEvent.doorsOpen}>
                        <td className="vipLabel">Doors Open:</td>
                        <td>{doorsOpen}</td>
                      </tr>
                      <tr hidden={!currentDetailEvent.meetAndGreetTime}>
                        <td className="vipLabel">Meet &amp; Greet Time:</td>
                        <td>{meetAndGreet}</td>
                      </tr>
                      <tr hidden={!currentDetailEvent.checkInLocation}>
                        <td className="vipLabel">Check-in Location:</td>
                        <td className="vipValue">{currentDetailEvent.checkInLocation ?? 'n/a'}</td>
                      </tr>
                      <tr hidden={!currentDetailEvent.checkInNotes}>
                        <td className="vipLabel">Check-in Notes:</td>
                        <td className="vipValue">{currentDetailEvent.checkInNotes ?? 'n/a'}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>

              <Row className="no-print">
                <Col md={10} sm={12}>
                  <div className="admin-button-row">
                    <span
                      className="admin-button"
                      hidden={!canExportCustomerData || windowSize.isMobile}
                    >
                      <Button onClick={exportOrdersToCsv}>Export to Csv</Button>
                    </span>
                    <PrintButton IsMobile={windowSize.isMobile} ShowPrint={viewPrintButton} />
                  </div>
                </Col>
              </Row>

              <Row className="no-print">
                <Col md={20} sm={24}>
                  <span className="inactive-check" hidden={!viewInactiveOrders}>
                    <Checkbox
                      checked={reportSelection.showInactiveOrders}
                      onChange={(_, checked) => handleShowInactive(checked)}
                      disabled={reportSelection.showDeletedOrders}
                    >
                      Show Inactive Orders?
                    </Checkbox>
                  </span>

                  <span className="deleted-check" hidden={!viewDeletedOrders}>
                    <Checkbox
                      checked={reportSelection.showDeletedOrders}
                      onChange={(_, checked) => handleShowDeleted(checked)}
                    >
                      Show Deleted Orders?
                    </Checkbox>
                  </span>

                  <span className="revenue-check" hidden={!hasOrders || !viewRevenueControls}>
                    <Checkbox
                      checked={reportSelection.hideOrderRevenue ?? true}
                      onChange={(_, checked) => handleHideRevenue(checked)}
                    >
                      Hide Revenue Items?
                    </Checkbox>
                  </span>

                  <span className="service-fees-check" hidden={!hasOrders || !viewServiceFees}>
                    <Checkbox
                      checked={reportSelection.hideOrderServiceFees ?? true}
                      onChange={(_, checked) => handleHideServiceFees(checked)}
                    >
                      Hide Service Fees?
                    </Checkbox>
                  </span>

                  <span className="service-fees-check" hidden={!hasOrders || !user?.isAdmin}>
                    <Checkbox
                      checked={reportSelection.showOnlyEmails}
                      onChange={(_, checked) => handleShowOnlyEmails(checked)}
                    >
                      Show Only Emails?
                    </Checkbox>
                  </span>

                  <span
                    className="service-fees-check"
                    hidden={!hasOrders || !user?.isAdmin || !hasPhoneData}
                  >
                    <Checkbox
                      checked={reportSelection.showOnlyPhones}
                      onChange={(_, checked) => handleShowOnlyPhones(checked)}
                    >
                      Show Only Phones?
                    </Checkbox>
                  </span>
                </Col>
              </Row>
              <Row className="no-print">
                <Col md={20} sm={24}>
                  <div
                    className="sort-by-group no-print"
                    style={{
                      marginTop: 8,
                      marginLeft: 15,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <label style={{ marginRight: 8, fontWeight: 600 }}>Sort By</label>
                    <RadioGroup
                      name="sort-by"
                      inline
                      value={sortBy}
                      onChange={(val) =>
                        setSortBy(val as 'purchaseDate' | 'purchaserName' | 'ticketType')
                      }
                    >
                      <Radio value="purchaserName">Purchaser Name</Radio>
                      <Radio value="purchaseDate">Purchase Date</Radio>
                      <Radio value="ticketType" hidden={numTicketTypes <= 1}>
                        Ticket Type
                      </Radio>
                    </RadioGroup>
                  </div>
                </Col>
              </Row>

              <Row hidden={searchBarHidden} className="no-print">
                <Col md={20} sm={24}>
                  <Input
                    value={searchTerm ?? ''}
                    onChange={setSearchTerm}
                    className="search-text-input"
                    style={{ marginLeft: 10 }}
                    placeholder="Search for orders..."
                    hidden={isLoading || orderRows.length === 0}
                  />
                </Col>
              </Row>

              <Row hidden={isLoading} className="vipTable-container">
                <table className="vipTable">
                  <thead hidden={windowSize.isMobile}>
                    <tr>
                      <th hidden={showOnlyEmailsDisplay || showOnlyPhonesDisplay}>
                        Purchaser Name
                      </th>
                      <th hidden={showOnlyEmailsDisplay || showOnlyPhonesDisplay}>Attendee Name</th>
                      <th
                        hidden={showOnlyEmailsDisplay || showOnlyPhonesDisplay}
                        className="purchase-date no-print"
                      >
                        Purchase Date
                      </th>
                      <th hidden={showOnlyEmailsDisplay || showOnlyPhonesDisplay}>Order Id</th>
                      <th hidden={showOnlyEmailsDisplay || showOnlyPhonesDisplay}>Order Status</th>
                      <th hidden={showOnlyEmailsDisplay || showOnlyPhonesDisplay}>Event Date</th>
                      <th hidden={showOnlyEmailsDisplay || showOnlyPhonesDisplay}>Event Name</th>
                      <th hidden={showOnlyEmailsDisplay || showOnlyPhonesDisplay}>Ticket Type</th>
                      <th hidden={showOnlyEmailsDisplay || showOnlyPhonesDisplay}># of tickets</th>
                      <th
                        hidden={hideRevItem || showOnlyEmailsDisplay || showOnlyPhonesDisplay}
                        className={revClass}
                      >
                        Revenue
                      </th>
                      <th
                        className="no-print"
                        hidden={
                          hideServiceFeeDisplay ||
                          !viewServiceFees ||
                          showOnlyEmailsDisplay ||
                          showOnlyPhonesDisplay
                        }
                      >
                        Service Fees
                      </th>
                      <th hidden={showOnlyPhonesDisplay}>Email</th>
                      {hasPhoneData && !showOnlyEmailsDisplay ? <th>Phone #</th> : ''}
                      {hasShirtData && !(showOnlyEmailsDisplay || showOnlyPhonesDisplay) ? (
                        <th>Shirt Sizes</th>
                      ) : (
                        ''
                      )}
                    </tr>
                  </thead>
                  <tbody ref={ordersTableBodyRef}>{orderRows}</tbody>
                </table>
                {lastUpdated && (
                  <div className="last-refresh no-print">
                    Last refreshed: {lastUpdated.format('M/DD/YYYY h:mm A zz')} (updates every 30
                    minutes)
                  </div>
                )}
              </Row>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

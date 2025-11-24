import { Button, Col, Container, FormCheck, Row } from 'react-bootstrap';
import { EnumPermission, User, UserReportSelection } from '@/types/user';
import {
  IShirtData,
  IShirtSizeData,
  ITicketData,
  ITicketTypeData,
  Order,
  TicketType,
  VipEvent,
} from '@/types/event';
import React, { ChangeEvent, ReactElement, useEffect, useMemo, useState } from 'react';
import {
  setCurrentDetailEvent,
  setEventSeller,
  setEvents,
  setFocusControl,
  setHideRevenue,
  setHideServiceFees,
  setReloadEvents,
  setShowDeletedOrders,
  setShowInactiveOrders,
  setShowOnlyEmails,
  setShowOnlyPhones,
} from '@/lib/reportSelectionSlice';

import { useDispatch, useSelector } from 'react-redux';
import { EditProps } from '@/types/props';
import OrderMobileRow from './orderMobileRowComponent';
import OrderRow from './orderRowComponent';
import PrintButton from '../../common/printButtonComponent';
import { RingLoader } from 'react-spinners';
import { RootState } from '@/lib/store';
import debouce from 'lodash.debounce';
import { downloadCsvFile } from '@/utils/downloadFile';
import { exportEventCustomerDataToCsv } from '@/utils/eventUtils';
import getFileNameFromEvent from '@/utils/getFileNameFromEvent';
import getShirtDataFromOrders from '@/utils/getShirtDataFromOrders';
import getTicketDataFromOrders from '@/utils/getTicketDataFromOrders';
import moment from 'moment';
import router from 'next/router';
import setFocusToControl from '@/utils/setFocusToControl';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useGetEventById } from '@/hooks/common/useGetEventById';
import { useGetUserSeller } from '@/hooks/order/useGetUserSeller';
import { useHasPermission } from '@/hooks/user/useHasPermission';
import { useWindowSize } from '@/hooks/common/useWindowSize';

export default function EventDetail(props: EditProps) {
  const id = props.Id;

  const { getUser } = useCurrentUser();
  const [user, setUser] = useState<User | undefined>(undefined);
  const { userHasPermission } = useHasPermission();
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
  const [checkChanged, setCheckChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getEventById } = useGetEventById();
  const { getUserSellerFromEventId } = useGetUserSeller();
  const dispatch = useDispatch();
  const [hideRevItem, setHideRevItem] = useState(true);
  const [hideServiceFeeDisplay, setHideServiceFeeDisplay] = useState(true);
  const [showOnlyEmailsDisplay, setShowOnlyEmailsDisplay] = useState(false);
  const [showOnlyPhonesDisplay, setShowOnlyPhonesDisplay] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);

  const [viewInactiveOrders, setViewInactiveOrders] = useState(false);
  const [viewDeletedOrders, setViewDeletedOrders] = useState(false);
  const [viewServiceFees, setViewServiceFees] = useState(false);
  const [viewRevenueData, setViewRevenueData] = useState(false);
  const [viewRevenueControls, setViewRevenueControls] = useState(false);
  const [canExportCustomerData, setCanExportCustomerData] = useState(false);
  const [viewPrintButton, setViewPrintButton] = useState(false);
  const [canCheckInTickets, setCanCheckInTickets] = useState(false);
  const [alwaysShowRevenue, setAlwaysShowRevenue] = useState(false);

  const debouncedResults = useMemo(() => debouce(setSearchTerm, 300), []);

  let shirtData: IShirtData | undefined = undefined;
  const hasPhoneData = currentReportSelection.currentDetailEvent?.hasPhoneData ?? false;
  let hasTicketData: boolean = false;
  let hasShirtData: boolean = false;
  const hasNonUsaOrders: boolean =
    currentReportSelection.currentDetailEvent?.hasNonUSAOrders ?? false;
  const currencySymbol: string | undefined =
    currentReportSelection.currentDetailEvent?.nonUsaCurrencySymbol;
  const ticketBreakdownRows: ReactElement[] = [];
  const shirtSizeBreakdownRows: ReactElement[] = [];
  const orderRows: ReactElement[] = [];
  let hasOrders = false;
  let searchBarHidden = true;
  let visibleOrders: Order[] = [];

  useEffect(() => {
    const fetchEvent = async () => {
      if (!user) {
        const currentUser = getUser();
        setUser(currentUser);
      }

      if (!id || !user || user.userId <= 0 || !user.sellers || !currentReportSelection) {
        return;
      }

      setViewInactiveOrders(userHasPermission(user, EnumPermission.ViewInactiveEvents));
      setViewDeletedOrders(userHasPermission(user, EnumPermission.ViewDeletedEvents));
      setViewServiceFees(userHasPermission(user, EnumPermission.ViewServiceFees));
      const vRevenueControls = userHasPermission(
        user,
        EnumPermission.ViewRevenueControls,
      );
      const vRevenueData = userHasPermission(user, EnumPermission.ViewRevenueData);
      setViewRevenueControls(vRevenueControls);
      setViewRevenueData(vRevenueData);
      setCanExportCustomerData(
        userHasPermission(user, EnumPermission.ExportCustomerData),
      );
      setViewPrintButton(userHasPermission(user, EnumPermission.ViewPrintButton));
      setCanCheckInTickets(
        !user.disableCheckIn && userHasPermission(user, EnumPermission.CheckInUsers),
      );
      setAlwaysShowRevenue(vRevenueData && !vRevenueControls);

      if (!currentReportSelection.seller || currentReportSelection.seller.sellerId <= 0) {
        const reportSelection = { ...currentReportSelection };
        if ((user?.selectedSellerId ?? 0) > 0) {
          // Use cached user to transfer detail to redux in new window
          const seller = user.sellers.find((x) => x.sellerId === user.selectedSellerId);
          if (seller) {
            reportSelection.seller = seller;
            reportSelection.hideRevenue = user.selectedHideRevenue;
            reportSelection.hideServiceFees = user.selectedHideServiceFees;
            dispatch(setEventSeller(reportSelection));
          } else {
            // Not found, log out
            router.push('/logout');
          }
        } else {
          // User is logged in without selected seller, check for permission to load
          const sellerResult = await getUserSellerFromEventId(id, user.userId);
          if (sellerResult && sellerResult.userSeller) {
            reportSelection.seller = sellerResult.userSeller;
            reportSelection.hideRevenue = user.selectedHideRevenue;
            reportSelection.hideServiceFees = user.selectedHideServiceFees;
            dispatch(setEventSeller(reportSelection));
          } else {
            // Not found or no permission, log out
            router.push('/logout');
          }
        }
      } else if (currentReportSelection?.seller?.sellerId > 0) {
        if (alwaysShowRevenue) {
          setHideRevItem(false);
        } else if (viewRevenueData === false) {
          setHideRevItem(true);
        } else {
          setHideRevItem(currentReportSelection.hideRevenue ?? true);
        }

        if (user.isAdmin) {
          setShowOnlyEmailsDisplay(currentReportSelection.showOnlyEmails ?? false);
          setShowOnlyPhonesDisplay(currentReportSelection.showOnlyPhones ?? false);
        } else {
          setShowOnlyEmailsDisplay(false);
          setShowOnlyPhonesDisplay(false);
        }

        if (viewServiceFees) {
          setHideServiceFeeDisplay(currentReportSelection.hideServiceFees ?? true);
        } else {
          setHideServiceFeeDisplay(true);
        }

        if (currentReportSelection.reloadEvents) {
          setIsLoading(true);
          dispatch(setReloadEvents(false));
          const reportSelection: UserReportSelection = { ...currentReportSelection };
          if (!viewInactiveOrders) {
            reportSelection.showInactiveOrders = false;
          }
          const results = await getEventById(id);
          if (results && results.event) {
            const newEvent: VipEvent = results.event;
            if (newEvent) {
              if (newEvent.orders && newEvent.orders.length > 0) {
                const orders: Order[] = [];
                for (const order of newEvent.orders) {
                  if (order.isComped && order.tickets) {
                    for (const ticket of order.tickets) {
                      if (ticket.ticketTypeId !== 0 || !newEvent.ticketSocketEventId) {
                        continue;
                      }
                      const newOrder: Order = {
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
                        ticketSocketEventId: newEvent.ticketSocketEventId,
                        ticketSocketOrderId: order.ticketSocketOrderId,
                        tickets: [ticket],
                        totalShirts: order.totalShirts,
                      };
                      orders.push(newOrder);
                    }
                  } else {
                    orders.push(order);
                  }
                }
                newEvent.orders = orders.sort((a, b) =>
                  a.purchaserLastName?.localeCompare(b.purchaserLastName) ||
                  a.purchaserFirstName?.localeCompare(b.purchaserFirstName) ||
                  (a.purchaseTimestamp && b.purchaseTimestamp ? moment(b.purchaseTimestamp).unix() - moment(a.purchaseTimestamp).unix() : 0)
                );
              }

              dispatch(setCurrentDetailEvent(newEvent));
              if (currentReportSelection.currentEvents !== undefined) {
                document.title = newEvent.title;
                currentReportSelection.currentEvents.map(evt => (evt.externalEventId === newEvent.externalEventId
                  ? newEvent
                  : evt));
                dispatch(setEvents(currentReportSelection.currentEvents));
              }
            }
          }
          setIsLoading(false);
          if (
            currentReportSelection.focusControl &&
            currentReportSelection.focusControl !== ''
          ) {
            const { focusControl } = currentReportSelection;
            setTimeout(() => {
              setFocusToControl(focusControl);
            }, 300);
            dispatch(setFocusControl(''));
          }
        }
      }
    };
    fetchEvent();
    return () => {
      debouncedResults.cancel();
    };
  }, [
    checkChanged,
    id,
    currentReportSelection,
    dispatch,
    getEventById,
    alwaysShowRevenue,
    viewInactiveOrders,
    viewRevenueData,
    viewServiceFees,
    debouncedResults,
    windowSizeJson,
    user,
    getUserSellerFromEventId,
    userHasPermission,
    viewRevenueControls,
    getUser,
  ]);

  const exportOrdersToCsv = () => {
    if (currentReportSelection && currentReportSelection.currentDetailEvent) {
      const showServiceFees = viewServiceFees && !currentReportSelection.hideServiceFees;
      const showRevenueData = viewRevenueData && !currentReportSelection.hideRevenue;
      const showOnlyEmails = user?.isAdmin && currentReportSelection.showOnlyEmails;
      const showOnlyPhones = user?.isAdmin && currentReportSelection.showOnlyPhones;
      const csvData = exportEventCustomerDataToCsv(
        currentReportSelection.currentDetailEvent,
        showServiceFees,
        showRevenueData,
        hasPhoneData,
        hasNonUsaOrders,
        currencySymbol,
        showOnlyEmails,
        showOnlyPhones
      );
      const fileName = getFileNameFromEvent(
        currentReportSelection.currentDetailEvent,
        `orders`,
      );
      downloadCsvFile(fileName, csvData);
    }
  };

  const filterOrders = (orders: Order[] | undefined) => {
    visibleOrders = [];

    if (orders && orders.length > 0) {
      visibleOrders = orders.filter(order => ((
        (currentReportSelection.showDeletedOrders && order.isDeleted) ||
        (currentReportSelection.showInactiveOrders &&
          !order.isActive &&
          !order.isDeleted) ||
        (!order.isDeleted && order.isActive))
      ));
    }

    let fOrders: Order[] = visibleOrders ?? [];
    if (visibleOrders.length > 0 && searchTerm && searchTerm.length >= 2) {
      const srch = searchTerm.toLowerCase();
      fOrders = visibleOrders.filter((order) => (
        order.purchaserFirstName.toLowerCase().includes(srch) ||
        order.purchaserLastName.toLowerCase().includes(srch)
      ));
    }
    return fOrders;
  };

  let totalTickets = 0;
  if (currentReportSelection.currentDetailEvent !== undefined) {
    if (
      windowSize.isMobile ||
      (currentReportSelection.currentDetailEvent.orders &&
        currentReportSelection.currentDetailEvent.orders.length > 10)
    ) {
      searchBarHidden = false;
    }

    const filteredOrders: Order[] | undefined = filterOrders(currentReportSelection.currentDetailEvent.orders);
    filteredOrders?.forEach((order, i) => {
      if (order.isActive && !order.isDeleted && !order.isComped) {
        totalTickets += order.numTickets;
      }
      hasOrders = true;
      const key = `or${i}`;
      if (windowSize.isMobile) {
        orderRows.push(
          <OrderMobileRow
            key={key}
            EventDate={currentReportSelection.currentDetailEvent?.eventDate}
            EventName={currentReportSelection.currentDetailEvent?.title}
            Order={order}
            HasPhoneData={hasPhoneData}
            HideRevenue={hideRevItem}
            HideServiceFees={hideServiceFeeDisplay}
            CanCheckInTickets={canCheckInTickets}
            TicketTypes={currentReportSelection.currentDetailEvent?.ticketTypes}
            ShowOnlyEmails={showOnlyEmailsDisplay}
            ShowOnlyPhones={showOnlyPhonesDisplay}
            IsAdmin={user?.isAdmin ?? false}
          />,
        );
      } else {
        orderRows.push(
          <OrderRow
            key={key}
            EventDate={currentReportSelection.currentDetailEvent?.eventDate}
            EventName={currentReportSelection.currentDetailEvent?.title}
            Order={order}
            HasPhoneData={hasPhoneData}
            HideRevenue={hideRevItem}
            HideServiceFees={hideServiceFeeDisplay}
            CanCheckInTickets={canCheckInTickets}
            TicketTypes={currentReportSelection.currentDetailEvent?.ticketTypes}
            ShowOnlyEmails={showOnlyEmailsDisplay}
            ShowOnlyPhones={showOnlyPhonesDisplay}
            IsAdmin={user?.isAdmin ?? false}
          />,
        );
      }
    });

    const ticketData: ITicketData | undefined = getTicketDataFromOrders(
      filteredOrders,
      currentReportSelection.currentDetailEvent,
    );
    const ticketTypes = ticketData?.TicketTypes;
    if (ticketTypes?.length > 0) {
      hasTicketData = true;
      let i = 0;
      ticketData.TicketData?.forEach((ticketTypeData: ITicketTypeData[]) => {
        ticketTypes.forEach((ticketType: TicketType) => {
          const key = `ttd${i}`;
          const data = ticketTypeData.find(
            (x) => x.TicketType === ticketType.ticketTypeName,
          );
          let number = 0;
          let total = '';
          if (data) {
            number = data.Number;
          }
          if (ticketType.totalAvailable > 0) {
            total = `/${ticketType.totalAvailable}`;
          }
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
    shirtData = getShirtDataFromOrders(filteredOrders);
    const shirtSizes = shirtData?.ShirtSizes ?? [];
    const arr = new Map<string, number>();
    if (shirtSizes.length > 0) {
      hasShirtData = true;
      shirtSizes.forEach((shirtSize: string) => {
        shirtData?.ShirtData?.forEach((shirSizeData: IShirtSizeData[]) => {
          const data = shirSizeData.find((x) => x.ShirtSize === shirtSize);
          let number = (arr.get(shirtSize) ?? 0);
          if (data) {
            number += data.Number;
          }
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

  const handleShowInactive = (event: ChangeEvent<HTMLInputElement>) => {
    if (currentReportSelection) {
      dispatch(setShowInactiveOrders(event.target.checked));
    }
  };

  const handleShowDeleted = (event: ChangeEvent<HTMLInputElement>) => {
    if (currentReportSelection) {
      dispatch(setShowDeletedOrders(event.target.checked));
    }
  };

  const handleHideRevenue = (event: ChangeEvent<HTMLInputElement>) => {
    if (currentReportSelection) {
      dispatch(setHideRevenue(event.target.checked));
      setCheckChanged(!checkChanged);
    }
  };

  const handleHideServiceFees = (event: ChangeEvent<HTMLInputElement>) => {
    if (currentReportSelection) {
      dispatch(setHideServiceFees(event.target.checked));
      setCheckChanged(!checkChanged);
    }
  };

  const handleShowOnlyEmails = (event: ChangeEvent<HTMLInputElement>) => {
    if (currentReportSelection) {
      dispatch(setShowOnlyEmails(event.target.checked));
      if (event.target.checked) {
        dispatch(setShowOnlyPhones(false));
      }
      setCheckChanged(!checkChanged);
    }
  };

  const handleShowOnlyPhones = (event: ChangeEvent<HTMLInputElement>) => {
    if (currentReportSelection) {
      dispatch(setShowOnlyPhones(event.target.checked))
      if (event.target.checked) {
        dispatch(setShowOnlyEmails(false));
      }
      setCheckChanged(!checkChanged);
    }
  };

  let eventDate = '';
  if (currentReportSelection.currentDetailEvent?.eventDate !== undefined) {
    if (currentReportSelection.currentDetailEvent?.eventTime) {
      eventDate = moment(currentReportSelection.currentDetailEvent.eventTime).format('MM/DD/YYYY h:mm A');
      if (currentReportSelection.currentDetailEvent.venue?.timezone) {
        eventDate += ` ${currentReportSelection.currentDetailEvent.venue?.timezone}`;
      }
    } else {
      eventDate = moment(currentReportSelection.currentDetailEvent.eventDate).format('MM/DD/YYYY');      
    }
  }

  let doorsOpen = '';
  if (currentReportSelection.currentDetailEvent?.doorsOpen) {
    doorsOpen = moment(currentReportSelection.currentDetailEvent.doorsOpen).format('h:mm A');
    if (currentReportSelection.currentDetailEvent.venue?.timezone) {
      doorsOpen += ` ${currentReportSelection.currentDetailEvent.venue?.timezone}`;
    }
  }

  let meetAndGreet = '';
  if (currentReportSelection.currentDetailEvent?.meetAndGreetTime) {
    meetAndGreet = moment(currentReportSelection.currentDetailEvent.meetAndGreetTime).format('h:mm A');
    if (currentReportSelection.currentDetailEvent.venue?.timezone) {
      meetAndGreet += ` ${currentReportSelection.currentDetailEvent.venue?.timezone}`;
    }
  }

  const venue = currentReportSelection.currentDetailEvent?.venue;
  const venueName = venue?.name;
  const address = venue?.address1;
  let location = `${venue?.city}`
  if (venue?.state) {
    location += `, ${venue?.state}`;
  }
  const zip = venue?.postalCode;
  const country = venue?.country?.countryName;

  const revClass = hideRevItem ? 'no-print' : '';

  return (
    <>
      {currentReportSelection.currentDetailEvent === undefined ? '' : (
        <Container fluid className="vipContainer">
          <Row>
            <Col>
              <Row>
                <Col>
                  <table className="vipDetailsTable">
                    <tbody>
                      <tr>
                        <td className="vipLabel">Event:</td>
                        <td className="vipTitle">
                          {currentReportSelection.currentDetailEvent.title}
                        </td>
                      </tr>
                      <tr>
                        <td className="vipLabel">Venue:</td>
                        <td>
                          {venueName && <div>{venueName}</div>}
                          {address && <div>{address}</div>}
                          {location && <div>{location} {zip && <span>{zip}</span>}</div>}
                          {country && <div>{country}</div>}
                        </td>
                      </tr>
                      <tr>
                        <td className="vipLabel">Date:</td>
                        <td>
                          {eventDate}
                        </td>
                      </tr>
                      <tr>
                        <td className="vipLabel">Total Tickets:</td>
                        <td>{totalTickets}</td>
                      </tr>
                      <tr hidden={!canCheckInTickets} className="no-print">
                        <td className="vipLabel">Checked In:</td>
                        <td>
                          {currentReportSelection.currentDetailEvent.totalCheckedIn} /{' '}
                          {totalTickets}
                        </td>
                      </tr>
                      <tr hidden={hideRevItem} className={revClass}>
                        <td className="vipLabel">Total Revenue:</td>
                        <td>
                          $
                          {((currentReportSelection.currentDetailEvent.totalRevenue ?? 0) - (currentReportSelection.currentDetailEvent.revenueRefunded ?? 0)).toFixed(
                            2,
                          )}
                        </td>
                      </tr>
                      <tr hidden={hideServiceFeeDisplay || !viewServiceFees}>
                        <td className="vipLabel">Total Service Fees:</td>
                        <td>
                          $
                          {((currentReportSelection.currentDetailEvent.totalServiceFees ?? 0) - (currentReportSelection.currentDetailEvent.serviceFeeRevenueRefunded ?? 0)).toFixed(
                            2,
                          )}
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
                <Col hidden={
                  !currentReportSelection.currentDetailEvent.doorsOpen &&
                  !currentReportSelection.currentDetailEvent.meetAndGreetTime &&
                  !currentReportSelection.currentDetailEvent.checkInLocation &&
                  !currentReportSelection.currentDetailEvent.checkInNotes
                }>
                  <table className="vipDetailsTable">
                    <tbody>
                      <tr hidden={!currentReportSelection.currentDetailEvent.doorsOpen}>
                        <td className="vipLabel">Doors Open:</td>
                        <td>
                          {doorsOpen}
                        </td>
                      </tr>
                      <tr hidden={!currentReportSelection.currentDetailEvent.meetAndGreetTime}>
                        <td className="vipLabel">Meet & Greet Time:</td>
                        <td>
                          {meetAndGreet}
                        </td>
                      </tr>
                      <tr hidden={!currentReportSelection.currentDetailEvent.checkInLocation}>
                        <td className="vipLabel">Check-in Location:</td>
                        <td className="vipValue">
                          {currentReportSelection.currentDetailEvent.checkInLocation ?? 'n/a'}
                        </td>
                      </tr>
                      <tr hidden={!currentReportSelection.currentDetailEvent.checkInNotes}>
                        <td className="vipLabel">Check-in Notes:</td>
                        <td className="vipValue">{currentReportSelection.currentDetailEvent.checkInNotes ?? 'n/a'}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>
              <Row hidden={!isLoading}>
                <Col className="spinner-container" hidden={!isLoading}>
                  <RingLoader size={150} color="#d12610" />
                </Col>
              </Row>
              <Row hidden={isLoading} className="no-print">
                <Col md={10} sm={12} hidden={windowSize.isMobile}>
                  <div className="admin-button-row">
                    <span className="admin-button" hidden={!canExportCustomerData}>
                      <Button onClick={exportOrdersToCsv}>Export to Csv</Button>
                    </span>
                    <PrintButton ShowPrint={viewPrintButton} />
                  </div>
                </Col>
                <Col md={10} sm={12}>
                  <span className="inactive-check" hidden={!viewInactiveOrders}>
                    <FormCheck
                      checked={currentReportSelection?.showInactiveOrders}
                      onChange={handleShowInactive}
                      disabled={currentReportSelection?.showDeletedOrders}
                      label="Show Inactive Orders?"
                    />
                  </span>
                  <span className="deleted-check" hidden={!viewDeletedOrders}>
                    <FormCheck
                      checked={currentReportSelection?.showDeletedOrders}
                      onChange={handleShowDeleted}
                      label="Show Deleted Orders?"
                    />
                  </span>
                  <span
                    className="revenue-check"
                    hidden={!hasOrders || !viewRevenueControls}
                  >
                    <FormCheck
                      checked={currentReportSelection?.hideRevenue}
                      onChange={handleHideRevenue}
                      label="Hide Revenue Items?"
                    />
                  </span>
                  <span
                    className="service-fees-check"
                    hidden={!hasOrders || !viewServiceFees}
                  >
                    <FormCheck
                      checked={currentReportSelection?.hideServiceFees}
                      onChange={handleHideServiceFees}
                      label="Hide Service Fees?"
                    />
                  </span>
                  <span
                    className="service-fees-check"
                    hidden={!hasOrders || !user?.isAdmin}
                  >
                    <FormCheck
                      checked={currentReportSelection?.showOnlyEmails}
                      onChange={handleShowOnlyEmails}
                      label="Show Only Emails?"
                    />
                  </span>
                  <span
                    className="service-fees-check"
                    hidden={!hasOrders || !user?.isAdmin || !hasPhoneData}
                  >
                    <FormCheck
                      checked={currentReportSelection?.showOnlyPhones}
                      onChange={handleShowOnlyPhones}
                      label="ShowOnlyPhones?"
                    />
                  </span>
                </Col>
                <Col md={10} sm={12} className="no-print" hidden={searchBarHidden}>
                  <input
                    type="text" 
                    value={searchTerm ?? ''}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control search-text-input"
                    placeholder="Search for orders..."
                    hidden={isLoading || !orderRows || orderRows.length === 0}
                  />
                </Col>
              </Row>
              <Row hidden={isLoading} className="vipTable-container">
                <table className="vipTable">
                  <thead hidden={windowSize.isMobile}>
                    <tr>
                      <th hidden={showOnlyEmailsDisplay || showOnlyPhonesDisplay}>Purchaser Name</th>
                      <th hidden={showOnlyEmailsDisplay || showOnlyPhonesDisplay}>Attendee Name</th>
                      <th hidden={showOnlyEmailsDisplay || showOnlyPhonesDisplay} className="purchase-date no-print">Purchase Date</th>
                      <th hidden={showOnlyEmailsDisplay || showOnlyPhonesDisplay}>Order Id</th>
                      <th hidden={showOnlyEmailsDisplay || showOnlyPhonesDisplay}>Order Status</th>
                      <th hidden={showOnlyEmailsDisplay || showOnlyPhonesDisplay}>Event Date</th>
                      <th hidden={showOnlyEmailsDisplay || showOnlyPhonesDisplay}>Event Name</th>
                      <th hidden={showOnlyEmailsDisplay || showOnlyPhonesDisplay}>Ticket Type</th>
                      <th hidden={showOnlyEmailsDisplay || showOnlyPhonesDisplay}># of tickets</th>
                      <th hidden={hideRevItem || showOnlyEmailsDisplay || showOnlyPhonesDisplay} className={revClass}>Revenue</th>
                      <th
                        className="no-print"
                        hidden={hideServiceFeeDisplay || !viewServiceFees || showOnlyEmailsDisplay || showOnlyPhonesDisplay}
                      >
                        Service Fees
                      </th>
                      <th hidden={showOnlyPhonesDisplay}>Email</th>
                      {hasPhoneData && !showOnlyEmailsDisplay ? <th>Phone #</th> : ''}
                      {hasShirtData && !(showOnlyEmailsDisplay || showOnlyPhonesDisplay) ? <th>Shirt Sizes</th> : ''}
                    </tr>
                  </thead>
                  <tbody>{orderRows}</tbody>
                </table>
              </Row>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

import {
  IShirtData,
  IShirtSizeData,
  ITicketData,
  ITicketTypeData,
  Order,
  TicketType,
  VipEvent,
} from '@/types/event';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button, FormCheck } from 'react-bootstrap';
import OrderRow from './orderRowComponent';
import { useGetLocation } from '@/hooks/common/useGetLocation';
import { useGetExport } from '@/hooks/common/useGetExport';
import downloadFile from '@/utils/downloadFile';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { CirclesWithBar } from 'react-loader-spinner';
import PrintButton from '../../common/printButtonComponent';
import { useGetEventDetails } from '@/hooks/order/useGetEventDetails';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  setEvents,
  setHideRevenue,
  setReloadEvents,
  setShowDeletedOrders,
  setShowInactiveOrders,
  setHideServiceFees,
  setFocusControl,
  setEventSeller,
  setCurrentDetailEvent,
} from '@/lib/reportSelectionSlice';
import getFileNameFromEvent from '@/utils/getFileNameFromEvent';
import { EnumPermission, User, UserReportSelection, UserSeller } from '@/types/user';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import OrderMobileRow from './orderMobileRowComponent';
import { useHasPermission } from '@/hooks/user/useHasPermission';
import debouce from 'lodash.debounce';
import setFocusToControl from '@/utils/setFocusToControl';
import { getTicketDataFromOrders } from '@/utils/getTicketDataFromOrders';
import { getShirtDataFromOrders } from '@/utils/getShirtDataFromOrders';
import { useGetUserSeller } from '@/hooks/order/useGetUserSeller';
import router from 'next/router';

export default function EventDetail(props: any) {
  const { getUser } = useCurrentUser();
  const [user, setUser] = useState<User | undefined>(undefined);
  const { userHasPermission } = useHasPermission();
  const { getLocation } = useGetLocation();
  const { exportEventCustomerDataToCsv } = useGetExport();
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
  const [checkChanged, setCheckChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getEventDetails } = useGetEventDetails();
  const { getUserSellerFromEventId } = useGetUserSeller();
  const dispatch = useDispatch();
  const [hideRevItem, setHideRevItem] = useState(true);
  const [hideServiceFeeDisplay, setHideServiceFeeDisplay] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const id: number | undefined = props.Id as number;

  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);

  const [viewInactiveOrders, setViewInactiveOrders] = useState(false);
  const [viewDeletedOrders, setViewDeletedOrders] = useState(false);
  const [viewServiceFees, setViewServiceFees] = useState(false);
  const [viewRevenueData, setViewRevenueData] = useState(false);
  const [viewRevenueControls, setViewRevenueControls] = useState(false);
  const [canExportCustomerData, setCanExportCustomerData] = useState(false);
  const [viewPrintButton, setViewPrintButton] = useState(false);
  const [changeOrderStatus, setChangeOrderStatus] = useState(false);
  const [canCheckInTickets, setCanCheckInTickets] = useState(false);
  const [alwaysShowRevenue, setAlwaysShowRevenue] = useState(false);

  const debouncedResults = useMemo(() => {
    return debouce(setSearchTerm, 300);
  }, []);

  let ticketData: ITicketData | undefined = undefined;
  let shirtData: IShirtData | undefined = undefined;
  let location = '';
  const hasPhoneData = currentReportSelection.currentDetailEvent?.hasPhoneData ?? false;
  let hasTicketData: boolean = false;
  let hasShirtData: boolean = false;
  const hasNonUsaOrders: boolean =
    currentReportSelection.currentDetailEvent?.hasNonUSAOrders ?? false;
  const currencySymbol: string | undefined =
    currentReportSelection.currentDetailEvent?.nonUsaCurrencySymbol;
  const ticketBreakdownRows: any[] = [];
  const shirtSizeBreakdownRows: any[] = [];
  let orderRows: any[] = [];
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
      setChangeOrderStatus(userHasPermission(user, EnumPermission.ChangeOrderStatus));
      setCanCheckInTickets(
        !user.disableCheckIn && userHasPermission(user, EnumPermission.CheckInUsers),
      );
      setAlwaysShowRevenue(vRevenueData && !vRevenueControls);

      if (!currentReportSelection.seller || currentReportSelection.seller.sellerId <= 0) {
        let reportSelection = { ...currentReportSelection };
        if (user?.selectedSellerId ?? 0 > 0) {
          // use cached user to transfer detail to redux in new window
          const seller = user.sellers.find((x) => x.sellerId == user.selectedSellerId);
          if (seller) {
            reportSelection.seller = seller;
            reportSelection.hideRevenue = user.selectedHideRevenue;
            reportSelection.hideServiceFees = user.selectedHideServiceFees;
            dispatch(setEventSeller(reportSelection));
          } else {
            // not found, log out
            router.push('/logout');
            return;
          }
        } else {
          // user is logged in without selected seller, check for permission to load
          const sellerResult = await getUserSellerFromEventId(id, user.userId);
          if (sellerResult && sellerResult.userSeller) {
            reportSelection.seller = sellerResult.userSeller;
            reportSelection.hideRevenue = user.selectedHideRevenue;
            reportSelection.hideServiceFees = user.selectedHideServiceFees;
            dispatch(setEventSeller(reportSelection));
          } else {
            // not found or no permission, log out
            router.push('/logout');
            return;
          }
        }
      } else if (currentReportSelection?.seller?.sellerId > 0) {
        if (alwaysShowRevenue) {
          setHideRevItem(false);
        } else if (!viewRevenueData) {
          setHideRevItem(true);
        } else {
          setHideRevItem(currentReportSelection.hideRevenue ?? true);
        }

        if (viewServiceFees) {
          setHideServiceFeeDisplay(currentReportSelection.hideServiceFees ?? true);
        } else {
          setHideServiceFeeDisplay(true);
        }

        if (currentReportSelection.reloadEvents) {
          setIsLoading(true);
          dispatch(setReloadEvents(false));
          let reportSelection: UserReportSelection = { ...currentReportSelection };
          if (!viewInactiveOrders) {
            reportSelection.showInactiveOrders = false;
          }
          const results = await getEventDetails(id);
          if (results && results.events && results.events.length > 0) {
            const newEvent: VipEvent = results.events[0];
            if (newEvent) {
              dispatch(setCurrentDetailEvent(newEvent));
              if (currentReportSelection.currentEvents) {
                document.title = newEvent.title;
                currentReportSelection.currentEvents.map((evt) => {
                  return evt.ticketSocketEventId == newEvent.ticketSocketEventId
                    ? newEvent
                    : evt;
                });
                dispatch(setEvents(currentReportSelection.currentEvents));
              }
            }
          }
          setIsLoading(false);
          if (
            currentReportSelection.focusControl &&
            currentReportSelection.focusControl != ''
          ) {
            const focusControl: string = currentReportSelection.focusControl;
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
    getEventDetails,
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
      const csvData = exportEventCustomerDataToCsv(
        currentReportSelection.currentDetailEvent,
        showServiceFees,
        showRevenueData,
        hasPhoneData,
        hasNonUsaOrders,
        currencySymbol,
      );
      const fileName = getFileNameFromEvent(
        currentReportSelection.currentDetailEvent,
        `orders`,
      );
      downloadFile(fileName, csvData);
    }
  };

  const filterOrders = (orders: Order[] | undefined) => {
    let filteredOrders: Order[] = [];
    visibleOrders = [];

    if (orders && orders.length > 0) {
      visibleOrders = orders.filter((order) => {
        return (
          (currentReportSelection.showDeletedOrders && order.isDeleted) ||
          (currentReportSelection.showInactiveOrders &&
            !order.isActive &&
            !order.isDeleted) ||
          (!order.isDeleted && order.isActive)
        );
      });
    }

    if (visibleOrders.length > 0 && searchTerm && searchTerm.length >= 2) {
      const srch = searchTerm.toLowerCase();
      filteredOrders = visibleOrders.filter((order) => {
        return (
          order.purchaserFirstName.toLowerCase().includes(srch) ||
          order.purchaserLastName.toLowerCase().includes(srch)
        );
      });
    } else {
      filteredOrders = visibleOrders;
    }
    return filteredOrders;
  };

  let filteredOrders: Order[] | undefined = undefined;
  let totalTickets = 0;
  if (currentReportSelection.currentDetailEvent != undefined) {
    if (
      windowSize.isMobile ||
      (currentReportSelection.currentDetailEvent.orders &&
        currentReportSelection.currentDetailEvent.orders.length > 10)
    ) {
      searchBarHidden = false;
    }
    if (currentReportSelection.currentDetailEvent.venue) {
      location = getLocation(currentReportSelection.currentDetailEvent.venue);
    }

    filteredOrders = filterOrders(currentReportSelection.currentDetailEvent.orders);
    filteredOrders?.forEach((order, i) => {
      if (order.isActive && !order.isDeleted) {
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
            ChangeOrderStatus={changeOrderStatus}
            HasPhoneData={hasPhoneData}
            HasShirtData={hasShirtData}
            HideRevenue={hideRevItem}
            HideServiceFees={hideServiceFeeDisplay}
            CanCheckInTickets={canCheckInTickets}
          />,
        );
      } else {
        orderRows.push(
          <OrderRow
            key={key}
            EventDate={currentReportSelection.currentDetailEvent?.eventDate}
            EventName={currentReportSelection.currentDetailEvent?.title}
            Order={order}
            ChangeOrderStatus={changeOrderStatus}
            HasPhoneData={hasPhoneData}
            HasShirtData={hasShirtData}
            HideRevenue={hideRevItem}
            HideServiceFees={hideServiceFeeDisplay}
            CanCheckInTickets={canCheckInTickets}
          />,
        );
      }
    });

    ticketData = getTicketDataFromOrders(
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
          var data = ticketTypeData.find(
            (x) => x.TicketType == ticketType.ticketTypeName,
          );
          var number = 0;
          var total = '';
          if (data) {
            number = data.Number;
          }
          if (ticketType.totalAvailable > 0) {
            total = `/${ticketType.totalAvailable}`;
          }
          ticketBreakdownRows.push(
            <div key={key}>
              {ticketType.ticketTypeName} ({number}
              {total})
            </div>,
          );
          i++;
        });
      });
    }
    shirtData = getShirtDataFromOrders(filteredOrders);
    const shirtSizes = shirtData?.ShirtSizes ?? [];
    let arr: any = [];
    if (shirtSizes.length > 0) {
      hasShirtData = true;
      shirtSizes.forEach((shirtSize: string) => {
        shirtData?.ShirtData?.forEach((shirSizeData: IShirtSizeData[], key: string) => {
          var data = shirSizeData.find((x) => x.ShirtSize == shirtSize);
          var number = arr[shirtSize] ?? 0;
          if (data) {
            number += data.Number;
          }
          arr[shirtSize] = number;
        });
      });
      let i = 0;
      for (const shirtSize of shirtSizes) {
        const key = `ssw${i}`;
        shirtSizeBreakdownRows.push(
          <div key={key}>
            {shirtSize} ({arr[shirtSize]})
          </div>,
        );
        i++;
      }
    }
  }

  const handleShowInactive = async (event: ChangeEvent<HTMLInputElement>) => {
    if (currentReportSelection) {
      dispatch(setShowInactiveOrders(event.target.checked));
    }
  };

  const handleShowDeleted = async (event: ChangeEvent<HTMLInputElement>) => {
    if (currentReportSelection) {
      dispatch(setShowDeletedOrders(event.target.checked));
    }
  };

  const handleHideRevenue = async (event: ChangeEvent<HTMLInputElement>) => {
    if (currentReportSelection) {
      dispatch(setHideRevenue(event.target.checked));
      setCheckChanged(!checkChanged);
    }
  };

  const handleHideServiceFees = async (event: ChangeEvent<HTMLInputElement>) => {
    if (currentReportSelection) {
      dispatch(setHideServiceFees(event.target.checked));
      setCheckChanged(!checkChanged);
    }
  };

  return (
    <>
      {currentReportSelection.currentDetailEvent != undefined ? (
        <Container fluid className="vipContainer">
          <Row>
            <Col>
              <Row>
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
                        {currentReportSelection.currentDetailEvent.venue?.name} in{' '}
                        {location}
                      </td>
                    </tr>
                    <tr>
                      <td className="vipLabel">Date:</td>
                      <td>
                        {moment(
                          currentReportSelection.currentDetailEvent.eventDate,
                        ).format('MM/DD/YYYY')}
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
                    <tr hidden={hideRevItem}>
                      <td className="vipLabel">Total Revenue:</td>
                      <td>
                        $
                        {currentReportSelection.currentDetailEvent.totalRevenue?.toFixed(
                          2,
                        )}
                      </td>
                    </tr>
                    <tr hidden={hideServiceFeeDisplay || !viewServiceFees}>
                      <td className="vipLabel">Total Service Fees:</td>
                      <td>
                        $
                        {currentReportSelection.currentDetailEvent.totalServiceFees?.toFixed(
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
              </Row>
              <Row hidden={!isLoading}>
                <Col className="spinner-container" hidden={!isLoading}>
                  <CirclesWithBar
                    height="100"
                    width="100"
                    color="#d12610"
                    visible={isLoading}
                  />
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
                </Col>
                <Col md={10} sm={12} className="no-print" hidden={searchBarHidden}>
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control search-text-input"
                    placeholder="Search for orders..."
                    hidden={isLoading || !orderRows || orderRows.length == 0}
                  />
                </Col>
              </Row>
              <Row hidden={isLoading} className="vipTable-container">
                <table className="vipTable">
                  <thead hidden={windowSize.isMobile}>
                    <tr>
                      <th>Purchaser Name</th>
                      <th>Attendee Name</th>
                      <th className="purchase-date no-print">Purchase Date</th>
                      <th>Event Date</th>
                      <th>Event Name</th>
                      <th>Ticket Type</th>
                      <th># of tickets</th>
                      <th hidden={hideRevItem}>Revenue</th>
                      <th
                        className="no-print"
                        hidden={hideServiceFeeDisplay || !viewServiceFees}
                      >
                        Service Fees
                      </th>
                      <th>Email</th>
                      {hasPhoneData ? <th>Phone #</th> : ''}
                      {hasShirtData ? <th>Shirt Sizes</th> : ''}
                    </tr>
                  </thead>
                  <tbody>{orderRows}</tbody>
                </table>
              </Row>
            </Col>
          </Row>
        </Container>
      ) : (
        ''
      )}
    </>
  );
}

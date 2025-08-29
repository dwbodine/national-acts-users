"use client";

import { Button, Col, Row } from 'react-bootstrap';
import { exportCustomerDataToCsv, exportEventsToCsv } from '@/utils/eventUtils';
import {
  resetSelection,
  setDateRange,
  setReloadEvents,
  setSelectedTourId,
} from '@/lib/reportSelectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import DateRangeSelector from '../../common/dateRangeSelectorComponent';
import DeletedCheck from './deletedCheckComponent';
import { EnumPermission } from '@/types/user';
import { GetEventsResponse } from '@/types/responses';
import HiddenCheck from './hiddenCheckComponent';
import InactiveCheck from './inactiveCheckComponent';
import { ItemDataType } from 'rsuite/esm/internals/types';
import PrintButton from '../../common/printButtonComponent';
import ResetButton from '../../common/resetButtonComponent';
import RevenueCheck from './revenueCheckComponent';
import type { RootState } from '../../../lib/store';
import { SelectPicker } from 'rsuite';
import SelectSeller from './selectSellerComponent';
import ServiceFeesCheck from './serviceFeesCheckComponent';
import VIPItineraryModal from './vipItineraryModalComponent';
import { downloadCsvFile } from '@/utils/downloadFile';
import { getCsvFileNameFromReportSelection } from '@/utils/getFileNameFromReportSelection';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useGetAllEvents } from '@/hooks/event/useGetAllEvents';
import { useHasPermission } from '@/hooks/user/useHasPermission';
import { useWindowSize } from '@/hooks/common/useWindowSize';

export default function SalesBar() {
  const webBaseUrl = `${process.env.NEXT_PUBLIC_WWW_URL}/`;
  const dispatch = useDispatch();
  const { getUser } = useCurrentUser();
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);
  const { userHasPermission } = useHasPermission();
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
  const hasEvents = (currentReportSelection?.currentEvents?.length ?? 0) > 0;
  const dateRangeTitle = 'Event date range';
  const { getAllEvents } = useGetAllEvents();

  const [viewInactiveEvents, setViewInactiveEvents] = useState(false);
  const [viewDeletedEvents, setViewDeletedEvents] = useState(false);
  const [viewServiceFees, setViewServiceFees] = useState(false);
  const [viewRevenueControls, setViewRevenueControls] = useState(false);
  const [canExportData, setCanExportData] = useState(false);
  const [canExportCustomerData, setCanExportCustomerData] = useState(false);
  const [viewPrintButton, setViewPrintButton] = useState(false);
  const [viewRevenueData, setViewRevenueData] = useState(false);
  const [viewHiddenEvents, setViewHiddenEvents] = useState(false);
  const [viewTourSelect, setViewTourSelect] = useState(false);
  const [viewVIPItinerary, setViewVIPItinerary] = useState(false);
  const [vipItineraryOpen, setVipItineraryOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sellerHomePage, setSellerHomePage] = useState('');

  const handleItineraryClose = () => setVipItineraryOpen(false);

  const exportEventData = () => {
    if (
      currentReportSelection &&
      currentReportSelection.start &&
      currentReportSelection.end &&
      currentReportSelection.seller &&
      currentReportSelection.seller.sellerId > 0
    ) {
      dispatch(setIsLoading(true));
      getAllEvents(0, 0, currentReportSelection.seller.sellerId).then(
        (response: GetEventsResponse) => {
          if (response && !response.error && response.events !== undefined) {
            const showServiceFees =
              viewServiceFees && !currentReportSelection.hideServiceFees;
            const showRevenueData =
              viewRevenueData && !currentReportSelection.hideRevenue;
            const csvData = exportEventsToCsv(
              response.events,
              showServiceFees,
              showRevenueData,
            );
            const fileName = getCsvFileNameFromReportSelection(currentReportSelection);
            downloadCsvFile(fileName, csvData);
          }
          dispatch(setIsLoading(false));
        },
      );
    }
  };

  const exportCustomerData = () => {
    if (
      currentReportSelection &&
      currentReportSelection.start &&
      currentReportSelection.end &&
      currentReportSelection.seller &&
      currentReportSelection.seller.sellerId > 0
    ) {
      dispatch(setIsLoading(true));
      getAllEvents(0, 0, currentReportSelection.seller.sellerId).then(
        (response: GetEventsResponse) => {
          if (response && !response.error && response.events !== undefined) {
            const vipEvents = response.events;
            const hasPhoneData =
              vipEvents.find((x) => x.hasPhoneData === true) !== undefined;
            const hasShirtData =
              vipEvents.find((x) => x.hasShirtData === true) !== undefined;
            const hasNonUsaOrders =
              vipEvents.find((x) => x.hasNonUSAOrders === true) !== undefined;
            let currencySymbol: string | undefined = undefined;
            if (hasNonUsaOrders) {
              const symbolOrder = vipEvents.find((x) => x.hasNonUSAOrders === true);
              if (symbolOrder !== undefined) {
                currencySymbol = symbolOrder.nonUsaCurrencySymbol;
              }
            }
            const showServiceFees =
              viewServiceFees && !currentReportSelection.hideServiceFees;
            const showRevenueData =
              viewRevenueData && !currentReportSelection.hideRevenue;
            const csvData = exportCustomerDataToCsv(
              response.events,
              showServiceFees,
              showRevenueData,
              hasPhoneData,
              hasShirtData,
              hasNonUsaOrders,
              currencySymbol,
            );
            const fileName = getCsvFileNameFromReportSelection(
              currentReportSelection,
              'customer',
            );
            downloadCsvFile(fileName, csvData);
          }
          dispatch(setIsLoading(false));
        },
      );
    }
  };

  let pageTitle: string = 'Sales Overview';
  if (currentReportSelection.seller.sellerId > 0) {
    pageTitle += ` - ${currentReportSelection.seller.sellerName}`;
  }

  const onDateChange = (selectedStart: number, selectedEnd: number) => {
    const reportSelection = { ...currentReportSelection };
    reportSelection.start = selectedStart;
    reportSelection.end = selectedEnd;
    reportSelection.retainDateSelection = true;
    dispatch(setDateRange(reportSelection));
    dispatch(setReloadEvents(true));
    dispatch(setIsLoading(true));
  };

  const onResetClick = () => {
    dispatch(setIsLoading(true));
    dispatch(resetSelection());
  };

  const setSelectedTour = (selectedTourId: number | null) => {
    let stId: number | null = null;
    if (selectedTourId && selectedTourId > 0) {
      stId = selectedTourId;
    }
    dispatch(setSelectedTourId(stId ? stId : undefined));
    dispatch(setReloadEvents(true));
    dispatch(setIsLoading(true));
  };

  let tourList: ItemDataType<number>[] = [];
  if (currentReportSelection.tours && currentReportSelection.tours.length > 0) {
    const activeTours = currentReportSelection.tours.filter(x => x.isActive);
    if (activeTours && activeTours.length > 0) {
      tourList = activeTours.map(tour =>
      ({
        label: `${tour.tourName}`,
        value: tour.tourId
      })
      );
    }
  }

  const selectedTourId = (currentReportSelection?.selectedTourId ?? 0);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setIsAdmin(user.isAdmin);
      setViewInactiveEvents(userHasPermission(user, EnumPermission.ViewInactiveEvents));
      setViewDeletedEvents(userHasPermission(user, EnumPermission.ViewDeletedEvents));
      setViewServiceFees(userHasPermission(user, EnumPermission.ViewServiceFees));
      setViewRevenueControls(userHasPermission(user, EnumPermission.ViewRevenueControls));
      setCanExportData(userHasPermission(user, EnumPermission.ExportData));
      setCanExportCustomerData(
        userHasPermission(user, EnumPermission.ExportCustomerData),
      );
      setViewPrintButton(userHasPermission(user, EnumPermission.ViewPrintButton));
      setViewRevenueData(userHasPermission(user, EnumPermission.ViewRevenueData));
      setViewHiddenEvents(userHasPermission(user, EnumPermission.ViewHiddenEvents));
      setViewTourSelect(userHasPermission(user, EnumPermission.ViewTourSelect));
      setViewVIPItinerary(userHasPermission(user, EnumPermission.ViewVIPItinerary));
      if (currentReportSelection.seller && currentReportSelection.seller.sellerId > 0) {
        const userSeller = user.sellers?.find(x => x.sellerId === currentReportSelection.seller.sellerId);
        if (userSeller) {
          const route = userSeller.routes?.[0];
          if (route) {
            setSellerHomePage(`${webBaseUrl}${route}`);
          }
        }
      }
    }
  }, [windowSizeJson, getUser, userHasPermission, currentReportSelection.seller, webBaseUrl]);
  return (
    <>
      <Row className="page-header">
        <Col sm={6} xs={12} className="title-container">
          <div className="title">{pageTitle}</div>
        </Col>
        <Col sm={6} xs={12} className="control-container no-print">
          <DateRangeSelector
            DateRangeTitle={dateRangeTitle}
            SelectedStart={currentReportSelection?.start}
            SelectedEnd={currentReportSelection?.end}
            Disabled={currentReportSelection.seller.sellerId <= 0 || !hasEvents}
            OnDateChange={onDateChange}
          />
        </Col>
      </Row>
      <SelectSeller />
      <Row className="no-print admin-tour-row" hidden={!viewTourSelect || tourList.length === 0}>
        <Col xs={1}>
          Tour:
        </Col>
        <Col sm={11} md={5}>
          <SelectPicker
            value={selectedTourId}
            data={tourList}
            size="lg"
            onChange={(tId) => setSelectedTour(tId)}
            cleanable={true}
            placeholder="All Events"
            menuAutoWidth={true}
            className="admin-seller-select-value"
            onClean={() => setSelectedTour(0)}
          />
        </Col>
      </Row>
      <Row className="admin-check-row no-print">
        <Col md={10} sm={12}>
          {viewInactiveEvents && currentReportSelection.seller.sellerId > 0 && (currentReportSelection.selectedTourId ?? 0) === 0 ? (
            <InactiveCheck />
          ) : (
            ''
          )}
          {viewDeletedEvents && currentReportSelection.seller.sellerId > 0 && (currentReportSelection.selectedTourId ?? 0) === 0 ? (
            <DeletedCheck />
          ) : (
            ''
          )}
          {viewHiddenEvents && currentReportSelection.seller.sellerId > 0 && (currentReportSelection.selectedTourId ?? 0) === 0 ? (
            <HiddenCheck />
          ) : (
            ''
          )}
          {viewRevenueControls &&
            currentReportSelection.seller.sellerId > 0 &&
            hasEvents ? (
            <RevenueCheck />
          ) : (
            ''
          )}
          {viewServiceFees && currentReportSelection.seller.sellerId > 0 && hasEvents ? (
            <ServiceFeesCheck />
          ) : (
            ''
          )}
        </Col>
      </Row>
      <Row
        className="no-print admin-button-row"
        hidden={currentReportSelection.seller.sellerId <= 0}
      >
        <Col md={10} sm={12}>
          {currentReportSelection.seller.sellerId > 0 ? (
            <ResetButton
              IsDisabled={currentReportSelection.seller.sellerId <= 0}
              OnResetClick={onResetClick}
            />
          ) : (
            ''
          )}
          {!windowSize.isMobile &&
            viewPrintButton &&
            currentReportSelection.seller.sellerId > 0 &&
            hasEvents ? (
            <PrintButton />
          ) : (
            ''
          )}
          {!windowSize.isMobile &&
            canExportData &&
            currentReportSelection.seller.sellerId > 0 &&
            hasEvents ? (
            <span className="admin-button">
              <Button onClick={exportEventData}>Export Summary</Button>
            </span>
          ) : (
            ''
          )}
          {!windowSize.isMobile &&
            canExportCustomerData &&
            currentReportSelection.seller.sellerId > 0 &&
            hasEvents ? (
            <span className="admin-button">
              <Button onClick={exportCustomerData}>Export Customer Data</Button>
            </span>
          ) : (
            ''
          )}
          {!windowSize.isMobile &&
            viewVIPItinerary &&
            currentReportSelection.seller.sellerId > 0 &&
            !currentReportSelection.showInactive && 
            hasEvents ? (
            <>
              <span className="admin-button">
                <Button onClick={() => setVipItineraryOpen(true)}>Event Itinerary</Button>
              </span>
              <VIPItineraryModal
                IsAdmin={isAdmin}
                IsOpen={vipItineraryOpen}
                Seller={currentReportSelection.seller}
                Events={currentReportSelection.currentEvents}
                OnClose={handleItineraryClose}
                SellerHomePage={sellerHomePage}
              />
            </>
          ) : (
            ''
          )}
        </Col>
      </Row>
    </>
  );
}

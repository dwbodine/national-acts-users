'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Row, SelectPicker } from 'rsuite';
import { ItemDataType } from 'rsuite/esm/internals/types';

import PageHeader from '@/components/common/PageHeaderComponent';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import { useGetAllEvents } from '@/hooks/event/useGetAllEvents';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useHasPermission } from '@/hooks/user/useHasPermission';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import {
  resetSelection,
  setDateRange,
  setReloadEvents,
  setSelectedTourId,
} from '@/lib/reportSelectionSlice';
import { GetEventsResponse } from '@/types/responses';
import { EnumPermission } from '@/types/user';
import { downloadCsvFile } from '@/utils/downloadFile';
import { exportCustomerDataToCsv, exportEventsToCsv } from '@/utils/eventUtils';
import { getCsvFileNameFromReportSelection } from '@/utils/getFileNameFromReportSelection';

import type { RootState } from '../../../lib/store';
import PrintButton from '../../common/printButtonComponent';
import ResetButton from '../../common/resetButtonComponent';
import DeletedCheck from './deletedCheckComponent';
import HiddenCheck from './hiddenCheckComponent';
import InactiveCheck from './inactiveCheckComponent';
import RevenueCheck from './revenueCheckComponent';
import SelectSeller from './selectSellerComponent';
import ServiceFeesCheck from './serviceFeesCheckComponent';
import VIPItineraryModal from './vipItineraryModalComponent';

export default function SalesBar() {
  const webBaseUrl = `${process.env['NEXT_PUBLIC_WWW_URL']}/`;
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
      void getAllEvents(0, 0, currentReportSelection.seller.sellerId).then(
        (response: GetEventsResponse) => {
          if (response && !response.error && response.events !== undefined) {
            const showServiceFees = viewServiceFees && !currentReportSelection.hideServiceFees;
            const showRevenueData = viewRevenueData && !currentReportSelection.hideRevenue;
            const csvData = exportEventsToCsv(response.events, showServiceFees, showRevenueData);
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
      void getAllEvents(0, 0, currentReportSelection.seller.sellerId).then(
        (response: GetEventsResponse) => {
          if (response && !response.error && response.events !== undefined) {
            const vipEvents = response.events;
            const hasPhoneData = vipEvents.find((x) => x.hasPhoneData === true) !== undefined;
            const hasShirtData = vipEvents.find((x) => x.hasShirtData === true) !== undefined;
            const hasNonUsaOrders = vipEvents.find((x) => x.hasNonUsaOrders === true) !== undefined;
            let currencySymbol: string | undefined = undefined;
            if (hasNonUsaOrders) {
              const symbolOrder = vipEvents.find((x) => x.hasNonUsaOrders === true);
              if (symbolOrder !== undefined) {
                currencySymbol = symbolOrder.nonUsaCurrencySymbol;
              }
            }
            const showServiceFees = viewServiceFees && !currentReportSelection.hideServiceFees;
            const showRevenueData = viewRevenueData && !currentReportSelection.hideRevenue;
            const csvData = exportCustomerDataToCsv(
              response.events,
              showServiceFees,
              showRevenueData,
              hasPhoneData,
              hasShirtData,
              hasNonUsaOrders,
              currencySymbol,
            );
            const fileName = getCsvFileNameFromReportSelection(currentReportSelection, 'customer');
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
    reportSelection.retainDateSelection = selectedStart > 0 && selectedEnd > 0;
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
    const reportSelection = { ...currentReportSelection };
    reportSelection.start = 0;
    reportSelection.end = 0;
    reportSelection.retainDateSelection = false;
    dispatch(setDateRange(reportSelection));
    dispatch(setReloadEvents(true));
    dispatch(setIsLoading(true));
  };

  let tourList: ItemDataType<number>[] = [];
  if (currentReportSelection.tours && currentReportSelection.tours.length > 0) {
    const activeTours = currentReportSelection.tours.filter((x) => x.isActive);
    if (activeTours && activeTours.length > 0) {
      tourList = activeTours.map((tour) => ({
        label: `${tour.tourName}`,
        value: tour.tourId,
      }));
    }
  }

  const selectedTourId = currentReportSelection?.selectedTourId ?? 0;

  useEffect(() => {
    const user = getUser();
    if (user) {
      setIsAdmin(user.isAdmin);
      setViewInactiveEvents(userHasPermission(user, EnumPermission.ViewInactiveEvents));
      setViewDeletedEvents(userHasPermission(user, EnumPermission.ViewDeletedEvents));
      setViewServiceFees(userHasPermission(user, EnumPermission.ViewServiceFees));
      setViewRevenueControls(userHasPermission(user, EnumPermission.ViewRevenueControls));
      setCanExportData(userHasPermission(user, EnumPermission.ExportData));
      setCanExportCustomerData(userHasPermission(user, EnumPermission.ExportCustomerData));
      setViewPrintButton(userHasPermission(user, EnumPermission.ViewPrintButton));
      setViewRevenueData(userHasPermission(user, EnumPermission.ViewRevenueData));
      setViewHiddenEvents(userHasPermission(user, EnumPermission.ViewHiddenEvents));
      setViewTourSelect(userHasPermission(user, EnumPermission.ViewTourSelect));
      setViewVIPItinerary(userHasPermission(user, EnumPermission.ViewVIPItinerary));
      if (currentReportSelection.seller && currentReportSelection.seller.sellerId > 0) {
        const userSeller = user.sellers?.find(
          (x) => x.sellerId === currentReportSelection.seller.sellerId,
        );
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
      <PageHeader
        pageTitle={pageTitle}
        dateRangeTitle={dateRangeTitle}
        dateRangeStart={currentReportSelection?.start}
        dateRangeEnd={currentReportSelection?.end}
        dateRangeDisabled={currentReportSelection.seller.sellerId <= 0 || !hasEvents}
        showDateRange={true}
        onDateRangeChange={onDateChange}
      />
      <SelectSeller />
      <Row className="no-print admin-tour-row" hidden={!viewTourSelect || tourList.length === 0}>
        <Col xs={2} className="admin-tour-select-title">
          Tour:
        </Col>
        <Col sm={22} md={10}>
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
        <Col xs={12} sm={12} md={8} lg={6} xl={6} xxl={4}>
          {viewInactiveEvents &&
          currentReportSelection.seller.sellerId > 0 &&
          (currentReportSelection.selectedTourId ?? 0) === 0 ? (
            <InactiveCheck />
          ) : (
            ''
          )}
        </Col>
        <Col xs={12} sm={12} md={8} lg={6} xl={6} xxl={4}>
          {viewDeletedEvents &&
          currentReportSelection.seller.sellerId > 0 &&
          (currentReportSelection.selectedTourId ?? 0) === 0 ? (
            <DeletedCheck />
          ) : (
            ''
          )}
        </Col>
        <Col xs={12} sm={12} md={8} lg={6} xl={6} xxl={4}>
          {viewHiddenEvents &&
          currentReportSelection.seller.sellerId > 0 &&
          (currentReportSelection.selectedTourId ?? 0) === 0 ? (
            <HiddenCheck />
          ) : (
            ''
          )}
        </Col>
        <Col xs={12} sm={12} md={8} lg={6} xl={6} xxl={4}>
          {viewRevenueControls && currentReportSelection.seller.sellerId > 0 && hasEvents ? (
            <RevenueCheck />
          ) : (
            ''
          )}
        </Col>
        <Col xs={12} sm={12} md={8} lg={6} xl={6} xxl={4}>
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
        <Col md={20} sm={24}>
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

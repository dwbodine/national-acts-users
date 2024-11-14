import SelectSeller from './selectSellerComponent';
import DateRangeSelector from '../../common/dateRangeSelectorComponent';
import InactiveCheck from './inactiveCheckComponent';
import DeletedCheck from './deletedCheckComponent';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../src/lib/store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ResetButton from '../../common/resetButtonComponent';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { Button } from 'react-bootstrap';
import { useGetExport } from '@/hooks/common/useGetExport';
import getFileNameFromReportSelection from '@/utils/getFileNameFromReportSelection';
import downloadFile from '@/utils/downloadFile';
import PrintButton from '../../common/printButtonComponent';
import RevenueCheck from './revenueCheckComponent';
import {
  resetSelection,
  setDateRange,
  setReloadEvents,
} from '@/lib/reportSelectionSlice';
import { EnumPermission } from '@/types/user';
import ServiceFeesCheck from './serviceFeesCheckComponent';
import { useEffect, useState } from 'react';
import { useHasPermission } from '@/hooks/user/useHasPermission';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import HiddenCheck from './hiddenCheckComponent';
import { useGetAllEvents } from '@/hooks/event/useGetAllEvents';
import { GetEventsResponse } from '@/types/event';
import { setIsLoading } from '@/lib/globalSelectionSlice';

export default function SalesBar() {
  const dispatch = useDispatch();
  const { getUser } = useCurrentUser();
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);
  const { userHasPermission } = useHasPermission();
  const { exportEventsToCsv, exportCustomerDataToCsv } = useGetExport();
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
  const hasEvents = currentReportSelection?.currentEvents?.length ?? 0 > 0;
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

  const exportEventData = () => {
    if (
      currentReportSelection &&
      currentReportSelection.start &&
      currentReportSelection.end &&
      currentReportSelection.seller &&
      currentReportSelection.seller.sellerId > 0
    ) {
      getAllEvents(0, 0, currentReportSelection.seller.sellerId).then(
        (response: GetEventsResponse) => {
          if (response && !response.eventError && response.events != undefined) {
            const showServiceFees =
              viewServiceFees && !currentReportSelection.hideServiceFees;
            const showRevenueData =
              viewRevenueData && !currentReportSelection.hideRevenue;
            const csvData = exportEventsToCsv(
              response.events,
              showServiceFees,
              showRevenueData,
            );
            const fileName = getFileNameFromReportSelection(currentReportSelection);
            downloadFile(fileName, csvData);
          }
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
      getAllEvents(0, 0, currentReportSelection.seller.sellerId).then(
        (response: GetEventsResponse) => {
          if (response && !response.eventError && response.events != undefined) {
            const vipEvents = response.events;
            const hasPhoneData =
              vipEvents.find((x) => x.hasPhoneData == true) != undefined;
            const hasShirtData =
              vipEvents.find((x) => x.hasShirtData == true) != undefined;
            const hasNonUsaOrders =
              vipEvents.find((x) => x.hasNonUSAOrders == true) != undefined;
            let currencySymbol: string | undefined = undefined;
            let currencyAbbrev: string | undefined = undefined;
            if (hasNonUsaOrders) {
              const symbolOrder = vipEvents.find((x) => x.hasNonUSAOrders == true);
              if (symbolOrder != undefined) {
                currencySymbol = symbolOrder.nonUsaCurrencySymbol;
                currencyAbbrev = symbolOrder.nonUsaCurrencyAbbrev;
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
            const fileName = getFileNameFromReportSelection(
              currentReportSelection,
              'customer',
            );
            downloadFile(fileName, csvData);
          }
        },
      );
    }
  };

  let pageTitle: string = 'Sales Overview';
  if (currentReportSelection.seller.sellerId > 0) {
    pageTitle += ' - ' + currentReportSelection.seller.sellerName;
  }

  const onDateChange = (selectedStart: number, selectedEnd: number) => {
    let reportSelection = { ...currentReportSelection };
    reportSelection.start = selectedStart;
    reportSelection.end = selectedEnd;
    reportSelection.retainDateSelection = true;
    dispatch(setIsLoading(true));
    dispatch(setDateRange(reportSelection));
    dispatch(setReloadEvents(true));
  };

  const onResetClick = () => {
    dispatch(setIsLoading(true));
    dispatch(resetSelection());
  };

  useEffect(() => {
    const user = getUser();
    if (user) {
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
    }
  }, [windowSizeJson, getUser, userHasPermission]);
  return (
    <>
      <Row className="page-header">
        <Col sm={6} xs={12} className="title-container">
          <div className="title">{pageTitle}</div>
        </Col>
        <Col sm={6} xs={12} className="control-container no-print">
          <DateRangeSelector
            dateRangeTitle={dateRangeTitle}
            selectedStart={currentReportSelection?.start}
            selectedEnd={currentReportSelection?.end}
            disabled={currentReportSelection.seller.sellerId <= 0 || !hasEvents}
            onDateChange={onDateChange}
          />
        </Col>
      </Row>
      <Row className="no-print admin-seller-row">
        <Col>
          <SelectSeller />
        </Col>
      </Row>
      <Row className="admin-check-row">
        <Col md={10} sm={12}>
          {viewInactiveEvents && currentReportSelection.seller.sellerId > 0 ? (
            <InactiveCheck />
          ) : (
            ''
          )}
          {viewDeletedEvents && currentReportSelection.seller.sellerId > 0 ? (
            <DeletedCheck />
          ) : (
            ''
          )}
          {viewHiddenEvents && currentReportSelection.seller.sellerId > 0 ? (
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
        </Col>
      </Row>
    </>
  );
}

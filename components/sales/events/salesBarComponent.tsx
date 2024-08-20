
import SelectSeller from "./selectSellerComponent";
import DateRangeSelector from "../../common/dateRangeSelectorComponent";
import InactiveCheck from "./inactiveCheckComponent";
import DeletedCheck from "./deletedCheckComponent";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from '../../../src/lib/store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ResetButton from "../../common/resetButtonComponent";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "react-bootstrap";
import { useGetExport } from "@/hooks/useGetExport";
import getFileNameFromReportSelection from "@/utils/getFileNameFromReportSelection";
import downloadFile from "@/utils/downloadFile";
import PrintButton from "../../common/printButtonComponent";
import RevenueCheck from "./revenueCheckComponent";
import { resetSelection, setDateRange, setReloadEvents } from "@/lib/reportSelectionSlice";
import { EnumPermission } from "@/types/user";
import ServiceFeesCheck from "./serviceFeesCheckComponent";
import { useEffect } from "react";
import { useHasPermission } from "@/hooks/useHasPermission";
import { useWindowSize } from '@/hooks/useWindowSize';

export default function SalesBar() {    
    const dispatch = useDispatch(); 
    const { user } = useCurrentUser();
    const windowSize = useWindowSize();
    const windowSizeJson = JSON.stringify(windowSize);
    const { userHasPermission } = useHasPermission();
    const { exportEventsToCsv, exportCustomerDataToCsv } = useGetExport();
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
    const hasEvents = (currentReportSelection?.currentEvents?.length ?? 0 > 0);
    const dateRangeTitle = "Event date range";

    const viewInactiveEvents = userHasPermission(user, EnumPermission.ViewInactiveEvents);
    const viewDeletedEvents = userHasPermission(user, EnumPermission.ViewDeletedEvents);
    const viewServiceFees = userHasPermission(user, EnumPermission.ViewServiceFees);
    const viewRevenueControls = userHasPermission(user, EnumPermission.ViewRevenueControls);
    const canExportData = userHasPermission(user, EnumPermission.ExportData);
    const canExportCustomerData = userHasPermission(user, EnumPermission.ExportCustomerData);
    const viewPrintButton = userHasPermission(user, EnumPermission.ViewPrintButton);
    const viewRevenueData = userHasPermission(user, EnumPermission.ViewRevenueData);

    const exportEventData = () => {
        if (currentReportSelection && currentReportSelection.currentEvents) {
            const showServiceFees = viewServiceFees && !currentReportSelection.hideServiceFees;
            const showRevenueData = viewRevenueData && !currentReportSelection.hideRevenue;
            const csvData = exportEventsToCsv(currentReportSelection.currentEvents, showServiceFees, showRevenueData);
            const fileName = getFileNameFromReportSelection(currentReportSelection);
            downloadFile(fileName, csvData);
        }        
    };

    const exportCustomerData = () => {
        if (currentReportSelection && currentReportSelection.currentEvents) {
            const vipEvents = currentReportSelection.currentEvents;
            const hasPhoneData = (vipEvents.find(x => x.hasPhoneData == true) != undefined);
            const hasShirtData = (vipEvents.find(x => x.hasShirtData == true) != undefined);
            const hasNonUsaOrders = (vipEvents.find(x => x.hasNonUSAOrders == true) != undefined);
            let currencySymbol: string | undefined = undefined;
            let currencyAbbrev: string | undefined = undefined;
            if (hasNonUsaOrders) {
                const symbolOrder = vipEvents.find(x => x.hasNonUSAOrders == true);
                if (symbolOrder != undefined) {
                    currencySymbol = symbolOrder.nonUsaCurrencySymbol;
                    currencyAbbrev = symbolOrder.nonUsaCurrencyAbbrev;
                }
            }
            const showServiceFees = viewServiceFees && !currentReportSelection.hideServiceFees;
            const showRevenueData = viewRevenueData && !currentReportSelection.hideRevenue;
            const csvData = exportCustomerDataToCsv(currentReportSelection.currentEvents, showServiceFees, showRevenueData, hasPhoneData, hasShirtData, hasNonUsaOrders, currencySymbol, currencyAbbrev);
            const fileName = getFileNameFromReportSelection(currentReportSelection, 'customer');
            downloadFile(fileName, csvData);
        } 
    };

    let pageTitle: string = "Sales Overview";
    if (currentReportSelection.seller.sellerId > 0) {
        pageTitle += " - " + currentReportSelection.seller.sellerName;
    }

    const onDateChange = (selectedStart: number, selectedEnd: number) => {
        let reportSelection = { ...currentReportSelection};
        reportSelection.start = selectedStart;
        reportSelection.end = selectedEnd;
        reportSelection.retainDateSelection = true;
        dispatch(setDateRange(reportSelection));
        dispatch(setReloadEvents(true));
    }

    const onResetClick = () => {
        dispatch(
            resetSelection()
        );
    }
    
    useEffect(() => {
        // blank
    }, [windowSizeJson])
    return (
        <>
            <Row className="page-header">
                <Col sm={6} xs={12} className="title-container">
                    <div className="title">{pageTitle}</div>
                </Col>
                <Col sm={6} xs={12} className="control-container no-print">
                    <DateRangeSelector dateRangeTitle={dateRangeTitle} selectedStart={currentReportSelection?.start} selectedEnd={currentReportSelection?.end} disabled={(currentReportSelection.seller.sellerId <= 0 || !hasEvents)} onDateChange={onDateChange} />
                </Col>
            </Row>
            <Row className="no-print admin-seller-row">
                <Col>
                    <SelectSeller />
                </Col>
            </Row>
            <Row className="admin-check-row">
                <Col md={10} sm={12}>
                    {viewInactiveEvents && currentReportSelection.seller.sellerId > 0 ? <InactiveCheck /> : ''}
                    {viewDeletedEvents && currentReportSelection.seller.sellerId > 0 ? <DeletedCheck /> : ''}    
                    {viewRevenueControls && currentReportSelection.seller.sellerId > 0 && hasEvents ? <RevenueCheck /> : ''}    
                    {viewServiceFees && currentReportSelection.seller.sellerId > 0 && hasEvents ? <ServiceFeesCheck /> : ''} 
                </Col>
            </Row>            
            <Row className="no-print admin-button-row" hidden={currentReportSelection.seller.sellerId <= 0}>
                <Col md={10} sm={12}>
                    {currentReportSelection.seller.sellerId > 0 ? <ResetButton IsDisabled={(currentReportSelection.seller.sellerId <= 0)} OnResetClick={onResetClick} /> : ''}
                    {(!windowSize.isMobile && viewPrintButton && currentReportSelection.seller.sellerId > 0 && hasEvents) ? <PrintButton /> : ''}                    
                    {(!windowSize.isMobile && canExportData && currentReportSelection.seller.sellerId > 0 && hasEvents) ? <span className="admin-button"><Button onClick={exportEventData}>Export Summary</Button></span> : ''}
                    {(!windowSize.isMobile && canExportCustomerData && currentReportSelection.seller.sellerId > 0 && hasEvents) ? <span className="admin-button"><Button onClick={exportCustomerData}>Export Customer Data</Button></span> : ''}                    
                </Col>
            </Row>
        </>           
    );
}
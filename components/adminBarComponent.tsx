
import SelectSeller from "../components/selectSellerComponent";
import DateRangeSelector from "../components/dateRangeSelectorComponent";
import InactiveCheck from "../components/inactiveCheckComponent";
import DeletedCheck from "../components/deletedCheckComponent";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from '../src/lib/store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ResetButton from "./resetButtonComponent";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "react-bootstrap";
import { useGetExport } from "@/hooks/useGetExport";
import getFileNameFromReportSelection from "@/utils/getFileNameFromReportSelection";
import downloadFile from "@/utils/downloadFile";
import PrintButton from "./printButtonComponent";
import RevenueCheck from "./revenueCheckComponent";
import { setDateRange, setReloadEvents } from "@/lib/reportSelectionSlice";
import { UserRole } from "@/types/user";
import ServiceFeesCheck from "./serviceFeesCheckComponent";

export default function AdminBar() {    
    const dispatch = useDispatch(); 
    const { user } = useCurrentUser();
    const isAdmin = (user.role == UserRole.Admin);
    const { exportEventsToCsv, exportCustomerDataToCsv } = useGetExport();
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
    const hasEvents = (currentReportSelection?.currentEvents?.length ?? 0 > 0);
    const dateRangeTitle = "Event date range";

    const exportEventData = () => {
        if (currentReportSelection && currentReportSelection.currentEvents) {
            const csvData = exportEventsToCsv(currentReportSelection.currentEvents, isAdmin);
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
            
            const csvData = exportCustomerDataToCsv(currentReportSelection.currentEvents, isAdmin, hasPhoneData, hasShirtData, hasNonUsaOrders, currencySymbol, currencyAbbrev);
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

    return (
        <>
            <Row className="page-header">
                <Col md={5} sm={12} className="title-container">
                    <div className="title">{pageTitle}</div>
                </Col>
                <Col lg={5} sm={12} className="control-container no-print">
                    <DateRangeSelector dateRangeTitle={dateRangeTitle} selectedStart={currentReportSelection?.start} selectedEnd={currentReportSelection?.end} disabled={(currentReportSelection.seller.sellerId <= 0 || !hasEvents)} onDateChange={onDateChange} />
                </Col>
            </Row>
            <Row className="no-print">
                <Col md={3} sm={12}>
                    <SelectSeller />
                </Col>
                <Col md={9} sm={12}>
                    {user.showInactiveEvents && currentReportSelection.seller.sellerId > 0 ? <InactiveCheck /> : ''}
                    {isAdmin && currentReportSelection.seller.sellerId > 0 ? <DeletedCheck /> : ''}    
                    {isAdmin && currentReportSelection.seller.sellerId > 0 && hasEvents ? <RevenueCheck /> : ''}    
                    {isAdmin && currentReportSelection.seller.sellerId > 0 && hasEvents ? <ServiceFeesCheck /> : ''} 
                </Col>
            </Row>
            <Row className="no-print">
                <Col>
                    {currentReportSelection.seller.sellerId > 0 ? <ResetButton /> : ''}
                    {(isAdmin && currentReportSelection.seller.sellerId > 0 && hasEvents) ? <span className='admin-button'><Button onClick={exportEventData}>Export Summary</Button></span> : ''}
                    {(isAdmin && currentReportSelection.seller.sellerId > 0 && hasEvents) ? <span className='admin-button'><Button onClick={exportCustomerData}>Export Customer Data</Button></span> : ''}
                    {(currentReportSelection.seller.sellerId > 0 && hasEvents) ? <PrintButton /> : ''}
                </Col>
            </Row>
        </>           
    );
}
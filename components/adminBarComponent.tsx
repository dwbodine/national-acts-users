
import SelectSeller from "../components/selectSellerComponent";
import DateRangeSelector from "../components/dateRangeSelectorComponent";
import InactiveCheck from "../components/inactiveCheckComponent";
import DeletedCheck from "../components/deletedCheckComponent";
import { useSelector } from "react-redux";
import type { RootState } from '../src/lib/store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ResetButton from "./resetButtonComponent";
import ResetPasswordButton from "./resetPasswordComponent";
import LogoutButton from "./logoutButtonComponent";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "react-bootstrap";
import { useGetExport } from "@/hooks/useGetExport";
import getFileNameFromReportSelection from "@/utils/getFileNameFromReportSelection";
import downloadFile from "@/utils/downloadFile";
import PrintButton from "./printButtonComponent";
import RevenueCheck from "./revenueCheckComponent";

export default function AdminBar() {    
    
    const { user } = useCurrentUser();
    const { exportEventsToCsv, exportCustomerDataToCsv } = useGetExport();
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
    const hasEvents = (currentReportSelection?.currentEvents?.length ?? 0 > 0);

    const exportEventData = () => {
        if (currentReportSelection && currentReportSelection.currentEvents) {
            const csvData = exportEventsToCsv(currentReportSelection.currentEvents);
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
            
            const csvData = exportCustomerDataToCsv(currentReportSelection.currentEvents, hasPhoneData, hasShirtData, hasNonUsaOrders, currencySymbol, currencyAbbrev);
            const fileName = getFileNameFromReportSelection(currentReportSelection, 'customer');
            downloadFile(fileName, csvData);
        } 
    };

    let pageTitle: string = "Sales Overview";
    if (user.isAdmin) {
        pageTitle += " - Admin";
    } else if (currentReportSelection.seller.sellerId > 0) {
        pageTitle += " - " + currentReportSelection.seller.sellerName;
    }

    return (
        <>
            <Row className="page-header">
                <Col md={5} sm={12} className="title-container">
                    <div className="title">{pageTitle}</div>
                </Col>
                <Col lg={5} sm={12} className="control-container no-print">
                    <DateRangeSelector />
                </Col>
                <Col lg={2} sm={12} className="control-container no-print">
                    <LogoutButton />
                    <ResetPasswordButton />                    
                </Col>
            </Row>
            <Row className="no-print">
                <Col md={3} sm={12}>
                    <SelectSeller />
                </Col>
                <Col md={9} sm={12}>
                    {user.showInactiveEvents && currentReportSelection.seller.sellerId > 0 ? <InactiveCheck /> : ''}
                    {user.isAdmin && currentReportSelection.seller.sellerId > 0 ? <DeletedCheck /> : ''}    
                    {user.isAdmin && currentReportSelection.seller.sellerId > 0 && hasEvents ? <RevenueCheck /> : ''}    
                </Col>
            </Row>
            <Row className="no-print">
                <Col>
                    {currentReportSelection.seller.sellerId > 0 ? <ResetButton /> : ''}
                    {(user.isAdmin && currentReportSelection.seller.sellerId > 0 && hasEvents) ? <span className='admin-button'><Button onClick={exportEventData}>Export Summary</Button></span> : ''}
                    {(user.isAdmin && currentReportSelection.seller.sellerId > 0 && hasEvents) ? <span className='admin-button'><Button onClick={exportCustomerData}>Export Customer Data</Button></span> : ''}
                    {(currentReportSelection.seller.sellerId > 0 && hasEvents) ? <PrintButton /> : ''}
                </Col>
            </Row>
        </>           
    );
}
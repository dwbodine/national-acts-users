import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import ReportDatePicker from "../common/reportDatePIcker";
import ReportsListHomeButton from "../reportsListHomeButton";
import { setReportDates } from "@/lib/adminReportsSelectionSlice";
import { Button } from "react-bootstrap";
import { useGetAllEvents } from "@/hooks/useGetAllEvents";
import { GetEventsResponse, VipEvent } from "@/types/event";
import { useGetExport } from "@/hooks/useGetExport";
import getFileNameFromReportAdminSelection from "@/utils/getFileNameFromAdminReportSelection";
import downloadFile from "@/utils/downloadFile";
import { CirclesWithBar } from "react-loader-spinner";

export default function ReportsCustomerExport() {

    const currentAdminReportSelection = useSelector((state: RootState) => state.adminReportSelection);
    const dispatch = useDispatch();
    const { getAllEvents } = useGetAllEvents();
    const [errorMessage, setErrorMessage] = useState('');
    const { exportCustomerDataToCsv } = useGetExport();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { },[currentAdminReportSelection, isLoading]);

    const onDateChange = (newStart: number, newEnd: number) => {
        let reportSelection = { ...currentAdminReportSelection };
        reportSelection.start = newStart;
        reportSelection.end = newEnd;
        dispatch(
            setReportDates(reportSelection)
        );
    };

    const onSubmit = () => {
        if (currentAdminReportSelection && currentAdminReportSelection.start && currentAdminReportSelection.end) {
            setErrorMessage('');
            setIsLoading(true);
            getAllEvents(currentAdminReportSelection.start, currentAdminReportSelection.end)
                .then((response: GetEventsResponse) => {
                    if (response && !response.eventError) {
                        exportCustomerData(response.events);
                    } else {
                        setErrorMessage(response.eventError ?? 'Unknown error occurred');
                        setIsLoading(false);
                    }                    
                });
        } else {
            setErrorMessage('No dates selected');
        }
    };

    const exportCustomerData = (vipEvents: VipEvent[] | undefined) => {
        if (vipEvents && vipEvents.length > 0) {
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
            const showServiceFees = false;
            const showRevenueData = true;
            const csvData = exportCustomerDataToCsv(vipEvents, showServiceFees, showRevenueData, hasPhoneData, hasShirtData, hasNonUsaOrders, currencySymbol, currencyAbbrev);
            const fileName = getFileNameFromReportAdminSelection('customer_export', currentAdminReportSelection);
            downloadFile(fileName, csvData);
        } else {
            setErrorMessage('No events found');
        }
        setIsLoading(false);
    };
    
    return (
        <>
        <div className="admin-container" hidden={isLoading}>
            <h3>Export Customer Data</h3>
            <ReportDatePicker onChange={onDateChange} start={currentAdminReportSelection.start} end={currentAdminReportSelection.end} />            
            <Button onClick={onSubmit}>Submit</Button><ReportsListHomeButton />
            { errorMessage ? 
            <div className="danger">{errorMessage}</div>
            : ''}
        </div>
        <div className="spinner-container" hidden={!isLoading}>
            <CirclesWithBar height="100" width="100" color="#d12610" visible={isLoading} />
        </div>
        </>
    );
}
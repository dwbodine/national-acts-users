import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import ReportDatePicker from "../common/reportDatePIcker";
import ReportsListHomeButton from "../reportsListHomeButton";
import { setReportDates } from "@/lib/adminReportsSelectionSlice";
import { Button } from "react-bootstrap";
import { useGetAllEvents } from "@/hooks/event/useGetAllEvents";
import { GetEventsResponse, VipEvent } from "@/types/event";
import { useGetExport } from "@/hooks/common/useGetExport";
import getFileNameFromReportAdminSelection from "@/utils/getFileNameFromAdminReportSelection";
import downloadFile from "@/utils/downloadFile";
import { CirclesWithBar } from "react-loader-spinner";
import { MINIMUM_UNIX_TIMESTAMP } from "@/constants";
import moment from "moment";
import { useLogActivityData } from "@/hooks/common/useLogActivityData";
import { UserActivityType } from "@/types/user";
import { setIsLoading } from "@/lib/globalSelectionSlice";

export default function ReportsCustomerExport() {
    const globalSelection = useSelector((state: RootState) => state.globalSelection);
    const currentAdminReportSelection = useSelector((state: RootState) => state.adminReportSelection);
    const dispatch = useDispatch();
    const { getAllEvents } = useGetAllEvents();
    const { logActivityData } = useLogActivityData();
    const [errorMessage, setErrorMessage] = useState('');
    const { exportCustomerDataToCsv } = useGetExport();

    useEffect(() => { },[currentAdminReportSelection, globalSelection.isLoading]);

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

            const start = currentAdminReportSelection.start;
            const end = currentAdminReportSelection.end;

            if (start >= end) {
                setErrorMessage("Start date must be before end date");
                return false;
            }

            if (start < MINIMUM_UNIX_TIMESTAMP) {
                const minDate = moment.unix(MINIMUM_UNIX_TIMESTAMP).format('MM/DD/YYYY');
                setErrorMessage(`Start date must be on or before ${minDate}`);
                return false;
            }

            dispatch(
                setIsLoading(true)
            );
            logActivityData(UserActivityType.CustomerExportReport).then(() => {
                getAllEvents(start, end)
                    .then((response: GetEventsResponse) => {
                        if (response && !response.eventError) {
                            exportCustomerData(response.events);
                        } else {
                            setErrorMessage(response.eventError ?? 'Unknown error occurred');
                        }                    
                        dispatch(
                            setIsLoading(false)
                        );
                });
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
            const csvData = exportCustomerDataToCsv(vipEvents, showServiceFees, showRevenueData, hasPhoneData, hasShirtData, hasNonUsaOrders, currencySymbol);
            const fileName = getFileNameFromReportAdminSelection('customer_export', currentAdminReportSelection);
            downloadFile(fileName, csvData);
        } else {
            setErrorMessage('No events found');
        }
    };
    
    return (
        <div className="admin-container">
            <h3>Export Customer Data</h3>
            <ReportDatePicker onChange={onDateChange} start={currentAdminReportSelection.start} end={currentAdminReportSelection.end} />            
            <Button onClick={onSubmit}>Submit</Button><ReportsListHomeButton />
            { errorMessage ? 
            <div className="danger">{errorMessage}</div>
            : ''}
        </div>
    );
}
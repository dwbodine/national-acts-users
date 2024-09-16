import DateRangeSelector from "../common/dateRangeSelectorComponent";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setDashboardDateRange, setReloadActivities } from "@/lib/dashboardSelectionSlice";
import { Button } from "react-bootstrap";
import { useGetExport } from "@/hooks/common/useGetExport";
import getFileNameFromDashboardReportSelection from "@/utils/getFileNameFromDashboardReportSelection";
import downloadFile from "@/utils/downloadFile";

export default function DashboardBar() {    
    const dispatch = useDispatch(); 
    const { exportDashboardOrdersToCsv } = useGetExport();
    const currentDashboardSelection = useSelector((state: RootState) => state.dashboardSelecton);
    const dateRangeTitle = "Selected date range";

    let pageTitle: string = `Home Dashboard`;

    const onDateChange = (selectedStart: number, selectedEnd: number) => {
        let dashboardSelection = { ...currentDashboardSelection};
        dashboardSelection.start = selectedStart;
        dashboardSelection.end = selectedEnd;
        dispatch(setDashboardDateRange(dashboardSelection));
        dispatch(setReloadActivities(true));
    }

    const exportDashboardData = () => {
        if (!currentDashboardSelection.currentDashboardData || !currentDashboardSelection.currentDashboardData.orders || currentDashboardSelection.currentDashboardData.orders.length == 0) {
            return;
        }
        
        const csvData = exportDashboardOrdersToCsv(currentDashboardSelection);
        const fileName = getFileNameFromDashboardReportSelection('dashboard-orders', currentDashboardSelection);
        downloadFile(fileName, csvData);        
    };

    return (
        <>
            <Row className="page-header">
                <Col sm={6} xs={12} className="title-container">
                    <span className="title">{pageTitle}</span>
                </Col>
                <Col sm={6} xs={12} className="control-container no-print">
                    <DateRangeSelector dateRangeTitle={dateRangeTitle} selectedStart={currentDashboardSelection?.start} selectedEnd={currentDashboardSelection?.end} disabled={false} onDateChange={onDateChange} />
                    <Button className="dashboard-export-button" onClick={exportDashboardData}>Export</Button>
                </Col>
            </Row>
        </>           
    );
}
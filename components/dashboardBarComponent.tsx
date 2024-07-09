import DateRangeSelector from "./dateRangeSelectorComponent";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setDateRange, setReloadEvents } from "@/lib/dashboardSelectionSlice";

export default function DashboardBar() {    
    const dispatch = useDispatch(); 
    const { user } = useCurrentUser();
    const currentDashboardSelection = useSelector((state: RootState) => state.dashboardSelecton);
    const dateRangeTitle = "Selected date range";

    let pageTitle: string = "Home Dashboard";

    const onDateChange = (selectedStart: number, selectedEnd: number) => {
        let dashboardSelection = { ...currentDashboardSelection};
        dashboardSelection.start = selectedStart;
        dashboardSelection.end = selectedEnd;
        dashboardSelection.retainDateSelection = true;
        dispatch(setDateRange(dashboardSelection));
        dispatch(setReloadEvents(true));
    }

    return (
        <>
            <Row className="page-header">
                <Col sm={6} xs={12} className="title-container">
                    <div className="title">{pageTitle}</div>
                </Col>
                <Col sm={6} xs={12} className="control-container no-print">
                    <DateRangeSelector dateRangeTitle={dateRangeTitle} selectedStart={currentDashboardSelection?.start} selectedEnd={currentDashboardSelection?.end} disabled={false} onDateChange={onDateChange} />
                </Col>
            </Row>
        </>           
    );
}
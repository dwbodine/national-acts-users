import DateRangeSelector from "../common/dateRangeSelectorComponent";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setReloadActivities, setUserActivityDateRange } from "@/lib/userActivitySelectionSlice";
import { Button } from "react-bootstrap";

export default function UserActivityBar() {    
    const dispatch = useDispatch(); 
    const currentUserActivitySelection = useSelector((state: RootState) => state.userActivitySelection);
    const dateRangeTitle = "Selected date range";

    let pageTitle: string = `User Activity`;

    const onDateChange = (selectedStart: number, selectedEnd: number) => {
        let userActivitySelection = { ...currentUserActivitySelection};
        userActivitySelection.start = selectedStart;
        userActivitySelection.end = selectedEnd;
        dispatch(
            setUserActivityDateRange(userActivitySelection)
        );
        submitReport();
    }

    const submitReport = () => {
        dispatch(
            setReloadActivities(true)
        );
    };

    return (
        <>
            <Row className="page-header">
                <Col sm={6} xs={12} className="title-container">
                    <span className="title">{pageTitle}</span>
                </Col>
                <Col sm={6} xs={12} className="control-container no-print">
                    <DateRangeSelector dateRangeTitle={dateRangeTitle} selectedStart={currentUserActivitySelection?.start} selectedEnd={currentUserActivitySelection?.end} disabled={false} onDateChange={onDateChange} />
                </Col>
            </Row>
        </>           
    );
}
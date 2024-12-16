import { setIsLoading } from "@/lib/globalSelectionSlice";
import { RootState } from "@/lib/store";
import { VipEvent } from "@/types/event";
import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import setFocusToControl from "@/utils/setFocusToControl";
import MonthView from "./monthViewComponent";

export default function AllEventsMonth() {
    const dispatch = useDispatch();
    const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);
    const [vipEvents, setVipEvents] = useState<VipEvent[] | undefined>(undefined);

    useEffect(() => {
        if (currentReportSelection.currentEvents != undefined && currentReportSelection.notes != undefined) {
            setVipEvents(currentReportSelection.currentEvents);
            dispatch(
                setIsLoading(false)
            );
            if (
                currentReportSelection.focusControl &&
                currentReportSelection.focusControl != ''
              ) {
                const focusControl: string = currentReportSelection.focusControl;
                setTimeout(() => {
                  setFocusToControl(focusControl);
                }, 50);
              }
        }        
    }, [dispatch, currentReportSelection]);

    const startOfMonth = currentReportSelection.start ? moment.unix(currentReportSelection.start).format('YYYY-MM-DD HH:mm:ss') : undefined;
    const endOfMonth = currentReportSelection.end ? moment.unix(currentReportSelection.end).format('YYYY-MM-DD HH:mm:ss') : undefined;

    return (
        (vipEvents != undefined) ?
        <Row>
            <Col>
                <MonthView StartOfMonth={startOfMonth} EndOfMonth={endOfMonth} Events={vipEvents} Notes={currentReportSelection?.notes} /> 
            </Col>
        </Row> :
        <Row>
            <Col>No data returned</Col>
        </Row>
    )
}
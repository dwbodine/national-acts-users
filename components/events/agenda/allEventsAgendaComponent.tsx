import { setIsLoading } from "@/lib/globalSelectionSlice";
import { RootState } from "@/lib/store";
import { VipEvent } from "@/types/event";
import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import AgendaView from "./agendaViewComponent";
import moment from "moment";
import setFocusToControl from "@/utils/setFocusToControl";

export default function AllEventsAgenda() {
    const dispatch = useDispatch();
    const currentReportSelection = useSelector((state: RootState) => state.eventAdminSelection);
    const [vipEvents, setVipEvents] = useState<VipEvent[] | undefined>(undefined);

    useEffect(() => {
        if (currentReportSelection.currentEvents != undefined) {
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

    const startOfMonth = currentReportSelection.start ? moment.unix(currentReportSelection.start).format('YYYY-MM-DD') : undefined;

    return (
        (vipEvents != undefined) ?
        <Row>
            <Col>
                <AgendaView StartOfMonth={startOfMonth} Events={vipEvents} Notes={currentReportSelection?.notes} /> 
            </Col>
        </Row> :
        <Row>
            <Col>No data returned</Col>
        </Row>
    )
}
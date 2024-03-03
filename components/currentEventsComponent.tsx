import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../src/lib/store';
import { useGetEvents } from '@/hooks/useGetEvents';
import { setEvents, setDateRange } from '@/lib/reportSelectionSlice';
import { VipEvent } from "@/types/event";
import { useEffect } from "react";
import EventComponent from "./eventComponent";
import moment from "moment";
import { UserReportSelection } from "@/types/user";

export default function CurrentEvents() {
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
    const { getEvents } = useGetEvents();
    const dispatch = useDispatch(); 
    let vipEvents: VipEvent[] | undefined = currentReportSelection.currentEvents;

    useEffect(() => {
        if (currentReportSelection.reloadEvents) {
            getEvents(currentReportSelection).then((response) => {
                if (!response.eventError && response.events) {
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    vipEvents = response.events;
                    if (vipEvents?.length > 0) {
                        const start = moment(vipEvents[0].eventDate).unix();
                        const end = moment(vipEvents[vipEvents.length-1].eventDate).unix();
                        const selection: UserReportSelection = {
                            sellerId: 0,
                            start: start,
                            end: end
                        };
                        dispatch(
                            setDateRange(selection)
                        );
                    }
                    dispatch(
                        setEvents(response.events)
                    );
                } else {
                    vipEvents = [];
                }
            });
        }
    });     
    
    const rows = [];
    if (vipEvents && vipEvents.length > 0) {
        for (const vipEvent of vipEvents) {
            rows.push(<EventComponent VipEvent={vipEvent} />);
        }
    }    

    return (
        <>
        {(vipEvents && vipEvents.length > 0) ?
            <>
                <div className="table-container">
                    { rows }
                </div>
                <div>Total: {vipEvents.length}</div>
            </>
        : ''}
        
        </>
    );        
 
}

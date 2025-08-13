"use client";

import AllEvents from "../../events/allEventsComponent";
import EventSalesBar from "../../events/eventSalesBarComponent";

export default function EventAdminComponent() {
    return (
        <>
            <EventSalesBar />
            <AllEvents />
        </>
    );
}
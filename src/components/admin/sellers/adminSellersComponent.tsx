"use client";

import CurrentEvents from "../../sales/events/currentEventsComponent";
import SalesBar from "../../sales/events/salesBarComponent";

export default function AdminSellersComponent() {
    return (
        <>
            <SalesBar />
            <CurrentEvents />
        </>
    );
}
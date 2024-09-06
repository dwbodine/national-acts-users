import { VipEvent } from "@/types/event";
import React from 'react';
import moment from "moment";
import { useDispatch } from "react-redux";
import { setEvents } from '@/lib/reportSelectionSlice';
import { useSetEventInactive } from "@/hooks/useSetEventInactive";
import { useSetEventDeleted } from "@/hooks/useSetEventDeleted";
import { useGetLocation } from "@/hooks/useGetLocation";
import router from "next/router";
import { eventService } from "@/services";
import { useSetEventHidden } from "@/hooks/useSetEventHidden";

export default function EventRow(props: any) {
    const dispatch = useDispatch(); 
    const vipEvent = props.VipEvent as VipEvent;
    const changEventStatus = props.ChangeEventStatus as boolean;
    const hideRevItem = props.HideRevenue as boolean;
    const hideServiceFees = props.HideServiceFees as boolean;
    const { setEventInactive } = useSetEventInactive();
    const { setEventDeleted } = useSetEventDeleted();
    const { setEventHidden } = useSetEventHidden();
    const { getLocation } = useGetLocation();
    const id = `event_${vipEvent.ticketSocketEventId}`;

    const setDetailEvent = () => {
        const url = `/event/?id=${vipEvent.ticketSocketEventId}`;
        window.open(url, "_blank");
    };

    const activateDeactivateEvent = () => {
        const eventId = vipEvent.ticketSocketEventId;
        const isActive = vipEvent.isActive;
        setEventInactive(eventId, isActive)
            .then((response) => {
                if (!response.success) {
                    if (response.statusCode == 401 || response.statusCode == 422) {
                        router.push('/logout/');
                    } else {
                        console.log(response.eventError);
                    }                    
                    return;
                } else {
                    dispatch(
                        setEvents()
                    );
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const deleteUndeleteEvent = () => {
        const eventId = vipEvent.ticketSocketEventId;
        const isDeleted = vipEvent.isDeleted;
        setEventDeleted(eventId, isDeleted)
            .then((response) => {
                if (!response.success) {
                    if (response.statusCode == 401 || response.statusCode == 422) {
                        router.push('/logout/');
                    } else {
                        console.log(response.eventError);
                    }
                    return;
                } else {
                    dispatch(
                        setEvents()
                    );
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const hideUnhideEvent = () => {
        const eventId = vipEvent.ticketSocketEventId;
        const isHidden = vipEvent.isHidden ?? false;
        setEventHidden(eventId, isHidden)
            .then((response) => {
                if (!response.success) {
                    if (response.statusCode == 401 || response.statusCode == 422) {
                        router.push('/logout/');
                    } else {
                        console.log(response.eventError);
                    }
                    return;
                } else {
                    dispatch(
                        setEvents()
                    );
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    let statusClass = '';
    if (props.VipEvent.isDeleted) {
        statusClass += 'event-deleted';
    } else if (!props.VipEvent.isActive) {
        statusClass += 'event-inactive';
    } else if (props.VipEvent.isHidden) {
        statusClass += 'event-hidden';
    }

    const venueName = vipEvent.venue?.name;
    let location = '';
    if (vipEvent.venue) {
        location = getLocation(vipEvent.venue);
    }
    
    const eventDate = moment(vipEvent.eventDate).format('MM/DD/YYYY');
    const revenue = new Number(vipEvent.totalRevenue).toFixed(2);
    const serviceFees = new Number(vipEvent.totalServiceFees).toFixed(2);
    const inactiveLabel = vipEvent.isActive ? "Deactivate" : "Activate";
    const deletedLabel = vipEvent.isDeleted ? "Undelete" : "Delete";
    const hiddenLabel = vipEvent.isHidden ? "Unhide" : "Hide";
    const url = `/event/?id=${vipEvent.ticketSocketEventId}`;
        
    return (
        <tr className={statusClass} id={id}>
            <td>{eventDate}</td>
            <td><a href={url} target="_blank">{vipEvent.title}</a></td>
            <td>{venueName}</td>
            <td>{location}</td>
            <td className="pull-right">{vipEvent.totalTickets}</td>
            <td className="pull-right" hidden={hideRevItem}>{revenue}</td>
            <td className="pull-right no-print" hidden={hideServiceFees}>{serviceFees}</td>
            { changEventStatus ? <td className="command-column no-print"><a onClick={activateDeactivateEvent}>{inactiveLabel}</a></td> : ''}
            { changEventStatus ? <td className="command-column no-print"><a onClick={deleteUndeleteEvent}>{deletedLabel}</a></td> : ''}
            { changEventStatus ? <td className="command-column no-print"><a onClick={hideUnhideEvent}>{hiddenLabel}</a></td> : ''}
        </tr>
    );
}
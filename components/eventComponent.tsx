import { VipEvent } from "@/types/event";
import React, { Component } from 'react';
import moment from "moment";
import { useDispatch } from "react-redux";
import { setSelectedEvent } from '@/lib/reportSelectionSlice';

export default function EventComponent(props: any) {
    const dispatch = useDispatch(); 
    const vipEvent = props.VipEvent as VipEvent;
    const isAdmin = props.IsAdmin as boolean;

    const setDetailEvent = () => {
        dispatch(
            setSelectedEvent(vipEvent)
        );
    };

    let statusClass = '';
    if (props.VipEvent.isDeleted) {
        statusClass += 'event-deleted';
    } else if (!props.VipEvent.isActive) {
        statusClass += 'event-inactive';
    }

    const venueName = vipEvent.venue?.name;
    let location = '';
    if (vipEvent.venue) {
        location = `${vipEvent.venue.city}, ${vipEvent.venue.state}`;
        if (vipEvent.venue.country && vipEvent.venue.country != "United States" && vipEvent.venue.country != "USA" && vipEvent.venue.country != vipEvent.venue.state) {
            location += ", " + vipEvent.venue.country;
        }
    }
    
    const eventDate = moment(vipEvent.eventDate).format('MM/DD/YYYY');
    const revenue = new Number(vipEvent.totalRevenue).toFixed(2);
        
    return (
        <tr className={statusClass}>
            <td>{eventDate}</td>
            <td><a onClick={setDetailEvent}>{vipEvent.title}</a></td>
            <td>{venueName}</td>
            <td>{location}</td>
            <td className="pull-right">{vipEvent.totalTickets}</td>
            <td className="pull-right">{revenue}</td>
            { isAdmin ? <td>Deactivate</td> : ''}
            { isAdmin ? <td>Delete</td> : ''}
        </tr>
    );
}
import { VipEvent } from "@/types/event";
import React, { Component } from 'react';


export default function EventComponent(props: any) {

    let statusClass = 'flex-table row';
    if (props.VipEvent.isDeleted) {
        statusClass += ' event-deleted';
    } else if (!props.VipEvent.isActive) {
        statusClass += ' event-inactive';
    }
    
    return (
        <div className={statusClass}>
            <div className="flex-row first" role="cell">{props.VipEvent.title} - {props.VipEvent.eventDate}</div>
        </div>
    );
}
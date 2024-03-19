import React from 'react';

export default function TicketTypeBreakdown(props: any) {
    const ticketType = props.TicketType as string;
    const numTickets = props.NumTickets as number;
        
    return (
        <div>{ticketType}: {numTickets}</div>
    );
}
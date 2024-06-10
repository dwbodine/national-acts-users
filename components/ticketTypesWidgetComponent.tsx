import React from 'react';
import { ITicketData, ITicketTypeData } from '@/types/event';
import { FaTicketAlt } from 'react-icons/fa';

export default function TicketTypesWidget(props: any) {

    const ticketPropData: ITicketData = props.TicketData as ITicketData;
    const totalTickets: number = props.TotalTickets as number;
    const ticketsRefunded: number = props.TicketsRefunded as number;

    const ticketTypes = ticketPropData?.TicketTypes;
    
    let arr: any = [];
    if (ticketTypes?.length > 0) {
        ticketPropData.TicketData?.forEach((ticketTypeData: ITicketTypeData[], key: string) => {
            ticketTypes.forEach((ticketType: string) => {
                var data = ticketTypeData.find(x => x.TicketType == ticketType);
                var number = arr[ticketType] ?? 0;
                if (data) {
                    number += data.Number;
                }
                arr[ticketType] = number;
            });
        });
   

        var ttypes = [];
        let i = 0;
        for (const ticketType of ticketTypes) {
            const key = `ttw${i}`;
            ttypes.push(<div key={key}>{ticketType} ({arr[ticketType]})</div>);
            i++;
        }

        return (
            <>
                <FaTicketAlt size="2em" />
                <div>Ticket types sold:</div>
                {ttypes}
                <span>Total: {totalTickets}</span>
                <div className="second">Tickets refunded:</div>
                <span>{ticketsRefunded}</span>
            </>
        );
    } else {
        return(<></>);
    }
}
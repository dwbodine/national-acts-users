import React from 'react';
import { ITicketData, ITicketTypeData, TicketType } from '@/types/event';
import { FaTicketAlt } from 'react-icons/fa';

export default function TicketTypesWidget(props: any) {
  const ticketPropData: ITicketData = props.TicketData as ITicketData;
  const totalTickets: number = props.TotalTickets as number;
  const ticketsRefunded: number = props.TicketsRefunded as number;
  const hideTicketBreakdown: boolean = props.HideTicketBreakDown as boolean;

  const ticketTypes = ticketPropData?.TicketTypes;

  let arr: any = [];
  if (ticketTypes?.length > 0) {
    let ttypes: any = [];

    if (!hideTicketBreakdown) {
      ticketPropData.TicketData?.forEach(
        (ticketTypeData: ITicketTypeData[], key: string) => {
          ticketTypes.forEach((ticketType: TicketType) => {
            var data = ticketTypeData.find(
              (x) => x.TicketType.toLowerCase() == ticketType.ticketTypeName.toLowerCase(),
            );
            var number = arr[ticketType.ticketTypeName] ?? 0;
            if (data) {
              number += data.Number;
            }
            arr[ticketType.ticketTypeName] = number;
          });
        },
      );

      let i = 0;
      for (const ticketType of ticketTypes) {
        const key = `ttw${i}`;
        ttypes.push(
          <div key={key}>
            {ticketType.ticketTypeName} ({arr[ticketType.ticketTypeName]})
          </div>,
        );
        i++;
      }
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
    return <></>;
  }
}

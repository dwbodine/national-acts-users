'use client';

import { ReactElement } from 'react';
import { FaTicketAlt } from 'react-icons/fa';

import { ITicketTypeData, TicketType } from '@/types/event';
import { TicketTypesWidgetProps } from '@/types/props';

export default function TicketTypesWidget(props: TicketTypesWidgetProps) {
  const ticketPropData = props.TicketData;
  const totalTickets = props.TotalTickets;
  const ticketsRefunded = props.TicketsRefunded;
  const hideTicketBreakdown = props.HideTicketBreakDown;
  const isAdmin = props.IsAdmin;

  const ticketTypes: TicketType[] | undefined = ticketPropData?.TicketTypes;

  const ticketMap = new Map<string, number>();
  if ((ticketTypes?.length ?? 0) > 0) {
    const ttypes: ReactElement[] = [];

    if (!hideTicketBreakdown) {
      ticketTypes?.forEach((ticketType) => {
        ticketPropData?.TicketData?.forEach((ticketTypeData: ITicketTypeData[]) => {
          const data = ticketTypeData.find(
            (x) => x.TicketType.toLowerCase() === ticketType.ticketTypeName.toLowerCase(),
          );
          let number = ticketMap.get(ticketType.ticketTypeName) ?? 0;
          if (data !== undefined) {
            number += data.Number;
          }
          ticketMap.set(ticketType.ticketTypeName, number);
        });
      });

      if (ticketTypes) {
        let i = 0;
        for (const ticketType of ticketTypes) {
          const key = `ttw${i}`;
          const numSold = ticketMap.get(ticketType.ticketTypeName) ?? 0;
          if (!isAdmin && numSold === 0) {
            continue;
          }
          ttypes.push(
            <div key={key}>
              {ticketType.ticketTypeName} ({numSold})
            </div>,
          );
          i += 1;
        }
      }
    }

    return (
      <>
        <FaTicketAlt size="2em" />
        <div>Ticket type breakdown:</div>
        {ttypes}
        <span>Total: {totalTickets}</span>
        <div className="second">Tickets refunded:</div>
        <span>{ticketsRefunded}</span>
      </>
    );
  }
  return <></>;
}

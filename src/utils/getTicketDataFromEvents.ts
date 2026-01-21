import moment from 'moment';

import { ITicketData, ITicketTypeData, TicketType, VipEvent } from '@/types/event';

export default function getTicketDataFromEvents(events: VipEvent[]): ITicketData {
  const map = new Map<string, ITicketTypeData[]>();
  const ticketTypes: TicketType[] = [];
  events?.forEach((evt) => {
    const key = moment(evt.eventDate).format('MM/DD/YYYY');
    let eventHasTickets: boolean = false;
    const eventHasTicketTypes: boolean = evt.hasTicketTypeData ?? false;
    if (eventHasTicketTypes) {
      evt.ticketTypes?.forEach((ticketType) => {
        if (
          !ticketTypes.find(
            (x) => x.ticketTypeName.toLowerCase() === ticketType.ticketTypeName.toLowerCase(),
          )
        ) {
          ticketTypes.push(ticketType);
        }
      });
    }
    evt.orders?.forEach((order) => {
      if (order.isActive && !order.isDeleted) {
        order.tickets?.forEach((ticket) => {
          if (ticket.isActive) {
            eventHasTickets = true;
            if (
              evt.ticketSocketEventId &&
              !eventHasTicketTypes &&
              !ticketTypes.find(
                (x) => x.ticketTypeName.toLowerCase() === ticket.ticketType.toLowerCase(),
              ) &&
              evt.ticketSocketEventId !== undefined
            ) {
              ticketTypes.push({
                eventId: evt.ticketSocketEventId,
                isActive: true,
                ticketTypeId: 0,
                ticketTypeName: ticket.ticketType,
                totalAvailable: 0,
              });
            }
            const collection = map.get(key);
            if (collection === undefined) {
              const data: ITicketTypeData = {
                Number: 1,
                TicketType: ticket.ticketType,
              };
              map.set(key, [data]);
            } else {
              let ticketTypeName = ticket.ticketType;
              const ttype = ticketTypes.find((x) => x.ticketTypeId === ticket.ticketTypeId);
              if (ttype) {
                const theType = ttype.ticketTypeName;
                ticketTypeName = theType;
              }
              const indexToUpdate = collection.findIndex(
                (item) => item.TicketType.toLowerCase() === ticketTypeName.toLowerCase(),
              );
              if (indexToUpdate >= 0) {
                const item = collection[indexToUpdate];
                if (item) {
                  item.Number += 1;
                  collection[indexToUpdate] = item;
                }
              } else {
                collection.push({
                  Number: 1,
                  TicketType: ticketTypeName,
                });
              }
            }
          }
        });
      }
    });
    if (!eventHasTickets) {
      map.set(key, []);
    }
  });
  ticketTypes.sort();
  return {
    TicketData: map,
    TicketTypes: ticketTypes,
  };
}

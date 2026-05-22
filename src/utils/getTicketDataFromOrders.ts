import moment from 'moment';

import { ITicketData, ITicketTypeData, Order, TicketType, VipEvent } from '@/types/event';

export default function getTicketDataFromOrders(
  orders: Order[],
  evt: VipEvent | undefined,
): ITicketData {
  const map = new Map<string, ITicketTypeData[]>();
  const ticketTypes: TicketType[] = [];

  if (!evt) {
    return {
      TicketData: map,
      TicketTypes: ticketTypes,
    };
  }
  const key = moment(evt.eventDate).format('MM/DD/YYYY');
  // Older data may not have ticket types attached
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
  orders.forEach((order) => {
    order.tickets?.forEach((ticket) => {
      if (ticket.isActive) {
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
            const item = collection[indexToUpdate]!;
            item.Number += 1;
            collection[indexToUpdate] = item;
          } else {
            collection.push({
              Number: 1,
              TicketType: ticketTypeName,
            });
          }
        }
      }
    });
  });
  ticketTypes.sort();
  return {
    TicketData: map,
    TicketTypes: ticketTypes,
  };
}

import { Order, TicketPartner, VipEvent } from '@/types/event';

export const hasTicketSocketEvent = (event: VipEvent | undefined): boolean =>
  event?.ticketPartnerId === TicketPartner.TicketSocket && !!event.ticketPartnerEventId;

export const selectTicketPartnerEvent = (
  event: VipEvent,
  selected: VipEvent | undefined,
): VipEvent => ({
  ...event,
  isExternal: !selected,
  originalEventId: selected?.originalEventId,
  ticketPartnerEventId: selected?.ticketPartnerEventId ?? 0,
  ticketPartnerId: selected ? TicketPartner.TicketSocket : TicketPartner.NationalActs,
});

export const getOrderEventPath = (
  order: Order | undefined,
  event: VipEvent | undefined,
): string => {
  // Order responses contain provider and partner event IDs, not the application event ID.
  if (order && event?.eventId && event.ticketPartnerEventId === order.ticketPartnerEventId) {
    return `/admin/events/orders/?id=${event.eventId}`;
  }
  return '/admin/events';
};

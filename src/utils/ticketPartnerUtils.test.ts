import { describe, expect, it } from 'vitest';

import { Order, TicketPartner, VipEvent } from '@/types/event';

import {
  getOrderEventPath,
  hasTicketSocketEvent,
  selectTicketPartnerEvent,
} from './ticketPartnerUtils';

const event: VipEvent = {
  eventId: 101,
  eventDate: '2026-10-17',
  title: 'Show',
  isActive: true,
  isDeleted: false,
  isExternal: true,
  ticketPartnerId: TicketPartner.NationalActs,
  ticketPartnerEventId: 202,
  venueId: 303,
};

describe('ticket partner identities', () => {
  it('associates a TicketSocket mapping while preserving the application event and venue', () => {
    const selected = {
      ...event,
      eventId: 404,
      ticketPartnerId: TicketPartner.TicketSocket,
      ticketPartnerEventId: 505,
      originalEventId: 606,
    };
    const updated = selectTicketPartnerEvent(event, selected);

    expect(updated).toMatchObject({
      eventId: 101,
      venueId: 303,
      ticketPartnerId: 2,
      ticketPartnerEventId: 505,
      originalEventId: 606,
      isExternal: false,
    });
    expect(hasTicketSocketEvent(updated)).toBe(true);
    expect(event.ticketPartnerEventId).toBe(202);
  });

  it('clears an association and does not mistake a National Acts mapping for TicketSocket', () => {
    expect(hasTicketSocketEvent(event)).toBe(false);
    expect(hasTicketSocketEvent(undefined)).toBe(false);
    const cleared = selectTicketPartnerEvent(event, undefined);
    expect(cleared).toMatchObject({
      eventId: 101,
      ticketPartnerId: 1,
      ticketPartnerEventId: 0,
      isExternal: true,
    });
    expect(cleared.originalEventId).toBeUndefined();
    expect(hasTicketSocketEvent(cleared)).toBe(false);
  });

  it('uses the matching application event ID for order navigation, never a provider or partner ID', () => {
    const order = {
      ticketPartnerOrderId: 707,
      ticketPartnerEventId: 202,
      originalEventId: 808,
    } as Order;

    expect(getOrderEventPath(order, event)).toBe('/admin/events/orders/?id=101');
    expect(getOrderEventPath(order, { ...event, ticketPartnerEventId: 909 })).toBe('/admin/events');
    expect(getOrderEventPath(order, undefined)).toBe('/admin/events');
    expect(getOrderEventPath(undefined, event)).toBe('/admin/events');
  });
});

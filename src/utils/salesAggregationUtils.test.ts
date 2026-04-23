import { describe, expect, it } from 'vitest';

import type { Order, VipEvent } from '@/types/event';

import getPurchaseDataFromEvents from './getPurchaseData';
import getShirtDataFromEvents from './getShirtData';
import getShirtDataFromOrders from './getShirtDataFromOrders';
import getTicketDataFromEvents from './getTicketDataFromEvents';
import getTicketDataFromOrders from './getTicketDataFromOrders';

describe('sales aggregation utils', () => {
  const orders = [
    {
      currencyAbbrev: 'USD',
      currencySymbol: '$',
      email: 'a@example.com',
      eventId: 1,
      eventTitle: 'Show One',
      exchangeRate: 1,
      hasChargebacks: false,
      hasRefunds: false,
      isActive: true,
      isDeleted: false,
      numTickets: 2,
      orderId: 10,
      purchaseDate: '2026-04-20',
      purchaseTimestamp: '2026-04-20T12:00:00Z',
      purchaserFirstName: 'Jane',
      purchaserLastName: 'Doe',
      revenue: 100,
      revenueUsd: 100,
      serviceFees: 10,
      serviceFeesUsd: 10,
      ticketSocketEventId: 99,
      ticketSocketOrderId: 1001,
      tickets: [
        {
          isActive: true,
          shirtSize: 'M',
          ticketSocketOrderTicketId: 1,
          ticketType: 'GA',
          ticketTypeId: 1,
        },
        {
          isActive: true,
          shirtSize: 'XL',
          ticketSocketOrderTicketId: 2,
          ticketType: 'GA',
          ticketTypeId: 1,
        },
      ],
      totalShirts: 2,
    },
    {
      currencyAbbrev: 'USD',
      currencySymbol: '$',
      email: 'b@example.com',
      eventId: 1,
      eventTitle: 'Show One',
      exchangeRate: 1,
      hasChargebacks: false,
      hasRefunds: false,
      isActive: true,
      isDeleted: false,
      numTickets: 1,
      orderId: 11,
      purchaseDate: '2026-04-22',
      purchaseTimestamp: '2026-04-22T12:00:00Z',
      purchaserFirstName: 'John',
      purchaserLastName: 'Doe',
      revenue: 50,
      revenueUsd: 50,
      serviceFees: 5,
      serviceFeesUsd: 5,
      ticketSocketEventId: 99,
      ticketSocketOrderId: 1002,
      tickets: [
        {
          isActive: true,
          shirtSize: 'S',
          ticketSocketOrderTicketId: 3,
          ticketType: 'VIP',
          ticketTypeId: 2,
        },
      ],
      totalShirts: 1,
    },
  ] as Order[];

  const vipEvent = {
    eventDate: '2026-05-01T12:00:00Z',
    externalEventId: 1,
    hasTicketTypeData: true,
    isActive: true,
    isDeleted: false,
    isExternal: false,
    orders,
    shirtSales: [
      { size: 'XL', total: 1 },
      { size: 'M', total: 2 },
    ],
    ticketSocketEventId: 99,
    ticketTypes: [
      {
        eventId: 1,
        isActive: true,
        ticketTypeId: 1,
        ticketTypeName: 'GA',
        totalAvailable: 100,
      },
      {
        eventId: 1,
        isActive: true,
        ticketTypeId: 2,
        ticketTypeName: 'VIP',
        totalAvailable: 10,
      },
    ],
    title: 'Show One',
    totalShirts: 3,
  } as VipEvent;

  it('aggregates purchase totals and fills missing purchase dates', () => {
    const result = getPurchaseDataFromEvents([vipEvent]);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual(
      expect.objectContaining({
        PurchaseDate: '04/20/2026',
        Purchases: 1,
        Tickets: 2,
        TotalRevenueUsd: 110,
      }),
    );
    expect(result[1]).toEqual(
      expect.objectContaining({
        PurchaseDate: '04/21/2026',
        Purchases: 0,
        Tickets: 0,
      }),
    );
    expect(result[2]).toEqual(
      expect.objectContaining({
        PurchaseDate: '04/22/2026',
        Purchases: 1,
        Tickets: 1,
        TotalRevenueUsd: 55,
      }),
    );
  });

  it('aggregates shirt data from events and orders', () => {
    const eventShirtData = getShirtDataFromEvents([vipEvent]);
    expect(eventShirtData?.ShirtSizes).toEqual(['M', 'XL']);
    expect(eventShirtData?.ShirtData?.get('05/01/2026')).toEqual(
      expect.arrayContaining([
        { Number: 2, ShirtSize: 'M' },
        { Number: 1, ShirtSize: 'XL' },
      ]),
    );

    const orderShirtData = getShirtDataFromOrders(orders);
    expect(orderShirtData?.ShirtSizes).toEqual(['S', 'M', 'XL']);
    expect(orderShirtData?.ShirtData?.get('04/20/2026')).toEqual([
      { Number: 1, ShirtSize: 'M' },
      { Number: 1, ShirtSize: 'XL' },
    ]);
  });

  it('aggregates ticket data from events and orders', () => {
    const eventTicketData = getTicketDataFromEvents([vipEvent]);
    expect(eventTicketData.TicketTypes).toHaveLength(2);
    expect(eventTicketData.TicketData?.get('05/01/2026')).toEqual([
      { Number: 2, TicketType: 'GA' },
      { Number: 1, TicketType: 'VIP' },
    ]);

    const orderTicketData = getTicketDataFromOrders(orders, vipEvent);
    expect(orderTicketData.TicketTypes).toHaveLength(2);
    expect(orderTicketData.TicketData?.get('05/01/2026')).toEqual([
      { Number: 2, TicketType: 'GA' },
      { Number: 1, TicketType: 'VIP' },
    ]);
  });

  it('returns empty ticket data when no event is provided', () => {
    const result = getTicketDataFromOrders(orders, undefined);

    expect(result).toEqual({
      TicketData: new Map(),
      TicketTypes: [],
    });
  });
});

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

  it('aggregates duplicate purchase dates and ignores inactive or deleted orders', () => {
    const result = getPurchaseDataFromEvents([
      {
        ...vipEvent,
        orders: [
          ...orders,
          {
            ...orders[0],
            orderId: 12,
            purchaseDate: '2026-04-20',
            revenueUsd: 25,
            serviceFeesUsd: 2,
          },
          {
            ...orders[0],
            isActive: false,
            orderId: 13,
            purchaseDate: '2026-04-20',
          },
          {
            ...orders[0],
            isDeleted: true,
            orderId: 14,
            purchaseDate: '2026-04-20',
          },
        ],
      } as VipEvent,
    ]);

    expect(result[0]).toEqual(
      expect.objectContaining({
        PurchaseDate: '04/20/2026',
        Purchases: 2,
        Tickets: 4,
        TotalRevenueUsd: 137,
      }),
    );
  });

  it('covers empty purchase aggregation and optional monetary fields', () => {
    expect(getPurchaseDataFromEvents([])).toEqual([]);

    const result = getPurchaseDataFromEvents([
      {
        ...vipEvent,
        orders: [
          {
            ...orders[0],
            orderId: 15,
            purchaseDate: '2026-04-25',
            revenueRefundedUsd: undefined,
            serviceFeeRevenueChargedBackUsd: undefined,
            serviceFeeRevenueRefundedUsd: undefined,
            serviceFees: undefined,
            serviceFeesUsd: undefined,
          },
          {
            ...orders[1],
            orderId: 16,
            purchaseDate: '2026-04-25',
            revenueChargedBackUsd: undefined,
            revenueRefundedUsd: undefined,
            serviceFeeRevenueChargedBackUsd: undefined,
            serviceFeeRevenueRefundedUsd: undefined,
            serviceFeesUsd: undefined,
          },
        ],
      } as VipEvent,
    ]);

    expect(result).toEqual([
      expect.objectContaining({
        PurchaseDate: '04/25/2026',
        Purchases: 2,
        RevenueChargedBackUsd: 0,
        RevenueRefundedUsd: 0,
        ServiceFeeRevenueChargedBackUsd: 0,
        ServiceFeeRevenueRefundedUsd: 0,
        ServiceFeesUsd: 0,
        TotalRevenueUsd: 150,
      }),
    ]);

    const missingRevenueUpdate = getPurchaseDataFromEvents([
      {
        ...vipEvent,
        orders: [
          {
            ...orders[0],
            orderId: 17,
            purchaseDate: '2026-04-26',
          },
          {
            ...orders[1],
            orderId: 18,
            purchaseDate: '2026-04-26',
            revenueUsd: undefined,
            serviceFeesUsd: undefined,
          },
        ],
      } as VipEvent,
    ]);

    expect(missingRevenueUpdate).toEqual([
      expect.objectContaining({
        PurchaseDate: '04/26/2026',
        Purchases: 2,
        RevenueUsd: 100,
        TotalRevenueUsd: 110,
      }),
    ]);
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

  it('covers shirt aggregation branches for empty data, duplicates, and size ordering', () => {
    expect(
      getShirtDataFromEvents([
        {
          ...vipEvent,
          eventDate: '2026-05-02T12:00:00Z',
          shirtSales: undefined,
          totalShirts: 0,
        },
      ]),
    ).toBeUndefined();

    const duplicateEventShirts = getShirtDataFromEvents([
      {
        ...vipEvent,
        shirtSales: [
          { size: 'L', total: 1 },
          { size: 'S', total: 2 },
          { size: 'L', total: 3 },
        ],
        totalShirts: 6,
      },
    ]);
    expect(duplicateEventShirts?.ShirtSizes).toEqual(['S', 'L']);
    expect(duplicateEventShirts?.ShirtData?.get('05/01/2026')).toEqual(
      expect.arrayContaining([
        { Number: 2, ShirtSize: 'S' },
        { Number: 4, ShirtSize: 'L' },
      ]),
    );

    const duplicateOrderShirts = getShirtDataFromOrders([
      {
        ...orders[0],
        tickets: [
          ...(orders[0]?.tickets ?? []),
          {
            isActive: true,
            shirtSize: 'L',
            ticketSocketOrderTicketId: 99,
            ticketType: 'VIP',
          },
        ],
        totalShirts: 3,
      },
      {
        ...orders[1],
        tickets: [{ isActive: true, ticketSocketOrderTicketId: 100, ticketType: 'VIP' }],
        totalShirts: 0,
      },
    ] as Order[]);
    expect(duplicateOrderShirts?.ShirtSizes).toEqual(['M', 'L', 'XL']);
    expect(duplicateOrderShirts?.ShirtData?.get('04/20/2026')).toEqual(
      expect.arrayContaining([
        { Number: 1, ShirtSize: 'M' },
        { Number: 1, ShirtSize: 'XL' },
        { Number: 1, ShirtSize: 'L' },
      ]),
    );
    expect(duplicateOrderShirts?.ShirtData?.get('04/22/2026')).toEqual([]);
  });

  it('covers undefined shirt totals and duplicate shirt sizes in a single order', () => {
    const undefinedTotals = getShirtDataFromEvents([
      {
        ...vipEvent,
        eventDate: '2026-05-06T12:00:00Z',
        shirtSales: [{ size: 'XL' }, { size: 'XL' }, { size: 'XXL' }],
        totalShirts: 2,
      },
    ]);

    expect(undefinedTotals?.ShirtData?.get('05/06/2026')).toEqual(
      expect.arrayContaining([
        { Number: 0, ShirtSize: 'XL' },
        { Number: 0, ShirtSize: 'XXL' },
      ]),
    );

    const duplicateSameOrder = getShirtDataFromOrders([
      {
        ...orders[0],
        purchaseDate: '2026-04-26',
        tickets: [
          {
            isActive: true,
            shirtSize: 'M',
            ticketSocketOrderTicketId: 201,
            ticketType: 'GA',
          },
          {
            isActive: true,
            shirtSize: 'M',
            ticketSocketOrderTicketId: 202,
            ticketType: 'VIP',
          },
          {
            isActive: true,
            ticketSocketOrderTicketId: 203,
            ticketType: 'VIP',
          },
        ],
        totalShirts: 2,
      },
      {
        ...orders[1],
        purchaseDate: '2026-04-27',
        totalShirts: undefined,
      },
    ] as Order[]);

    expect(duplicateSameOrder?.ShirtData?.get('04/26/2026')).toEqual([
      { Number: 2, ShirtSize: 'M' },
    ]);
    expect(duplicateSameOrder?.ShirtData?.get('04/27/2026')).toEqual([]);

    const noMediumShirts = getShirtDataFromOrders([
      {
        ...orders[0],
        purchaseDate: '2026-04-28',
        tickets: [
          {
            isActive: true,
            shirtSize: 'S',
            ticketSocketOrderTicketId: 301,
            ticketType: 'GA',
          },
          {
            isActive: true,
            shirtSize: 'XL',
            ticketSocketOrderTicketId: 302,
            ticketType: 'VIP',
          },
        ],
        totalShirts: 2,
      },
    ] as Order[]);

    expect(noMediumShirts?.ShirtSizes).toEqual(['S', 'XL']);
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

  it('covers derived ticket types and no-ticket event rows', () => {
    const derivedEvent = {
      ...vipEvent,
      eventDate: '2026-05-03T12:00:00Z',
      hasTicketTypeData: false,
      orders: [
        {
          ...orders[0],
          isActive: false,
          orderId: 20,
        },
        {
          ...orders[1],
          orderId: 21,
          tickets: [
            {
              isActive: true,
              ticketSocketOrderTicketId: 31,
              ticketType: 'Meet & Greet',
            },
            {
              isActive: false,
              ticketSocketOrderTicketId: 32,
              ticketType: 'Ignored',
            },
          ],
        },
      ],
      ticketTypes: undefined,
    } as VipEvent;

    const derivedEventTicketData = getTicketDataFromEvents([derivedEvent]);
    expect(derivedEventTicketData.TicketTypes[0]).toEqual(
      expect.objectContaining({
        ticketTypeName: 'Meet & Greet',
      }),
    );
    expect(derivedEventTicketData.TicketData?.get('05/03/2026')).toEqual([
      { Number: 1, TicketType: 'Meet & Greet' },
    ]);

    const noTicketsEventData = getTicketDataFromEvents([
      {
        ...vipEvent,
        eventDate: '2026-05-04T12:00:00Z',
        orders: [{ ...orders[0], isActive: false, orderId: 30 }],
      } as VipEvent,
    ]);
    expect(noTicketsEventData.TicketData?.get('05/04/2026')).toEqual([]);

    const derivedOrderTicketData = getTicketDataFromOrders(
      [
        {
          ...orders[0],
          tickets: [
            {
              isActive: true,
              ticketSocketOrderTicketId: 41,
              ticketType: 'New Type',
            },
            {
              isActive: true,
              ticketSocketOrderTicketId: 42,
              ticketType: 'New Type',
            },
          ],
        },
      ] as Order[],
      {
        ...vipEvent,
        hasTicketTypeData: false,
        ticketTypes: undefined,
      },
    );
    expect(derivedOrderTicketData.TicketTypes[0]).toEqual(
      expect.objectContaining({
        ticketTypeName: 'New Type',
      }),
    );
    expect(derivedOrderTicketData.TicketData?.get('05/01/2026')).toEqual([
      { Number: 2, TicketType: 'New Type' },
    ]);
  });

  it('deduplicates predefined ticket types when names only differ by case', () => {
    const duplicateDefinedTypes = getTicketDataFromEvents([
      {
        ...vipEvent,
        hasTicketTypeData: true,
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
            ticketTypeName: 'ga',
            totalAvailable: 100,
          },
        ],
      },
    ]);

    expect(duplicateDefinedTypes.TicketTypes).toHaveLength(1);

    const duplicateDefinedOrderTypes = getTicketDataFromOrders(orders, {
      ...vipEvent,
      hasTicketTypeData: true,
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
          ticketTypeName: 'ga',
          totalAvailable: 100,
        },
      ],
    });

    expect(duplicateDefinedOrderTypes.TicketTypes).toHaveLength(1);

    const duplicateOrderDefinedTypes = getTicketDataFromOrders(orders, {
      ...vipEvent,
      hasTicketTypeData: undefined,
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
          ticketTypeName: 'ga',
          totalAvailable: 100,
        },
      ],
    });

    expect(duplicateOrderDefinedTypes.TicketTypes).toHaveLength(2);

    const inactiveOrderTicketData = getTicketDataFromOrders(
      [
        {
          ...orders[0],
          tickets: [
            {
              isActive: false,
              ticketSocketOrderTicketId: 401,
              ticketType: 'Skipped',
            },
          ],
        },
      ] as Order[],
      {
        ...vipEvent,
        hasTicketTypeData: undefined,
        ticketTypes: undefined,
      },
    );

    expect(inactiveOrderTicketData.TicketData?.get('05/01/2026')).toBeUndefined();
  });
});

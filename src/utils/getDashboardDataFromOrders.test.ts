import moment from 'moment';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import getDashboardDataFromOrders from './getDashboardDataFromOrders';

describe('getDashboardDataFromOrders', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-23T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('rolls daily order data into dashboard totals and drill-down structures', () => {
    const dashboardData = getDashboardDataFromOrders(
      {
        end: moment('2026-04-23').endOf('day').unix(),
        reloadOrders: false,
        start: moment('2026-04-22').startOf('day').unix(),
      },
      {
        dailyOrderData: [
          {
            city: 'Los Angeles',
            country: 'USA',
            currencySymbol: '$',
            eventDate: '2026-04-20T00:00:00Z',
            eventTitle: 'Show One',
            exchangeRate: 1,
            lastUpdate: '2026-04-23T11:30:00Z',
            orders: 2,
            purchaseDate: '2026-04-22',
            revenueChargedBackUsd: 0,
            revenueRefundedUsd: 10,
            sellerId: 1,
            sellerName: 'Artist One',
            serviceFeeRevenueChargedBackUsd: 0,
            serviceFeeRevenueRefundedUsd: 1,
            serviceFeesRevenue: 20,
            serviceFeesRevenueUsd: 20,
            state: 'CA',
            ticketRevenue: 100,
            ticketRevenueUsd: 100,
            ticketSocketEventId: 101,
            ticketSocketId: 2,
            tickets: 5,
            totalRevenue: 120,
            totalRevenueUsd: 120,
            venue: 'Forum',
            zip: '90001',
          },
          {
            city: 'New York',
            country: 'USA',
            currencySymbol: '$',
            eventDate: '2026-04-21T00:00:00Z',
            eventTitle: 'Show Two',
            exchangeRate: 1,
            lastUpdate: '2026-04-23T12:00:00Z',
            numTicketsChargedBack: 1,
            numTicketsRefunded: 1,
            orders: 1,
            purchaseDate: '2026-04-23',
            revenueChargedBackUsd: 15,
            revenueRefundedUsd: 5,
            sellerId: 2,
            sellerName: 'Artist Two',
            serviceFeeRevenueChargedBackUsd: 2,
            serviceFeeRevenueRefundedUsd: 1,
            serviceFeesRevenue: 10,
            serviceFeesRevenueUsd: 10,
            state: 'NY',
            ticketRevenue: 80,
            ticketRevenueUsd: 80,
            ticketSocketEventId: 102,
            ticketSocketId: 4,
            tickets: 2,
            totalRevenue: 90,
            totalRevenueUsd: 90,
            venue: 'MSG',
            zip: '10001',
          },
        ],
        day: 23,
        dayOfYear: 113,
        daysInMonth: 30,
        month: 4,
        monthlyRevenueGoal: 1000,
        orders: 3,
        serviceFeesRevenueUsd: 30,
        ticketRevenueUsd: 180,
        tickets: 7,
        totalDaysInYear: 365,
        totalRevenueUsd: 210,
        yearlyRevenueGoal: 5000,
        year: 2026,
      } as never,
    );

    expect(dashboardData.totalRevenueUsd).toBe(210);
    expect(dashboardData.tickets).toBe(7);
    expect(dashboardData.purchases).toBe(3);
    expect(dashboardData.topSellers[0]).toEqual({
      revenueUsd: 120,
      sellerId: 1,
      sellerName: 'Artist One',
    });
    expect(dashboardData.topVenues[0]?.location).toBe('Forum');
    expect(dashboardData.totalsByAccount).toHaveLength(2);
    expect(dashboardData.ticketSalesData).toHaveLength(2);

    const firstEventData = dashboardData.ticketSalesData;

    expect(firstEventData).toBeDefined();

    if (!firstEventData) {
      throw new Error('Expected first event data');
    }

    const firstEventSales = firstEventData[0]?.children?.[0]?.children?.[0];

    expect(firstEventSales).toBeDefined();

    if (!firstEventSales) {
      throw new Error('Expected first event sales row');
    }

    expect(firstEventSales).toMatchObject({
      EventId: 102,
      SellerName: 'Artist Two',
    });
    expect(dashboardData.lastUpdated).toContain('PDT');
  });

  it('handles empty dashboard input without throwing and returns empty aggregates', () => {
    const dashboardData = getDashboardDataFromOrders(
      {
        end: moment('2026-04-23').endOf('day').unix(),
        reloadOrders: false,
        start: moment('2026-04-22').startOf('day').unix(),
      },
      {
        day: 23,
        dayOfYear: 113,
        daysInMonth: 30,
        month: 4,
        monthlyRevenueGoal: 1000,
        orders: 0,
        serviceFeesRevenueUsd: 0,
        ticketRevenueUsd: 0,
        tickets: 0,
        totalDaysInYear: 365,
        totalRevenueUsd: 0,
        yearlyRevenueGoal: 5000,
        year: 2026,
      } as never,
    );

    expect(dashboardData.ticketSalesData).toEqual([]);
    expect(dashboardData.topSellers).toEqual([]);
    expect(dashboardData.topLocations).toEqual([]);
    expect(dashboardData.topVenues).toEqual([]);
    expect(dashboardData.totalsByAccount).toEqual([]);
  });

  it('covers update paths, placeholder dates, and top-10 truncation', () => {
    const dailyOrderData = Array.from({ length: 11 }, (_, index) => ({
      city: `City ${index}`,
      country: 'USA',
      currencySymbol: '$',
      eventDate: `2026-04-${String(index + 1).padStart(2, '0')}T00:00:00Z`,
      eventTitle: `Show ${index}`,
      exchangeRate: 1,
      lastUpdate: `2026-04-24T${String(index).padStart(2, '0')}:00:00Z`,
      numTicketsChargedBack: index % 2 === 0 ? undefined : 1,
      numTicketsRefunded: index % 2 === 0 ? undefined : 1,
      orders: 1,
      purchaseDate: index < 2 ? '2026-04-20' : `2026-04-${String(index + 20).padStart(2, '0')}`,
      revenueChargedBackUsd: index % 2 === 0 ? undefined : 5,
      revenueRefundedUsd: index % 2 === 0 ? undefined : 3,
      sellerId: index + 1,
      sellerName: `Seller ${index}`,
      serviceFeeRevenueChargedBackUsd: index % 2 === 0 ? undefined : 1,
      serviceFeeRevenueRefundedUsd: index % 2 === 0 ? undefined : 1,
      serviceFeesRevenue: 10 + index,
      serviceFeesRevenueUsd: 10 + index,
      state: `S${index}`,
      ticketRevenue: 100 + index,
      ticketRevenueUsd: 100 + index,
      ticketSocketEventId: index < 2 ? 999 : 200 + index,
      ticketSocketId: index < 2 ? 2 : 3 + index,
      tickets: 2 + index,
      totalRevenue: 110 + index,
      totalRevenueUsd: 110 + index,
      venue: `Venue ${index}`,
      zip: `${90000 + index}`,
    }));

    const dashboardData = getDashboardDataFromOrders(
      {
        end: moment('2026-04-30').endOf('day').unix(),
        reloadOrders: false,
        start: moment('2026-04-20').startOf('day').unix(),
      },
      {
        dailyOrderData,
        day: 24,
        dayOfYear: 114,
        daysInMonth: 30,
        month: 4,
        monthlyRevenueGoal: 1000,
        orders: 11,
        serviceFeesRevenueUsd: 200,
        ticketRevenueUsd: 1500,
        tickets: 80,
        totalDaysInYear: 365,
        totalRevenueUsd: 1700,
        yearlyRevenueGoal: 5000,
        year: 2026,
      } as never,
    );

    const ticketSalesData = dashboardData.ticketSalesData ?? [];

    expect(ticketSalesData.some((row) => row.Purchases === 0)).toBe(true);
    expect(dashboardData.topSellers).toHaveLength(10);
    expect(dashboardData.topLocations).toHaveLength(10);
    expect(dashboardData.topVenues).toHaveLength(10);
    expect(dashboardData.totalsByAccount.length).toBeGreaterThan(1);
    expect(ticketSalesData[ticketSalesData.length - 1]?.children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          SellerName: 'Seller 0',
        }),
        expect.objectContaining({
          SellerName: 'Seller 1',
        }),
      ]),
    );
  });

  it('aggregates repeated seller, venue, and event rows into nested drill-down data', () => {
    const repeatedRows = [
      {
        city: 'Chicago',
        country: 'USA',
        currencySymbol: '$',
        eventDate: '2026-04-20T00:00:00Z',
        eventTitle: 'Show One',
        exchangeRate: 1,
        lastUpdate: '2026-04-24T11:00:00Z',
        orders: 1,
        purchaseDate: '2026-04-22',
        revenueChargedBack: 1,
        revenueChargedBackUsd: 1,
        revenueRefunded: 2,
        revenueRefundedUsd: 2,
        sellerId: 7,
        sellerName: 'Artist Alpha',
        serviceFeeRevenueChargedBack: 0.5,
        serviceFeeRevenueChargedBackUsd: 0.5,
        serviceFeeRevenueRefunded: 0.25,
        serviceFeeRevenueRefundedUsd: 0.25,
        serviceFeesRevenue: 10,
        serviceFeesRevenueUsd: 10,
        state: 'IL',
        ticketRevenue: 90,
        ticketRevenueUsd: 90,
        ticketSocketEventId: 900,
        ticketSocketId: 8,
        tickets: 2,
        totalRevenue: 100,
        totalRevenueUsd: 100,
        venue: 'United Center',
        zip: '60601',
      },
      {
        city: 'Chicago',
        country: 'USA',
        currencySymbol: '$',
        eventDate: '2026-04-20T00:00:00Z',
        eventTitle: 'Show One',
        exchangeRate: 1,
        lastUpdate: '2026-04-24T10:00:00Z',
        orders: 2,
        purchaseDate: '2026-04-22',
        revenueChargedBack: 2,
        revenueChargedBackUsd: 2,
        revenueRefunded: 3,
        revenueRefundedUsd: 3,
        sellerId: 7,
        sellerName: 'Artist Alpha',
        serviceFeeRevenueChargedBack: 0.75,
        serviceFeeRevenueChargedBackUsd: 0.75,
        serviceFeeRevenueRefunded: 0.5,
        serviceFeeRevenueRefundedUsd: 0.5,
        serviceFeesRevenue: 12,
        serviceFeesRevenueUsd: 12,
        state: 'IL',
        ticketRevenue: 110,
        ticketRevenueUsd: 110,
        ticketSocketEventId: 900,
        ticketSocketId: 8,
        tickets: 3,
        totalRevenue: 122,
        totalRevenueUsd: 122,
        venue: 'United Center',
        zip: '60601',
      },
      {
        city: 'Chicago',
        country: 'USA',
        currencySymbol: '$',
        eventDate: '2026-04-21T00:00:00Z',
        eventTitle: 'Show Two',
        exchangeRate: 1,
        lastUpdate: '2026-04-24T09:00:00Z',
        orders: 1,
        purchaseDate: '2026-04-22',
        revenueChargedBack: 0,
        revenueChargedBackUsd: 0,
        revenueRefunded: 0,
        revenueRefundedUsd: 0,
        sellerId: 7,
        sellerName: 'Artist Alpha',
        serviceFeeRevenueChargedBack: 0,
        serviceFeeRevenueChargedBackUsd: 0,
        serviceFeeRevenueRefunded: 0,
        serviceFeeRevenueRefundedUsd: 0,
        serviceFeesRevenue: 8,
        serviceFeesRevenueUsd: 8,
        state: 'IL',
        ticketRevenue: 70,
        ticketRevenueUsd: 70,
        ticketSocketEventId: 901,
        ticketSocketId: 8,
        tickets: 1,
        totalRevenue: 78,
        totalRevenueUsd: 78,
        venue: 'United Center',
        zip: '60601',
      },
      {
        city: 'Chicago',
        country: 'USA',
        currencySymbol: '$',
        eventDate: '2026-04-22T00:00:00Z',
        eventTitle: 'Show Three',
        exchangeRate: 1,
        lastUpdate: '2026-04-24T08:00:00Z',
        orders: 1,
        purchaseDate: '2026-04-22',
        revenueChargedBack: 0,
        revenueChargedBackUsd: 0,
        revenueRefunded: 0,
        revenueRefundedUsd: 0,
        sellerId: 8,
        sellerName: 'Artist Beta',
        serviceFeeRevenueChargedBack: 0,
        serviceFeeRevenueChargedBackUsd: 0,
        serviceFeeRevenueRefunded: 0,
        serviceFeeRevenueRefundedUsd: 0,
        serviceFeesRevenue: 9,
        serviceFeesRevenueUsd: 9,
        state: 'IL',
        ticketRevenue: 70,
        ticketRevenueUsd: 70,
        ticketSocketEventId: 902,
        ticketSocketId: 9,
        tickets: 1,
        totalRevenue: 79,
        totalRevenueUsd: 79,
        venue: 'United Center',
        zip: '60601',
      },
    ];

    const dashboardData = getDashboardDataFromOrders(
      {
        end: moment('2026-04-24').endOf('day').unix(),
        reloadOrders: false,
        start: moment('2026-04-22').startOf('day').unix(),
      },
      {
        dailyOrderData: repeatedRows,
        day: 24,
        dayOfYear: 114,
        daysInMonth: 30,
        month: 4,
        monthlyRevenueGoal: 1000,
        orders: 5,
        serviceFeesRevenueUsd: 39,
        ticketRevenueUsd: 340,
        tickets: 7,
        totalDaysInYear: 365,
        totalRevenueUsd: 379,
        yearlyRevenueGoal: 5000,
        year: 2026,
      } as never,
    );

    const sameDayRow = (dashboardData.ticketSalesData ?? [])[0];
    const alphaSeller = sameDayRow?.children?.find((child) => child.SellerName === 'Artist Alpha');
    const betaSeller = sameDayRow?.children?.find((child) => child.SellerName === 'Artist Beta');
    const showOne = alphaSeller?.children?.find((child) => child.EventId === 900);
    const showTwo = alphaSeller?.children?.find((child) => child.EventId === 901);

    expect(dashboardData.topSellers[0]).toEqual({
      revenueUsd: 300,
      sellerId: 7,
      sellerName: 'Artist Alpha',
    });
    expect(dashboardData.topLocations[0]?.revenueUsd).toBe(379);
    expect(dashboardData.topVenues[0]?.revenueUsd).toBe(379);

    expect(alphaSeller).toMatchObject({
      Purchases: 4,
      RevenueUsd: 270,
      ServiceFeesUsd: 30,
      Tickets: 6,
      TotalRevenueUsd: 300,
    });
    expect(betaSeller).toMatchObject({
      SellerName: 'Artist Beta',
      TotalRevenueUsd: 79,
    });
    expect(showOne).toMatchObject({
      EventId: 900,
      Purchases: 3,
      RevenueUsd: 200,
      ServiceFeesUsd: 22,
      Tickets: 5,
      TotalRevenueUsd: 222,
    });
    expect(showTwo).toMatchObject({
      EventId: 901,
      TotalRevenueUsd: 78,
    });
    expect(dashboardData.lastUpdated).toContain('4/24/2026');
  });

  it('handles equal top-seller totals and rows outside the selected range', () => {
    const dashboardData = getDashboardDataFromOrders(
      {
        end: moment('2026-04-24').endOf('day').unix(),
        reloadOrders: false,
        start: moment('2026-04-22').startOf('day').unix(),
      },
      {
        dailyOrderData: [
          {
            city: 'Boston',
            country: 'USA',
            currencySymbol: '$',
            eventDate: '2026-04-10T00:00:00Z',
            eventTitle: 'Ignored Range',
            exchangeRate: 1,
            lastUpdate: '2026-04-24T07:00:00Z',
            orders: 1,
            purchaseDate: '2026-03-01',
            sellerId: 20,
            sellerName: 'Outside Range',
            serviceFeesRevenue: 4,
            serviceFeesRevenueUsd: 4,
            state: 'MA',
            ticketRevenue: 40,
            ticketRevenueUsd: 40,
            ticketSocketEventId: 1000,
            ticketSocketId: 12,
            tickets: 1,
            totalRevenue: 44,
            totalRevenueUsd: 44,
            venue: 'Old Venue',
            zip: '02108',
          },
          {
            city: 'Seattle',
            country: 'USA',
            currencySymbol: '$',
            eventDate: '2026-04-23T00:00:00Z',
            eventTitle: 'Equal One',
            exchangeRate: 1,
            lastUpdate: '2026-04-24T06:00:00Z',
            orders: 1,
            purchaseDate: '2026-04-23',
            sellerId: 21,
            sellerName: 'Equal A',
            serviceFeesRevenue: 5,
            serviceFeesRevenueUsd: 5,
            state: 'WA',
            ticketRevenue: 45,
            ticketRevenueUsd: 45,
            ticketSocketEventId: 1001,
            ticketSocketId: 13,
            tickets: 1,
            totalRevenue: 50,
            totalRevenueUsd: 50,
            venue: 'Venue A',
            zip: '98101',
          },
          {
            city: 'Portland',
            country: 'USA',
            currencySymbol: '$',
            eventDate: '2026-04-23T00:00:00Z',
            eventTitle: 'Equal Two',
            exchangeRate: 1,
            lastUpdate: '2026-04-24T05:00:00Z',
            orders: 1,
            purchaseDate: '2026-04-24',
            sellerId: 22,
            sellerName: 'Equal B',
            serviceFeesRevenue: 5,
            serviceFeesRevenueUsd: 5,
            state: 'OR',
            ticketRevenue: 45,
            ticketRevenueUsd: 45,
            ticketSocketEventId: 1002,
            ticketSocketId: 14,
            tickets: 1,
            totalRevenue: 50,
            totalRevenueUsd: 50,
            venue: 'Venue B',
            zip: '97204',
          },
        ],
        day: 24,
        dayOfYear: 114,
        daysInMonth: 30,
        month: 4,
        monthlyRevenueGoal: 1000,
        orders: 3,
        serviceFeesRevenueUsd: 14,
        ticketRevenueUsd: 130,
        tickets: 3,
        totalDaysInYear: 365,
        totalRevenueUsd: 144,
        yearlyRevenueGoal: 5000,
        year: 2026,
      } as never,
    );

    expect(dashboardData.purchases).toBe(2);
    expect(dashboardData.ticketSalesData).toHaveLength(2);
    expect(dashboardData.topSellers.map((seller) => seller.revenueUsd)).toEqual([50, 50]);
    expect(dashboardData.topLocations.map((location) => location.revenueUsd)).toEqual([50, 50]);
    expect(dashboardData.topVenues.map((venue) => venue.revenueUsd)).toEqual([50, 50]);
  });

  it('covers optional dashboard fields with missing seller, location, and currency data', () => {
    const dashboardData = getDashboardDataFromOrders(
      {
        end: moment('2026-04-24').endOf('day').unix(),
        reloadOrders: false,
        start: moment('2026-04-22').startOf('day').unix(),
      },
      {
        dailyOrderData: [
          {
            city: 'Atlanta',
            country: 'USA',
            eventDate: '2026-03-01T00:00:00Z',
            eventTitle: 'Outside Month',
            lastUpdate: '2026-04-24T04:00:00Z',
            orders: 1,
            purchaseDate: '2026-03-01',
            serviceFeesRevenue: 0,
            serviceFeesRevenueUsd: 0,
            ticketRevenue: 0,
            ticketRevenueUsd: 0,
            ticketSocketEventId: 1100,
            ticketSocketId: 40,
            tickets: undefined,
            totalRevenue: 0,
            totalRevenueUsd: 0,
          },
          {
            city: '',
            country: 'USA',
            currencySymbol: undefined,
            eventDate: '2026-04-23T00:00:00Z',
            eventTitle: 'Missing Seller',
            exchangeRate: undefined,
            lastUpdate: '2026-04-24T03:00:00Z',
            orders: 1,
            purchaseDate: '2026-04-23',
            sellerName: 'No Seller Id',
            serviceFeesRevenue: 5,
            serviceFeesRevenueUsd: 5,
            ticketRevenue: 45,
            ticketRevenueUsd: 45,
            ticketSocketEventId: 1101,
            ticketSocketId: 41,
            tickets: 1,
            totalRevenue: 50,
            totalRevenueUsd: 50,
            venue: '',
            zip: '',
          },
          {
            city: '',
            country: 'USA',
            currencySymbol: undefined,
            eventDate: '2026-04-23T00:00:00Z',
            eventTitle: 'Missing Details',
            exchangeRate: undefined,
            lastUpdate: '2026-04-24T02:00:00Z',
            orders: 1,
            purchaseDate: '2026-04-23',
            revenueChargedBack: undefined,
            revenueChargedBackUsd: undefined,
            revenueRefunded: undefined,
            revenueRefundedUsd: undefined,
            sellerId: 42,
            sellerName: undefined,
            serviceFeeRevenueChargedBack: undefined,
            serviceFeeRevenueChargedBackUsd: undefined,
            serviceFeeRevenueRefunded: undefined,
            serviceFeeRevenueRefundedUsd: undefined,
            serviceFeesRevenue: 6,
            serviceFeesRevenueUsd: 6,
            ticketRevenue: 54,
            ticketRevenueUsd: 54,
            ticketSocketEventId: 1102,
            ticketSocketId: 42,
            tickets: 1,
            totalRevenue: 60,
            totalRevenueUsd: 60,
            venue: '',
            zip: '',
          },
          {
            city: '',
            country: 'USA',
            currencySymbol: undefined,
            eventDate: '2026-04-23T00:00:00Z',
            eventTitle: 'Missing Details',
            exchangeRate: undefined,
            lastUpdate: '2026-04-24T01:00:00Z',
            orders: 1,
            purchaseDate: '2026-04-23',
            revenueChargedBack: undefined,
            revenueChargedBackUsd: undefined,
            revenueRefunded: undefined,
            revenueRefundedUsd: undefined,
            sellerId: 42,
            sellerName: undefined,
            serviceFeeRevenueChargedBack: undefined,
            serviceFeeRevenueChargedBackUsd: undefined,
            serviceFeeRevenueRefunded: undefined,
            serviceFeeRevenueRefundedUsd: undefined,
            serviceFeesRevenue: 7,
            serviceFeesRevenueUsd: 7,
            ticketRevenue: 63,
            ticketRevenueUsd: 63,
            ticketSocketEventId: 1102,
            ticketSocketId: 42,
            tickets: 1,
            totalRevenue: 70,
            totalRevenueUsd: 70,
            venue: '',
            zip: '',
          },
          {
            city: '',
            country: 'USA',
            currencySymbol: undefined,
            eventDate: '2026-04-24T00:00:00Z',
            eventTitle: 'Second Seller',
            exchangeRate: undefined,
            lastUpdate: '2026-04-24T00:30:00Z',
            orders: 1,
            purchaseDate: '2026-04-23',
            revenueChargedBackUsd: undefined,
            revenueRefundedUsd: undefined,
            sellerId: 43,
            sellerName: 'Second Seller',
            serviceFeeRevenueChargedBackUsd: undefined,
            serviceFeeRevenueRefundedUsd: undefined,
            serviceFeesRevenue: 8,
            serviceFeesRevenueUsd: 8,
            ticketRevenue: 72,
            ticketRevenueUsd: 72,
            ticketSocketEventId: 1103,
            ticketSocketId: 43,
            tickets: 1,
            totalRevenue: 80,
            totalRevenueUsd: 80,
            venue: '',
            zip: '',
          },
        ],
        day: 24,
        dayOfYear: 114,
        daysInMonth: 30,
        month: 4,
        monthlyRevenueGoal: 1000,
        orders: 5,
        serviceFeesRevenueUsd: 26,
        ticketRevenueUsd: 234,
        tickets: 4,
        totalDaysInYear: 365,
        totalRevenueUsd: 260,
        yearlyRevenueGoal: 5000,
        year: 2026,
      } as never,
    );

    const sameDayRow = (dashboardData.ticketSalesData ?? []).find(
      (row) => row.PurchaseDate === '4/23/2026',
    );
    const unnamedSeller = sameDayRow?.children?.find((child) => child.SellerName === 'undefined');
    const secondSeller = sameDayRow?.children?.find(
      (child) => child.SellerName === 'Second Seller',
    );

    expect(dashboardData.topSellers).toEqual(
      expect.arrayContaining([expect.objectContaining({ sellerId: 42, sellerName: '' })]),
    );
    expect(dashboardData.topLocations).toEqual([]);
    expect(dashboardData.topVenues).toEqual([]);
    expect(unnamedSeller?.children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          CurrencySymbol: '$',
          EventId: 1102,
          ExchangeRate: 1,
        }),
      ]),
    );
    expect(secondSeller).toMatchObject({
      RevenueRefundedUsd: 0,
      ServiceFeeRevenueRefundedUsd: 0,
    });
  });

  it('updates one seller event without rewriting sibling event rows', () => {
    const dashboardData = getDashboardDataFromOrders(
      {
        end: moment('2026-04-24').endOf('day').unix(),
        reloadOrders: false,
        start: moment('2026-04-22').startOf('day').unix(),
      },
      {
        dailyOrderData: [
          {
            city: 'Phoenix',
            country: 'USA',
            currencySymbol: '$',
            eventDate: '2026-04-20T00:00:00Z',
            eventTitle: 'First Event',
            exchangeRate: 1,
            lastUpdate: '2026-04-24T12:00:00Z',
            orders: 1,
            purchaseDate: '2026-04-23',
            sellerId: 51,
            sellerName: 'Artist Gamma',
            serviceFeesRevenue: 5,
            serviceFeesRevenueUsd: 5,
            ticketRevenue: 45,
            ticketRevenueUsd: 45,
            ticketSocketEventId: 1200,
            ticketSocketId: 51,
            tickets: 1,
            totalRevenue: 50,
            totalRevenueUsd: 50,
            venue: 'Venue One',
            zip: '85001',
          },
          {
            city: 'Phoenix',
            country: 'USA',
            currencySymbol: '$',
            eventDate: '2026-04-21T00:00:00Z',
            eventTitle: 'Second Event',
            exchangeRate: 1,
            lastUpdate: '2026-04-24T11:00:00Z',
            orders: 1,
            purchaseDate: '2026-04-23',
            sellerId: 51,
            sellerName: 'Artist Gamma',
            serviceFeesRevenue: 6,
            serviceFeesRevenueUsd: 6,
            ticketRevenue: 54,
            ticketRevenueUsd: 54,
            ticketSocketEventId: 1201,
            ticketSocketId: 51,
            tickets: 1,
            totalRevenue: 60,
            totalRevenueUsd: 60,
            venue: 'Venue One',
            zip: '85001',
          },
          {
            city: 'Phoenix',
            country: 'USA',
            currencySymbol: '$',
            eventDate: '2026-04-20T00:00:00Z',
            eventTitle: 'First Event',
            exchangeRate: 1,
            lastUpdate: '2026-04-24T10:00:00Z',
            orders: 1,
            purchaseDate: '2026-04-23',
            sellerId: 51,
            sellerName: 'Artist Gamma',
            serviceFeesRevenue: 7,
            serviceFeesRevenueUsd: 7,
            ticketRevenue: 63,
            ticketRevenueUsd: 63,
            ticketSocketEventId: 1200,
            ticketSocketId: 51,
            tickets: 1,
            totalRevenue: 70,
            totalRevenueUsd: 70,
            venue: 'Venue One',
            zip: '85001',
          },
        ],
        day: 24,
        dayOfYear: 114,
        daysInMonth: 30,
        month: 4,
        monthlyRevenueGoal: 1000,
        orders: 3,
        serviceFeesRevenueUsd: 18,
        ticketRevenueUsd: 162,
        tickets: 3,
        totalDaysInYear: 365,
        totalRevenueUsd: 180,
        yearlyRevenueGoal: 5000,
        year: 2026,
      } as never,
    );

    const sellerChildren = (dashboardData.ticketSalesData ?? [])[0]?.children?.[0]?.children;

    expect(sellerChildren).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ EventId: 1200, TotalRevenueUsd: 120 }),
        expect.objectContaining({ EventId: 1201, TotalRevenueUsd: 60 }),
      ]),
    );
  });
});

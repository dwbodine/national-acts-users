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
      } as never,
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
    expect(dashboardData.ticketSalesData[0]?.children?.[0]?.children?.[0]).toEqual(
      expect.objectContaining({
        EventId: 102,
        SellerName: 'Artist Two',
      }),
    );
    expect(dashboardData.lastUpdated).toContain('PDT');
  });
});

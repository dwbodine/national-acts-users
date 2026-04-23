import { render } from '@testing-library/react';
import moment from 'moment-timezone';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Venue } from '@/types/event';
import type { IDailyOrderData } from '@/types/user';

import {
  exportCustomerDataToCsv,
  exportDashboardOrdersToCsv,
  exportEventCustomerDataToCsv,
  exportEventsToCsv,
  formatCurrencyAmount,
  getAccountNameFromTicketSocketId,
  getAddressFromExternalVenue,
  getEventStatusSlug,
  getEventStatusText,
  getLocationInfoFromDailyOrderData,
  getLocationInfoFromVenue,
  getOrderExportRow,
  getOrderExportTableFromEvent,
  getOrderExportTableHeader,
  getOrderStatusSlug,
  getOrderStatusText,
  getPacificMoment,
  getSellerStatusSlug,
  shouldRefreshEvent,
} from './eventUtils';

describe('eventUtils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-23T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const order = {
    currencyAbbrev: 'EUR',
    currencySymbol: 'EUR',
    email: 'jane@example.com',
    eventAddress: '1 Main St',
    eventCity: 'Paris',
    eventCountry: 'France',
    eventDate: '2026-05-01T12:00:00Z',
    eventId: 1,
    eventState: '',
    eventTitle: 'Show One',
    eventZip: '75000',
    exchangeRate: 1.2,
    hasChargebacks: false,
    hasRefunds: true,
    isActive: true,
    isComped: false,
    isDeleted: false,
    numTickets: 2,
    numTicketsRefunded: 1,
    orderId: 55,
    phone: '555-1111',
    purchaseDate: '2026-04-20',
    purchaseTimestamp: '2026-04-20T12:00:00Z',
    purchaserFirstName: 'Jane',
    purchaserIpAddress: '127.0.0.1',
    purchaserLastName: 'Doe',
    purchaserZipCode: '90210',
    revenue: 100,
    revenueUsd: 120,
    sellerName: 'National Acts',
    serviceFees: 10,
    serviceFeesUsd: 12,
    ticketSocketEventId: 99,
    ticketSocketOrderId: 1001,
    tickets: [
      {
        attendeeFirstName: 'Jane',
        attendeeLastName: 'Doe',
        isActive: true,
        isRefunded: false,
        shirtSize: 'M',
        ticketSocketOrderTicketId: 1,
        ticketType: 'VIP',
      },
      {
        attendeeFirstName: 'Guest',
        attendeeLastName: 'Doe',
        isActive: true,
        isRefunded: true,
        shirtSize: 'XL',
        ticketSocketOrderTicketId: 2,
        ticketType: 'VIP',
      },
    ],
    totalShirts: 2,
    venue: 'Olympia',
  } as never;

  const vipEvent = {
    announceDate: '2026-05-10T12:00:00Z',
    eventDate: '2026-05-15T12:00:00Z',
    externalEventId: 1,
    isActive: true,
    isDeleted: false,
    isExternal: false,
    orders: [order],
    sellerName: 'National Acts',
    ticketSocketEventId: 99,
    title: 'Show One',
    totalRevenue: 100,
    totalServiceFees: 10,
    totalTickets: 2,
    venue: {
      city: 'Paris',
      country: { countryId: 33, countryName: 'France' },
      name: 'Olympia',
      state: '',
    },
  } as never;

  it('formats pacific time and detects refresh windows', () => {
    expect(getPacificMoment(moment.utc('2026-04-23T12:00:00Z')).format('z')).toBe('PDT');
    expect(shouldRefreshEvent({ lastFetched: moment().unix() - 301 } as never)).toBe(true);
    expect(shouldRefreshEvent({ lastFetched: moment().unix() - 100 } as never)).toBe(false);
  });

  it('formats locations and status text', () => {
    expect(getLocationInfoFromVenue(vipEvent.venue as Venue)).toBe('Paris, France');
    expect(
      getLocationInfoFromDailyOrderData({
        city: 'Paris',
        country: 'France',
        state: '',
      } as IDailyOrderData),
    ).toBe('Paris');
    expect(getOrderStatusSlug(order)).toBe('refunded');
    expect(getOrderStatusText(order)).toBe('Partially Refunded');
    expect(getEventStatusSlug(vipEvent, false)).toBe('active-pending');
    expect(getEventStatusText(vipEvent, false)).toContain('Announce Date 05/10/2026');
    expect(getSellerStatusSlug({ isActive: false } as never)).toBe('inactive');
  });

  it('builds export headers and rows for customer data', () => {
    const header = getOrderExportTableHeader(true, true, true, true, true, 'EUR');
    expect(header).toContain('"Original Price (EUR)"');
    expect(header).toContain('"Service Fees (USD)"');

    const row = getOrderExportRow(order, true, true, true, true, true);
    expect(row).toContain('"Doe, Jane"');
    expect(row).toContain('"VIP (2)"');
    expect(row).toContain('"M / XL"');
    expect(row).toContain('"100.00 EUR"');
  });

  it('exports event, customer, and dashboard CSV content', () => {
    expect(exportEventsToCsv([vipEvent], true, true)).toContain('"Show One"');
    expect(exportCustomerDataToCsv([vipEvent], true, true, true, true, true, 'EUR')).toContain(
      '"jane@example.com"',
    );
    expect(
      exportEventCustomerDataToCsv(vipEvent, true, true, true, true, 'EUR', true, false),
    ).toContain('"Email"');
    expect(
      exportDashboardOrdersToCsv({
        currentDashboardData: { orders: [order] },
        end: 1716249599,
        reloadOrders: false,
        start: 1715644800,
      } as never),
    ).toContain('Admin dashboard - orders from');
    expect(getOrderExportTableFromEvent(vipEvent, true, true, true, true, true)).toContain(
      '"jane@example.com"',
    );
  });

  it('formats external venue addresses and account names', () => {
    expect(
      getAddressFromExternalVenue({
        address: '1 Main St',
        city: 'Paris',
        country: { countryId: 33, countryName: 'France' },
        state: '',
        zipCode: '75000',
      } as never),
    ).toBe('1 Main St, Paris 75000, France');

    expect(getAccountNameFromTicketSocketId(3)).toBe('Australian VIP tickets');
    expect(getAccountNameFromTicketSocketId(99)).toBe('USA VIP Tickets');
  });

  it('formats currency amounts for both admin and user views', () => {
    const { container } = render(<div>{formatCurrencyAmount(100, 120, 'EUR', 1.2, true)}</div>);

    expect(container.textContent).toContain('EUR100.00');
    expect(container.textContent).toContain('($120.00)');
    expect(formatCurrencyAmount(undefined, 50, '$', 1, false)).toBe('$50.00');
  });
});

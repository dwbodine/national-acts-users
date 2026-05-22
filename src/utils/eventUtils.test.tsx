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
  };

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
  };

  it('formats pacific time and detects refresh windows', () => {
    expect(getPacificMoment(moment.utc('2026-04-23T12:00:00Z')).format('z')).toBe('PDT');
    expect(shouldRefreshEvent(undefined)).toBe(false);
    expect(shouldRefreshEvent({ lastFetched: 0 } as never)).toBe(false);
    expect(shouldRefreshEvent({ lastFetched: moment().unix() - 301 } as never)).toBe(true);
    expect(shouldRefreshEvent({ lastFetched: moment().unix() - 100 } as never)).toBe(false);
  });

  it('formats locations and status text', () => {
    expect(getLocationInfoFromVenue(vipEvent.venue as Venue)).toBe('Paris, France');
    expect(getLocationInfoFromVenue({ city: 'Nashville', state: 'TN' } as Venue)).toBe(
      'Nashville, TN',
    );
    expect(
      getLocationInfoFromDailyOrderData({
        city: 'Paris',
        country: 'France',
        state: 'TX',
      } as IDailyOrderData),
    ).toBe('Paris, TX, France');
    expect(
      getLocationInfoFromDailyOrderData({
        city: 'Paris',
        country: 'USA',
        state: '',
      } as IDailyOrderData),
    ).toBe('Paris');
    expect(getOrderStatusSlug(order)).toBe('refunded');
    expect(getOrderStatusText(order)).toBe('Partially Refunded');
    expect(getEventStatusSlug(vipEvent, false)).toBe('active-pending');
    expect(getEventStatusText(vipEvent, false)).toContain('Announce Date 05/10/2026');
    expect(getOrderStatusSlug(undefined)).toBe('');
    expect(getOrderStatusSlug({ isComped: true } as never)).toBe('comped');
    expect(getOrderStatusSlug({ isDeleted: true } as never)).toBe('deleted');
    expect(getOrderStatusSlug({ hasChargebacks: true } as never)).toBe('charged-back');
    expect(getOrderStatusSlug({ hasRefunds: false, isActive: false } as never)).toBe('inactive');
    expect(
      getOrderStatusSlug({ hasRefunds: false, hasChargebacks: false, isActive: true } as never),
    ).toBe('active');
    expect(getOrderStatusText({ isComped: true } as never)).toBe('Comped');
    expect(getOrderStatusText({ isDeleted: true } as never)).toBe('Deleted');
    expect(getOrderStatusText({ hasChargebacks: true } as never)).toBe('Charged Back');
    expect(getOrderStatusText({ hasRefunds: true, tickets: [{ isRefunded: true }] } as never)).toBe(
      'Refunded',
    );
    expect(
      getOrderStatusText({ hasRefunds: false, hasChargebacks: false, isActive: true } as never),
    ).toBe('Active');
    expect(getOrderStatusText({ hasRefunds: false, isActive: false } as never)).toBe('Inactive');
    expect(getOrderStatusText(undefined)).toBe('');
    expect(getSellerStatusSlug({ isActive: false } as never)).toBe('inactive');
    expect(getSellerStatusSlug({ isActive: true } as never)).toBe('active');
    expect(getSellerStatusSlug(undefined)).toBe('');
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
    expect(exportEventsToCsv([], true, true)).toBe('');
    expect(exportCustomerDataToCsv([vipEvent], true, true, true, true, true, 'EUR')).toContain(
      '"jane@example.com"',
    );
    expect(exportCustomerDataToCsv([], true, true, true, true, true, 'EUR')).toBe('');
    expect(
      exportEventCustomerDataToCsv(vipEvent, true, true, true, true, 'EUR', true, false),
    ).toContain('"Email"');
    expect(exportEventCustomerDataToCsv({} as never, true, true, true, true, 'EUR')).toBe('');
    expect(
      exportDashboardOrdersToCsv({
        currentDashboardData: { orders: [order] },
        end: 1716249599,
        reloadOrders: false,
        start: 1715644800,
      } as never),
    ).toContain('Admin dashboard - orders from');
    expect(exportDashboardOrdersToCsv({ currentDashboardData: { orders: [] } } as never)).toBe('');
    expect(getOrderExportTableFromEvent(vipEvent, true, true, true, true, true)).toContain(
      '"jane@example.com"',
    );
    expect(getOrderExportTableFromEvent({} as never, true, true, true, true, true)).toBe('');
  });

  it('covers export formatting branches for missing optional values and hidden currency headers', () => {
    const typedEvent = {
      eventDate: '2026-05-20T12:00:00Z',
      externalEventId: 4,
      hasTicketTypeData: true,
      isActive: true,
      isDeleted: false,
      isExternal: false,
      orders: [
        {
          ...order,
          tickets: [
            {
              attendeeFirstName: 'Only',
              attendeeLastName: 'Guest',
              isActive: true,
              ticketSocketOrderTicketId: 21,
              ticketType: 'GA',
              ticketTypeId: 1,
            },
          ],
        },
      ],
      sellerName: 'Typed Artist',
      ticketSocketEventId: 200,
      ticketTypes: [
        {
          eventId: 4,
          isActive: true,
          ticketTypeId: 1,
          ticketTypeName: 'GA',
          totalAvailable: 50,
        },
        {
          eventId: 4,
          isActive: true,
          ticketTypeId: 2,
          ticketTypeName: 'VIP',
          totalAvailable: 25,
        },
      ],
      title: 'Typed Show',
      totalRevenue: 100,
      totalServiceFees: 10,
      totalTickets: 1,
      venue: {
        city: 'Denver',
        country: { countryId: 1, countryName: 'USA' },
        name: 'Bluebird',
        state: 'CO',
      },
    } as never;

    const sparseEvent = {
      eventDate: '2026-05-21T12:00:00Z',
      externalEventId: 5,
      isActive: true,
      isDeleted: false,
      isExternal: false,
      sellerName: 'Sparse Artist',
      title: 'Sparse Show',
    } as never;

    const usdOrder = {
      ...order,
      currencyAbbrev: 'USD',
      currencySymbol: '$',
      numTickets: 2,
      purchaserFirstName: undefined,
      purchaserIpAddress: undefined,
      purchaserLastName: undefined,
      purchaserZipCode: undefined,
      tickets: [
        {
          attendeeFirstName: '',
          attendeeLastName: '',
          isActive: true,
          ticketSocketOrderTicketId: 11,
          ticketType: 'GA',
          ticketTypeId: 1,
        },
        {
          attendeeFirstName: '',
          attendeeLastName: '',
          isActive: true,
          ticketSocketOrderTicketId: 12,
          ticketType: 'VIP',
          ticketTypeId: 2,
        },
      ],
      totalShirts: 0,
    } as never;

    const zeroTicketOrder = {
      ...order,
      email: 'empty@example.com',
      eventAddress: undefined,
      eventCity: undefined,
      eventCountry: undefined,
      eventState: undefined,
      eventZip: undefined,
      numTickets: 0,
      purchaserFirstName: undefined,
      purchaserIpAddress: undefined,
      purchaserLastName: undefined,
      purchaserZipCode: undefined,
      revenue: undefined,
      revenueUsd: undefined,
      serviceFees: undefined,
      serviceFeesUsd: undefined,
      tickets: [],
      venue: undefined,
    } as never;

    const eventsCsv = exportEventsToCsv([typedEvent, sparseEvent], false, false);
    expect(eventsCsv).toContain('"VIP","0"');
    expect(eventsCsv).toContain('"Sparse Artist","05/21/2026","Sparse Show","","","undefined",');
    expect(eventsCsv).toContain('"Total","","","","","1",');
    expect(exportEventsToCsv([sparseEvent], true, true)).toContain('"0.00","0.00"');

    const hiddenCurrencyHeader = getOrderExportTableHeader(
      true,
      true,
      false,
      false,
      true,
      'EUR',
      true,
    );
    expect(hiddenCurrencyHeader).toContain('"Original Price","Exchange Rate"');
    expect(hiddenCurrencyHeader).toContain('"Original Service Fees"');
    expect(getOrderExportTableHeader(false, false, false, false, true, 'EUR')).toContain('"Email"');

    const usdRow = getOrderExportRow(usdOrder, true, true, false, false, true);
    expect(usdRow).toContain('"",""');
    expect(usdRow).toContain('"GA (1) / VIP (1)"');
    expect(usdRow).toContain('"100.00","1.2","10.00","12.00","120.00"');
    expect(usdRow).not.toContain('"555-1111"');
    expect(getOrderExportRow(usdOrder, false, false, false, false, false)).not.toContain(
      'Revenue (USD)',
    );

    const zeroTicketRow = getOrderExportRow(zeroTicketOrder, true, true, false, false, true);
    expect(zeroTicketRow).toContain('"empty@example.com"');
    expect(zeroTicketRow).toContain('"0.00 EUR","1.2","0.00 EUR","0.00","0.00"');
    expect(getOrderExportRow(zeroTicketOrder, false, false, false, false, true)).not.toContain(
      '"0.00 EUR","1.2"',
    );
  });

  it('exports event customer and dashboard csv variants for shirt totals and minimal orders', () => {
    const eventWithShirts = {
      ...vipEvent,
      hasTicketTypeData: true,
      shirtSales: [{ size: 'M', total: 2 }],
      ticketTypes: [
        {
          eventId: 1,
          isActive: true,
          ticketTypeId: 1,
          ticketTypeName: 'VIP',
          totalAvailable: 10,
        },
        {
          eventId: 1,
          isActive: true,
          ticketTypeId: 2,
          ticketTypeName: 'Premium',
          totalAvailable: 10,
        },
      ],
      totalShirts: 2,
    } as never;

    const eventCustomerCsv = exportEventCustomerDataToCsv(
      eventWithShirts,
      true,
      true,
      true,
      true,
      'EUR',
      false,
      true,
    );
    expect(eventCustomerCsv).toContain('"Shirt Totals:"');
    expect(eventCustomerCsv).toContain('"Premium","0"');
    expect(eventCustomerCsv).toContain('"Phone"');

    const minimalDashboardCsv = exportDashboardOrdersToCsv({
      currentDashboardData: {
        orders: [
          {
            ...order,
            currencyAbbrev: 'USD',
            currencySymbol: '$',
            phone: '',
            totalShirts: undefined,
          },
        ],
      },
      end: 1716249599,
      reloadOrders: false,
      start: 1715644800,
    } as never);
    expect(minimalDashboardCsv).not.toContain('"Phone"');
    expect(minimalDashboardCsv).not.toContain('"Shirt Sizes"');
    expect(minimalDashboardCsv).not.toContain('"Original Price"');
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
    expect(getAccountNameFromTicketSocketId(2)).toBe('European VIP Tickets');
    expect(getAccountNameFromTicketSocketId(4)).toBe('USA Concert tickets');
    expect(getAccountNameFromTicketSocketId(5)).toBe('Japanese VIP Tickets');
    expect(getAccountNameFromTicketSocketId(99)).toBe('USA VIP Tickets');
    expect(
      getAddressFromExternalVenue({
        address: '2 Main St',
        city: 'Austin',
        country: { countryId: 1, countryName: 'USA' },
        state: 'TX',
        zipCode: '73301',
      } as never),
    ).toBe('2 Main St, Austin, TX 73301, USA');
    expect(
      getAddressFromExternalVenue({
        address: '3 Main St',
        city: 'Berlin',
        state: '',
        zipCode: '',
      } as never),
    ).toBe('3 Main St, Berlin');
  });

  it('formats currency amounts for both admin and user views', () => {
    const { container } = render(<div>{formatCurrencyAmount(100, 120, 'EUR', 1.2, true)}</div>);

    expect(container.textContent).toContain('EUR100.00');
    expect(container.textContent).toContain('($120.00)');
    expect(formatCurrencyAmount(100, 120, 'EUR', 1, true)).not.toContain?.('($120.00)');
    expect(formatCurrencyAmount(undefined, 50, '$', 1, false)).toBe('$50.00');
    expect(formatCurrencyAmount(undefined, 0, 'EUR', 1, true)).toBe('EUR0.00');
    expect(formatCurrencyAmount(undefined, 0, undefined, 1, false)).toBe('$0.00');
  });

  it('covers remaining export and event status branches', () => {
    expect(getOrderExportTableHeader(false, false, false, false, false, 'USD')).toContain(
      '"Email"',
    );
    expect(
      getOrderExportTableHeader(false, false, true, false, false, 'USD', false, false, true),
    ).toBe('"Phone"\n');
    expect(getOrderExportTableHeader(false, false, false, false, false, 'USD', false, true)).toBe(
      '"Email"\n',
    );

    expect(getOrderExportRow(order, false, false, true, false, false, true, false)).toBe(
      '"jane@example.com"\n',
    );
    expect(getOrderExportRow(order, false, false, true, false, false, false, true)).toBe(
      '"555-1111"\n',
    );

    expect(
      getEventStatusSlug(
        {
          emailSentToVips: true,
          eventDate: '2026-04-01T12:00:00Z',
          isActive: true,
          isDeleted: false,
          isExternal: false,
          listSentToBand: true,
          textSentToVips: true,
          totalTickets: 5,
        } as never,
        true,
      ),
    ).toBe('taskscomplete');
    expect(
      getEventStatusSlug(
        {
          eventDate: '2026-04-01T12:00:00Z',
          isActive: true,
          isDeleted: false,
          isExternal: false,
          textSentToVips: false,
          totalTickets: 0,
        } as never,
        true,
      ),
    ).toBe('zerovips');
    expect(getEventStatusSlug({ isDeleted: true } as never)).toBe('deleted');
    expect(getEventStatusSlug({ isCancelled: true } as never)).toBe('cancelled');
    expect(getEventStatusSlug({ isActive: false } as never)).toBe('inactive');
    expect(getEventStatusSlug({ isActive: true, isHidden: true } as never)).toBe('hidden');
    expect(getEventStatusSlug({ isActive: true, isSoldOut: true } as never)).toBe('sold-out');
    expect(getEventStatusSlug({ isActive: true, isExternal: false } as never)).toBe('active');
    expect(
      getEventStatusSlug({
        isActive: true,
        isDeleted: false,
        isExternal: false,
        tourAnnounceDate: '2026-04-01T12:00:00Z',
      } as never),
    ).toBe('active');
    expect(getEventStatusSlug(undefined)).toBe('');

    expect(getEventStatusText({ isDeleted: true } as never)).toBe('Deleted');
    expect(getEventStatusText({ isCancelled: true } as never)).toBe('Cancelled');
    expect(getEventStatusText({ isActive: false } as never)).toBe('Inactive');
    expect(getEventStatusText({ isActive: true, isHidden: true } as never)).toBe('Hidden');
    expect(getEventStatusText({ isActive: true, isSoldOut: true } as never)).toBe('SOLD OUT');
    expect(
      getEventStatusText(
        {
          emailSentToVips: true,
          isActive: true,
          isDeleted: false,
          isExternal: false,
          listSentToBand: true,
          textSentToVips: true,
          totalTickets: 5,
        } as never,
        true,
      ),
    ).toBe('All Tasks Complete');
    expect(
      getEventStatusText(
        {
          eventDate: '2026-04-01T12:00:00Z',
          isActive: true,
          isDeleted: false,
          isExternal: false,
          totalTickets: 0,
        } as never,
        true,
      ),
    ).toBe('No VIPs Sold');
    expect(
      getEventStatusText({
        isActive: true,
        isDeleted: false,
        isExternal: false,
        isHidden: true,
        isSoldOut: true,
      } as never),
    ).toContain(' - SOLD OUT');
    expect(
      getEventStatusText({
        isActive: true,
        isDeleted: false,
        isExternal: false,
        tourAnnounceDate: '2026-04-01T12:00:00Z',
      } as never),
    ).toBe('Active');
    expect(getEventStatusText(undefined)).toBe('');
  });
});

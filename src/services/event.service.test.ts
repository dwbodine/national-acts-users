import moment from 'moment';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MINIMUM_UNIX_TIMESTAMP } from '@/constants';
import getAuthorizationHeader from '@/utils/getAuthorizationHeader';

const eventServiceMocks = vi.hoisted(() => ({
  create: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    create: eventServiceMocks.create,
  },
}));

vi.mock('@/utils/getAuthorizationHeader', () => ({
  default: vi.fn(),
}));

import { EventService } from './event.service';

const createService = () => new EventService('https://events.example.com');

describe('EventService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-24T12:00:00Z'));
    eventServiceMocks.create.mockReturnValue({
      get: eventServiceMocks.get,
      post: eventServiceMocks.post,
    });
    vi.mocked(getAuthorizationHeader).mockReturnValue({
      Authorization: 'Bearer event-token',
      'Content-Type': 'application/json',
    } as never);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('covers event service success paths and URL-building branches', async () => {
    eventServiceMocks.get
      .mockResolvedValueOnce({ data: [{ eventId: 1 }], status: 200 })
      .mockResolvedValueOnce({ data: [{ tourId: 2 }], status: 200 })
      .mockResolvedValueOnce({ data: [{ eventId: 3 }], status: 200 })
      .mockResolvedValueOnce({ data: [{ eventId: 4 }], status: 200 })
      .mockResolvedValueOnce({ data: [{ eventId: 5 }], status: 200 })
      .mockResolvedValueOnce({ data: [{ eventId: 6 }], status: 200 })
      .mockResolvedValueOnce({ data: [{ orderId: 7 }], status: 200 })
      .mockResolvedValueOnce({ data: { orders: 8 }, status: 200 })
      .mockResolvedValueOnce({ data: { orders: 9 }, status: 200 })
      .mockResolvedValueOnce({ data: [{ eventId: 10 }], status: 200 })
      .mockResolvedValueOnce({ data: [{ eventId: 10.5 }], status: 200 })
      .mockResolvedValueOnce({ data: [{ eventId: 11 }], status: 200 })
      .mockResolvedValueOnce({ data: [], status: 200 })
      .mockResolvedValueOnce({ data: [{ orderId: 12 }], status: 200 })
      .mockResolvedValueOnce({ data: [], status: 200 })
      .mockResolvedValueOnce({ data: { historyId: 13 }, status: 200 })
      .mockResolvedValueOnce({ data: { historyId: 14 }, status: 200 })
      .mockResolvedValueOnce({ data: { historyId: 15 }, status: 200 })
      .mockResolvedValueOnce({ data: [{ refreshId: 16 }], status: 200 })
      .mockResolvedValueOnce({ data: [{ noteId: 17 }], status: 200 })
      .mockResolvedValueOnce({ data: [{ eventId: 18 }], status: 200 })
      .mockResolvedValueOnce({ data: [{ orderId: 19 }], status: 200 });

    eventServiceMocks.post
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ data: { eventId: 20 }, status: 200 })
      .mockResolvedValueOnce({ data: undefined, status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 });

    const service = createService();

    const sellerReport = {
      end: 222,
      selectedTourId: 12,
      seller: { sellerId: 9 },
      showDeleted: true,
      showHidden: true,
      showInactive: true,
      start: 111,
    };

    await expect(service.getEvents(sellerReport as never, false)).resolves.toEqual({
      events: [{ eventId: 1, lastFetched: moment().unix() }],
      statusCode: 200,
    });
    await expect(service.getTours(9)).resolves.toEqual({
      statusCode: 200,
      tours: [{ tourId: 2 }],
    });
    await expect(
      service.getAdminEvents({
        end: 333,
        selectedTour: { tourId: 21 },
        sellerId: 15,
        start: 222,
      } as never),
    ).resolves.toEqual({
      events: [{ eventId: 3, lastFetched: moment().unix() }],
      statusCode: 200,
    });
    await expect(service.getAdminSellerEvents([1, 2])).resolves.toEqual({
      events: [{ eventId: 4, lastFetched: moment().unix() }],
      statusCode: 200,
    });
    await expect(service.getTicketSocketEventsOnly(undefined)).resolves.toEqual({
      events: [{ eventId: 5, lastFetched: moment().unix() }],
      statusCode: 200,
    });
    await expect(service.getTicketSocketEventsOnly(7)).resolves.toEqual({
      events: [{ eventId: 6, lastFetched: moment().unix() }],
      statusCode: 200,
    });
    await expect(service.getAllOrders(100, 200)).resolves.toEqual({
      orders: [{ orderId: 7 }],
      statusCode: 200,
    });
    await expect(
      service.getDashboardOrderData({
        start: moment('2026-01-01').unix(),
      } as never),
    ).resolves.toEqual({
      statusCode: 200,
      totals: { orders: 8 },
    });
    await expect(
      service.getDashboardOrderData({
        start: moment('2025-01-01').unix(),
      } as never),
    ).resolves.toEqual({
      statusCode: 200,
      totals: { orders: 9 },
    });
    await expect(
      service.getAllEvents(MINIMUM_UNIX_TIMESTAMP - 50, MINIMUM_UNIX_TIMESTAMP - 100, 30),
    ).resolves.toEqual({
      events: [{ eventId: 10, lastFetched: moment().unix() }],
      statusCode: 200,
    });
    await expect(service.getAllEvents()).resolves.toEqual({
      events: [{ eventId: 10.5, lastFetched: moment().unix() }],
      statusCode: 200,
    });
    await expect(service.getEventById(44)).resolves.toEqual({
      event: { eventId: 11, lastFetched: moment().unix() },
      statusCode: 200,
    });
    await expect(service.getEventById(45)).resolves.toEqual({
      event: undefined,
      statusCode: 200,
    });
    await expect(service.getOrderById(46)).resolves.toEqual({
      order: { orderId: 12 },
      statusCode: 200,
    });
    await expect(service.getOrderById(47)).resolves.toEqual({
      order: undefined,
      statusCode: 200,
    });
    await expect(service.updateEvent({ eventId: 48 } as never)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.updateTour({ tourId: 49 } as never)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.refundEvent(50, true, false)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.cancelEvents([51, 52], true)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.sendListToBand(53, true)).resolves.toEqual({
      statusCode: 200,
      success: true,
      updatedEvent: { eventId: 20, lastFetched: moment().unix() },
    });
    await expect(service.sendListToBand(54, false)).resolves.toEqual({
      statusCode: 200,
      success: true,
      updatedEvent: undefined,
    });
    await expect(service.refundOrder(55, true)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.refundTicket(56, false)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.updateOrder({ orderId: 57 } as never)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.addCompedOrder(58, 2)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.refreshEventsFromService(59, 100, 200)).resolves.toEqual({
      results: { historyId: 13 },
      statusCode: 200,
    });
    await expect(service.refreshEventsFromService(60, 300)).resolves.toEqual({
      results: { historyId: 14 },
      statusCode: 200,
    });
    await expect(service.refreshEventsFromService(61, undefined, 400)).resolves.toEqual({
      results: { historyId: 15 },
      statusCode: 200,
    });
    await expect(service.getTicketSocketRefreshHistory()).resolves.toEqual({
      history: [{ refreshId: 16 }],
      statusCode: 200,
    });
    await expect(service.addNote('hello', 62, '2026-05-01', 'Ignored')).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(
      service.addNote('calendar', undefined, '2026-05-02', 'Calendar Note'),
    ).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(
      service.editNote(63, 'edit', 'Title', new Date('2026-05-03T00:00:00Z'), true),
    ).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.deleteNote(64)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.getCalendarNotes(1, 2)).resolves.toEqual({
      notes: [{ noteId: 17 }],
      statusCode: 200,
    });
    await expect(service.getMissingVenueEvents()).resolves.toEqual({
      events: [{ eventId: 18 }],
      statusCode: 200,
    });
    await expect(service.searchOrders('john@example.com')).resolves.toEqual({
      orders: [{ orderId: 19 }],
      statusCode: 200,
    });
    await expect(service.setEventsInactive([65], true)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.setEventsDeleted([66], false)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.setEventsHidden([67], true)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.setOrdersInactive([68], false)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.setEventsLiveInBandsInTown([69])).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.setOrdersDeleted([70], true)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.setTicketsCheckedIn([71], false)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });

    expect(eventServiceMocks.get).toHaveBeenNthCalledWith(
      1,
      '/events/getEventsAndOrders?portal=1&sellerId=9&tourId=12&inactive=1&deleted=1&hidden=1&start=111&end=222',
      {
        headers: {
          Authorization: 'Bearer event-token',
          'Content-Type': 'application/json',
        },
      },
    );
    expect(eventServiceMocks.get).toHaveBeenNthCalledWith(
      9,
      '/dashboard/getDashboardDataSecured/2025',
      {
        headers: {
          Authorization: 'Bearer event-token',
          'Content-Type': 'application/json',
        },
      },
    );
    expect(eventServiceMocks.get).toHaveBeenNthCalledWith(
      11,
      '/events/getEventsAndOrders?excludeExternal=1&ignoreFlags=1',
      {
        headers: {
          Authorization: 'Bearer event-token',
          'Content-Type': 'application/json',
        },
      },
    );
    expect(eventServiceMocks.get).toHaveBeenNthCalledWith(
      18,
      '/events/refreshEventsFromService/61?start=400',
      {
        headers: {
          Authorization: 'Bearer event-token',
          'Content-Type': 'application/json',
        },
      },
    );
    expect(eventServiceMocks.create).toHaveBeenCalledTimes(3);
    expect(eventServiceMocks.post).toHaveBeenNthCalledWith(
      12,
      '/admin/notes/add',
      {
        calendarDate: '2026-05-02',
        eventId: undefined,
        note: 'calendar',
        noteTitle: 'Calendar Note',
      },
      {
        headers: {
          Authorization: 'Bearer event-token',
          'Content-Type': 'application/json',
        },
      },
    );
  });

  it('covers event service error paths and falsey success flags', async () => {
    eventServiceMocks.get
      .mockRejectedValueOnce({ response: { status: 500 } })
      .mockRejectedValueOnce({ message: 'tours failed', response: { status: 501 } })
      .mockRejectedValueOnce({ response: { status: 502 } })
      .mockRejectedValueOnce({ message: 'seller events failed', response: { status: 503 } })
      .mockRejectedValueOnce({ response: { status: 504 } })
      .mockRejectedValueOnce({ message: 'ticket-socket failed', response: { status: 505 } })
      .mockRejectedValueOnce({ response: { status: 506 } })
      .mockRejectedValueOnce({ message: 'dashboard failed', response: { status: 507 } })
      .mockRejectedValueOnce({ response: { status: 508 } })
      .mockRejectedValueOnce({ message: 'event failed', response: { status: 509 } })
      .mockRejectedValueOnce({ response: { status: 510 } })
      .mockRejectedValueOnce({ message: 'refresh failed', response: { status: 511 } })
      .mockRejectedValueOnce({ response: { status: 512 } })
      .mockRejectedValueOnce({ message: 'calendar failed', response: { status: 513 } })
      .mockRejectedValueOnce({ response: { status: 514 } })
      .mockRejectedValueOnce({ message: 'search failed', response: { status: 515 } });

    eventServiceMocks.post
      .mockResolvedValueOnce({ status: 201 })
      .mockResolvedValueOnce({ status: 201 })
      .mockResolvedValueOnce({ status: 201 })
      .mockResolvedValueOnce({ status: 201 })
      .mockRejectedValueOnce({ response: { status: 540 } })
      .mockRejectedValueOnce({ message: 'tour update failed', response: { status: 541 } })
      .mockRejectedValueOnce({ response: { status: 542 } })
      .mockRejectedValueOnce({ message: 'cancel event failed', response: { status: 543 } })
      .mockRejectedValueOnce({ response: { status: 516 } })
      .mockRejectedValueOnce({ message: 'order refund failed', response: { status: 517 } })
      .mockRejectedValueOnce({ response: { status: 518 } })
      .mockRejectedValueOnce({ message: 'update order failed', response: { status: 519 } })
      .mockRejectedValueOnce({ response: { status: 520 } })
      .mockRejectedValueOnce({ message: 'note add failed', response: { status: 521 } })
      .mockRejectedValueOnce({ response: { status: 522 } })
      .mockRejectedValueOnce({ message: 'note delete failed', response: { status: 523 } })
      .mockRejectedValueOnce({ response: { status: 524 } })
      .mockRejectedValueOnce({ message: 'set deleted failed', response: { status: 525 } })
      .mockRejectedValueOnce({ response: { status: 526 } })
      .mockRejectedValueOnce({ message: 'set order inactive failed', response: { status: 527 } })
      .mockRejectedValueOnce({ response: { status: 528 } })
      .mockRejectedValueOnce({ message: 'set orders deleted failed', response: { status: 529 } })
      .mockRejectedValueOnce({ response: { status: 530 } });

    const service = createService();

    await expect(service.getEvents({ seller: { sellerId: 1 } } as never)).resolves.toEqual({
      error: 'Unknown error while fetching events - please contact your administrator',
      statusCode: 500,
    });
    await expect(service.getTours(1)).resolves.toEqual({
      error: 'tours failed',
      statusCode: 501,
    });
    await expect(service.getAdminEvents({ sellerId: 1 } as never)).resolves.toEqual({
      error: 'Unknown error while fetching events - please contact your administrator',
      statusCode: 502,
    });
    await expect(service.getAdminSellerEvents([1])).resolves.toEqual({
      error: 'seller events failed',
      statusCode: 503,
    });
    await expect(service.getTicketSocketEventsOnly(undefined)).resolves.toEqual({
      error: 'Unknown error while fetching events - please contact your administrator',
      statusCode: 504,
    });
    await expect(service.getAllOrders(1, 2)).resolves.toEqual({
      error: 'ticket-socket failed',
      statusCode: 505,
    });
    await expect(
      service.getDashboardOrderData({
        start: moment('2026-01-01').unix(),
      } as never),
    ).resolves.toEqual({
      error: 'Unknown error while fetching dashboard data - please contact your administrator',
      statusCode: 506,
    });
    await expect(service.getAllEvents(1, 2, 0)).resolves.toEqual({
      error: 'dashboard failed',
      statusCode: 507,
    });
    await expect(service.getEventById(1)).resolves.toEqual({
      error: 'Unknown error while fetching event - please contact your administrator',
      statusCode: 508,
    });
    await expect(service.getOrderById(1)).resolves.toEqual({
      error: 'event failed',
      statusCode: 509,
    });
    await expect(service.updateEvent({ eventId: 1 } as never)).resolves.toEqual({
      statusCode: 201,
      success: false,
    });
    await expect(service.updateTour({ tourId: 1 } as never)).resolves.toEqual({
      statusCode: 201,
      success: false,
    });
    await expect(service.refundEvent(1, false, true)).resolves.toEqual({
      statusCode: 201,
      success: false,
    });
    await expect(service.cancelEvents([1], false)).resolves.toEqual({
      statusCode: 201,
      success: false,
    });
    await expect(service.updateEvent({ eventId: 2 } as never)).resolves.toEqual({
      error: 'Unknown error while updating event - please contact your administrator',
      statusCode: 540,
    });
    await expect(service.updateTour({ tourId: 2 } as never)).resolves.toEqual({
      error: 'tour update failed',
      statusCode: 541,
    });
    await expect(service.refundEvent(2, true, false)).resolves.toEqual({
      error: 'Unknown error while issuing event refund - please contact your administrator',
      statusCode: 542,
    });
    await expect(service.cancelEvents([2], true)).resolves.toEqual({
      error: 'cancel event failed',
      statusCode: 543,
    });
    await expect(service.sendListToBand(1, false)).resolves.toEqual({
      error: 'Unknown error while marking list as sent to band - please contact your administrator',
      statusCode: 516,
    });
    await expect(service.refundOrder(1, false, true)).resolves.toEqual({
      error: 'order refund failed',
      statusCode: 517,
    });
    await expect(service.refundTicket(1, true)).resolves.toEqual({
      error: 'Unknown error while issuing ticket refund - please contact your administrator',
      statusCode: 518,
    });
    await expect(service.updateOrder({ orderId: 1 } as never)).resolves.toEqual({
      error: 'update order failed',
      statusCode: 519,
    });
    await expect(service.addCompedOrder(1, 3)).resolves.toEqual({
      error: 'Unknown error while adding comp order - please contact your administrator',
      statusCode: 520,
    });
    await expect(service.refreshEventsFromService(1)).resolves.toEqual({
      error:
        'Unknown error while refreshing events from TicketSocket - please contact your administrator',
      statusCode: 510,
    });
    await expect(service.getTicketSocketRefreshHistory()).resolves.toEqual({
      error: 'refresh failed',
      statusCode: 511,
    });
    await expect(service.addNote('oops')).resolves.toEqual({
      error: 'note add failed',
      statusCode: 521,
    });
    await expect(
      service.editNote(1, 'edit', 'Title', new Date('2026-05-03T00:00:00Z'), false),
    ).resolves.toEqual({
      error: 'Unknown error while editing note - please contact your administrator',
      statusCode: 522,
    });
    await expect(service.deleteNote(1)).resolves.toEqual({
      error: 'note delete failed',
      statusCode: 523,
    });
    await expect(service.getCalendarNotes(1, 2)).resolves.toEqual({
      error: 'Unknown error while fetching calendar notes - please contact your administrator',
      statusCode: 512,
    });
    await expect(service.getMissingVenueEvents()).resolves.toEqual({
      error: 'calendar failed',
      statusCode: 513,
    });
    await expect(service.searchOrders('fail')).resolves.toEqual({
      error: 'Unknown error while searching orders - please contact your administrator',
      statusCode: 514,
    });
    await expect(service.setEventsInactive([1], false)).resolves.toEqual({
      error: 'Unknown error while modifying event - please contact your administrator',
      statusCode: 524,
    });
    await expect(service.setEventsDeleted([1], true)).resolves.toEqual({
      error: 'set deleted failed',
      statusCode: 525,
    });
    await expect(service.setEventsHidden([1], false)).resolves.toEqual({
      error: 'Unknown error while modifying event - please contact your administrator',
      statusCode: 526,
    });
    await expect(service.setOrdersInactive([1], true)).resolves.toEqual({
      error: 'set order inactive failed',
      statusCode: 527,
    });
    await expect(service.setEventsLiveInBandsInTown([1])).resolves.toEqual({
      error: 'Unknown error while modifying event(s) - please contact your administrator',
      statusCode: 528,
    });
    await expect(service.setOrdersDeleted([1], false)).resolves.toEqual({
      error: 'set orders deleted failed',
      statusCode: 529,
    });
    await expect(service.setTicketsCheckedIn([1], true)).resolves.toEqual({
      error: 'Unknown error while modifying ticket - please contact your administrator',
      statusCode: 530,
    });
  });
});

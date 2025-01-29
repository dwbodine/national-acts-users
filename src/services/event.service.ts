import axios, { AxiosInstance } from 'axios';
import {
  VipEvent,
  GetEventsResponse,
  ModifyEventResponse,
  ModifyOrderResponse,
  ITicketData,
  ITicketTypeData,
  Order,
  IShirtSizeData,
  Venue,
  TicketType,
  ModifyTicketResponse,
  GetOrdersResponse,
  GetDashboardOrdersResponse,
  RefreshHistoryResponse,
  TicketSocketRefreshHistory,
  GetRefreshHistoryResponse,
  GetNotesResponse,
  Note,
  GetEventResponse,
  GetOrderResponse,
  ModifyNoteResponse,
  GetToursResponse,
  Tour,
  ModifyTourResponse,
} from '../types/event';
import {
  AdminDashboardSelection,
  AdminSelection,
  IDailyOrderData,
  IDashboardTotals,
  UserReportSelection,
} from '@/types/user';
import { getAuthorizationHeader } from '../utils/getAuthorizationHeader';
import { getTicketDataFromEvents } from '@/utils/getTicketDataFromEvents';
import moment from 'moment';
import { getShirtDataFromEvents } from '@/utils/getShirtData';
import { MINIMUM_UNIX_TIMESTAMP } from '@/constants';
import { report } from 'process';

export class EventService {
  protected readonly instance: AxiosInstance;
  protected readonly baseUrl: string;

  public constructor(url: string) {
    this.baseUrl = url;
    this.instance = axios.create({
      baseURL: url,
      timeout: 300000,
      timeoutErrorMessage: 'Time out!',
    });
  }

  getEvents = async (
    reportSelection: UserReportSelection,
  ): Promise<GetEventsResponse> => {
    let url = `/events/getEventsAndOrders?excludeExternal=1&sellerId=${reportSelection.seller.sellerId}`;

    if (reportSelection.selectedTourId && reportSelection.selectedTourId > 0) {
      url += `&tourId=${reportSelection.selectedTourId}`;
    }

    if (reportSelection.showInactive) {
      url += '&inactive=1';
    }

    if (reportSelection.showDeleted) {
      url += '&deleted=1';
    }

    if (reportSelection.showHidden) {
      url += '&hidden=1';
    }

    if (reportSelection.start) {
      url += `&start=${reportSelection.start}`;
    }

    if (reportSelection.end) {
      url += `&end=${reportSelection.end}`;
    }

    let eventResponse: GetEventsResponse = {
      events: undefined,
      eventError: undefined,
      statusCode: 200,
    };

    const headers = getAuthorizationHeader();

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        const events = res.data;
        eventResponse.events = events.length ? (events as VipEvent[]) : [];
        return eventResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          eventResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching events - please contact your administrator';
        }
        eventResponse.eventError = errorMessage;
        return eventResponse;
      });
  };

  getTours = async (sellerId: number): Promise<GetToursResponse> => {
    let url = `/admin/tours/${sellerId}`;

    let tourResponse: GetToursResponse = {
      tours: undefined,
      tourError: undefined,
      statusCode: 200,
    };

    const headers = getAuthorizationHeader();

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        const tours = res.data;
        tourResponse.tours = tours.length ? (tours as Tour[]) : [];
        return tourResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          tourResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching tours - please contact your administrator';
        }
        tourResponse.tourError = errorMessage;
        return tourResponse;
      });
  };

  getAdminEvents = async (
    reportSelection: AdminSelection,
  ): Promise<GetEventsResponse> => {
    let url = `/events/getEventsAndOrders?excludeExternal=1&ignoreFlags=1&sellerId=${reportSelection.sellerId}`;

    if (reportSelection.selectedTour) {
      url += `&tourId=${reportSelection.selectedTour.tourId}`
    }

    if (reportSelection.start) {
      url += `&start=${reportSelection.start}`;
    }

    if (reportSelection.end) {
      url += `&end=${reportSelection.end}`;
    }

    let eventResponse: GetEventsResponse = {
      events: undefined,
      eventError: undefined,
      statusCode: 200,
    };

    const headers = getAuthorizationHeader();

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        const events = res.data;
        eventResponse.events = events.length ? (events as VipEvent[]) : [];
        return eventResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          eventResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching events - please contact your administrator';
        }
        eventResponse.eventError = errorMessage;
        return eventResponse;
      });
  };

  getAdminSellerEvents = async (sellerIds: number[]): Promise<GetEventsResponse> => {
    let url = `/events/getEventsAndOrders?excludeExternal=1&ignoreFlags=1&omitOrders=1&sellerIds=${sellerIds.join(',')}`;

    let eventResponse: GetEventsResponse = {
      events: undefined,
      eventError: undefined,
      statusCode: 200,
    };

    const headers = getAuthorizationHeader();

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        const events = res.data;
        eventResponse.events = events.length ? (events as VipEvent[]) : [];
        return eventResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          eventResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching events - please contact your administrator';
        }
        eventResponse.eventError = errorMessage;
        return eventResponse;
      });
  };

  getAllOrders = async (start: number, end: number): Promise<GetOrdersResponse> => {
    let url = `/events/getOrders?start=${start}&end=${end}&ignoreFlags=1`;

    let ordersResponse: GetOrdersResponse = {
      orders: undefined,
      orderError: undefined,
      statusCode: 200,
    };

    const headers = getAuthorizationHeader();

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        ordersResponse.orders = res.data ? (res.data as Order[]) : undefined;
        return ordersResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          ordersResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching orders - please contact your administrator';
        }
        ordersResponse.orderError = errorMessage;
        return ordersResponse;
      });
  };

  getDashboardOrderData = async (
    currentDashboardSelection: AdminDashboardSelection,
  ): Promise<GetDashboardOrdersResponse> => {
    const currentYear = moment().year();
    let year = moment.unix(currentDashboardSelection.start).year();
    if (year >= currentYear || year < 2022) {
      year = 0;
    }

    const url = `/dashboard/getDashboardDataSecured/${year}`;

    let dashResponse: GetDashboardOrdersResponse = {
      totals: undefined,
      dashError: undefined,
      statusCode: 200,
    };

    const headers = getAuthorizationHeader();

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        dashResponse.totals = res.data ? (res.data as IDashboardTotals) : undefined;
        return dashResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          dashResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching dashboard data - please contact your administrator';
        }
        dashResponse.dashError = errorMessage;
        return dashResponse;
      });
  };

  getAllEvents = async (
    start: number = 0,
    end: number = 0,
    sellerId: number = 0,
  ): Promise<GetEventsResponse> => {
    if (start > 0 && start < MINIMUM_UNIX_TIMESTAMP) {
      start = MINIMUM_UNIX_TIMESTAMP;
    }

    if (start > 0 && end > 0 && end <= start) {
      end = start + 7 * 24 * 60 * 60;
    }

    let url = `/events/getEventsAndOrders?excludeExternal=1&ignoreFlags=1`;

    if (start > 0) {
      url += `&start=${start}`;
    }

    if (end > 0) {
      url += `&end=${end}`;
    }

    if (sellerId > 0) {
      url += `&sellerId=${sellerId}`;
    }

    let eventResponse: GetEventsResponse = {
      events: undefined,
      eventError: undefined,
      statusCode: 200,
    };

    const headers = getAuthorizationHeader();

    const apiInstance = axios.create({
      baseURL: this.baseUrl,
    });

    return apiInstance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        const events = res.data;
        eventResponse.events = events.length ? (events as VipEvent[]) : [];
        return eventResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          eventResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching events - please contact your administrator';
        }
        eventResponse.eventError = errorMessage;
        return eventResponse;
      });
  };

  getEventById = async (eventId: number): Promise<GetEventResponse> => {
    let url = `/events/getEventsAndOrders?excludeExternal=1&ignoreFlags=1&tsEventId=${eventId}`;

    let eventResponse: GetEventResponse = {
      event: undefined,
      eventError: undefined,
      statusCode: 200,
    };

    const headers = getAuthorizationHeader();

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        const events = res.data as VipEvent[];
        eventResponse.event = events.length ? events[0] : undefined;
        return eventResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          eventResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching event - please contact your administrator';
        }
        eventResponse.eventError = errorMessage;
        return eventResponse;
      });
  };

  getOrderById = async (orderId: number): Promise<GetOrderResponse> => {
    let url = `/events/getOrderById?tsOrderId=${orderId}`;

    let orderResponse: GetOrderResponse = {
      order: undefined,
      orderError: undefined,
      statusCode: 200,
    };

    const headers = getAuthorizationHeader();

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        const orders = res.data as Order[];
        orderResponse.order = orders.length ? orders[0] : undefined;
        return orderResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          orderResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching order - please contact your administrator';
        }
        orderResponse.orderError = errorMessage;
        return orderResponse;
      });
  };

  updateEvent = async (eventToUpdate: VipEvent): Promise<ModifyEventResponse> => {
    let url = `/admin/events/update`;

    let eventResponse: ModifyEventResponse = {
      success: false,
      eventError: undefined,
      statusCode: 200,
    };

    const data = JSON.stringify(eventToUpdate);

    const headers = getAuthorizationHeader();

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        eventResponse.success = res.status == 200;
        return eventResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          eventResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = 'Unknown error while updating event';
        }
        eventResponse.eventError = errorMessage;
        return eventResponse;
      });
  };

  updateTour = async (tourToUpdate: Tour): Promise<ModifyTourResponse> => {
    let url = `/admin/tours/update`;

    let tourResponse: ModifyTourResponse = {
      success: false,
      tourError: undefined,
      statusCode: 200,
    };

    const data = JSON.stringify(tourToUpdate);

    const headers = getAuthorizationHeader();

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        tourResponse.success = res.status == 200;
        return tourResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          tourResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = 'Unknown error while adding/updating tour';
        }
        tourResponse.tourError = errorMessage;
        return tourResponse;
      });
  };

  refundEvent = async (
    eventId: number,
    markCancelled: boolean,
    refundServiceFees: boolean,
  ): Promise<ModifyEventResponse> => {
    let url = markCancelled ? '/admin/events/cancel' : 'admin/events/refund';

    let eventResponse: ModifyEventResponse = {
      success: false,
      eventError: undefined,
      statusCode: 200,
    };

    const eventData = {
      eventId: eventId,
      refundOrders: true,
      refundServiceFees: refundServiceFees,
    };

    const data = JSON.stringify(eventData);

    const headers = getAuthorizationHeader();

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        eventResponse.success = res.status == 200;
        return eventResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          eventResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = 'Unknown error while issuing event refund';
        }
        eventResponse.eventError = errorMessage;
        return eventResponse;
      });
  };

  sendListToBand = async (
    eventId: number,
    isSent: boolean,
  ): Promise<ModifyEventResponse> => {
    let url = '/admin/events/sendListToBand';

    let eventResponse: ModifyEventResponse = {
      success: false,
      eventError: undefined,
      statusCode: 200,
      updatedEvent: undefined,
    };

    const eventData = {
      eventId: eventId,
      isSent: isSent ? 1 : 0,
    };

    const data = JSON.stringify(eventData);

    const headers = getAuthorizationHeader();

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        eventResponse.success = res.status == 200;
        eventResponse.updatedEvent = res.data as VipEvent;
        return eventResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          eventResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = 'Unknown error while marking list as sent to band';
        }
        eventResponse.eventError = errorMessage;
        return eventResponse;
      });
  };

  refundOrder = async (
    orderId: number,
    refundServiceFees: boolean,
    markChargeback: boolean = false,
  ): Promise<ModifyOrderResponse> => {
    let url = 'admin/orders/refund';

    let orderResponse: ModifyOrderResponse = {
      success: false,
      orderError: undefined,
      statusCode: 200,
    };

    const orderData = {
      orderId: orderId,
      refundServiceFees: refundServiceFees,
      markChargeback: markChargeback,
    };

    const data = JSON.stringify(orderData);

    const headers = getAuthorizationHeader();

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        orderResponse.success = res.status == 200;
        return orderResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          orderResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = 'Unknown error while issuing event refund';
        }
        orderResponse.orderError = errorMessage;
        return orderResponse;
      });
  };

  refundTicket = async (
    ticketId: number,
    refundServiceFees: boolean,
  ): Promise<ModifyOrderResponse> => {
    let url = 'admin/tickets/refund';

    let orderResponse: ModifyOrderResponse = {
      success: false,
      orderError: undefined,
      statusCode: 200,
    };

    const orderData = {
      ticketId: ticketId,
      refundServiceFees: refundServiceFees,
    };

    const data = JSON.stringify(orderData);

    const headers = getAuthorizationHeader();

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        orderResponse.success = res.status == 200;
        return orderResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          orderResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = 'Unknown error while issuing ticket refund';
        }
        orderResponse.orderError = errorMessage;
        return orderResponse;
      });
  };

  updateOrder = async (orderToUpdate: Order): Promise<ModifyOrderResponse> => {
    let url = `/admin/orders/update`;

    let orderResponse: ModifyOrderResponse = {
      success: false,
      orderError: undefined,
      statusCode: 200,
    };

    const data = JSON.stringify(orderToUpdate);

    const headers = getAuthorizationHeader();

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        orderResponse.success = res.status == 200;
        return orderResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          orderResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = 'Unknown error while updating order';
        }
        orderResponse.orderError = errorMessage;
        return orderResponse;
      });
  };

  addCompedOrder = async (
    eventId: number,
    numTickets: number,
  ): Promise<ModifyOrderResponse> => {
    let url = `/admin/orders/comp`;

    let orderResponse: ModifyOrderResponse = {
      success: false,
      orderError: undefined,
      statusCode: 200,
    };

    const data = JSON.stringify({
      eventId: eventId,
      numTickets: numTickets,
    });

    const headers = getAuthorizationHeader();

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        orderResponse.success = res.status == 200;
        return orderResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          orderResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = 'Unknown error while adding comp order';
        }
        orderResponse.orderError = errorMessage;
        return orderResponse;
      });
  };

  refreshEventsFromService = async (
    sellerId: number,
    start?: number,
    end?: number,
  ): Promise<RefreshHistoryResponse> => {
    let url = `/events/refreshEventsFromService/${sellerId}`;

    if (start && end) {
      url += `?start=${start}&end=${end}`;
    } else if (start) {
      url += `?start=${start}`;
    } else if (end) {
      url += `?start=${end}`;
    }

    let refreshResponse: RefreshHistoryResponse = {
      results: undefined,
      refreshError: undefined,
      statusCode: 200,
    };

    const headers = getAuthorizationHeader();

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        refreshResponse.results = res.data
          ? (res.data as TicketSocketRefreshHistory)
          : undefined;
        return refreshResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          refreshResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while refreshing events from TicketSocket - please contact your administrator';
        }
        refreshResponse.refreshError = errorMessage;
        return refreshResponse;
      });
  };

  getTicketSocketRefreshHistory = async (): Promise<GetRefreshHistoryResponse> => {
    let url = `/events/getRefreshHistory`;

    let refreshResponse: GetRefreshHistoryResponse = {
      history: undefined,
      refreshError: undefined,
      statusCode: 200,
    };

    const headers = getAuthorizationHeader();

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        refreshResponse.history = res.data
          ? (res.data as TicketSocketRefreshHistory[])
          : undefined;
        return refreshResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          refreshResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching event refresh history from TicketSocket - please contact your administrator';
        }
        refreshResponse.refreshError = errorMessage;
        return refreshResponse;
      });
  };

  addNote = async (
    note: string,
    eventId?: number,
    calendarDate?: string,
    noteTitle?: string,
  ): Promise<ModifyNoteResponse> => {
    const url = '/admin/notes/add';
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyNoteResponse = {
      success: false,
      noteError: undefined,
      statusCode: 200,
    };

    if (eventId) {
      calendarDate = undefined;
      noteTitle = undefined;
    }

    const data = {
      note: note,
      eventId: eventId,
      calendarDate: calendarDate,
      noteTitle: noteTitle,
    };

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        if (!modifyResponse.success) {
          modifyResponse.noteError =
            'Unexpected error occurred while adding note - please contact your administrator';
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while adding note - please contact your administrator';
        }
        modifyResponse.noteError = errorMessage;
        return modifyResponse;
      });
  };

  editNote = async (
    noteId: number,
    note: string,
    noteTitle?: string,
    noteDate?: Date,
    isCompleted?: boolean,
  ): Promise<ModifyNoteResponse> => {
    const url = '/admin/notes/edit';
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyNoteResponse = {
      success: false,
      noteError: undefined,
      statusCode: 200,
    };

    const data = {
      noteId: noteId,
      note: note,
      noteTitle: noteTitle,
      noteDate: moment(noteDate).format('YYYY-MM-DD'),
      isCompleted: isCompleted,
    };

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        if (!modifyResponse.success) {
          modifyResponse.noteError =
            'Unexpected error occurred while editing note - please contact your administrator';
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while editing note - please contact your administrator';
        }
        modifyResponse.noteError = errorMessage;
        return modifyResponse;
      });
  };

  deleteNote = async (noteId: Number): Promise<ModifyNoteResponse> => {
    const url = '/admin/notes/delete';
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyNoteResponse = {
      success: false,
      noteError: undefined,
      statusCode: 200,
    };

    const data = {
      noteId: noteId,
    };

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        if (!modifyResponse.success) {
          modifyResponse.noteError =
            'Unexpected error occurred while deleting note - please contact your administrator';
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while deleting note - please contact your administrator';
        }
        modifyResponse.noteError = errorMessage;
        return modifyResponse;
      });
  };

  getCalendarNotes = async (start: number, end: number): Promise<GetNotesResponse> => {
    let url = `/admin/notes/calendar?start=${start}&end=${end}`;

    let refreshResponse: GetNotesResponse = {
      notes: undefined,
      noteError: undefined,
      statusCode: 200,
    };

    const headers = getAuthorizationHeader();

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        refreshResponse.notes = res.data ? (res.data as Note[]) : undefined;
        return refreshResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          refreshResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching calendar notes from TicketSocket - please contact your administrator';
        }
        refreshResponse.noteError = errorMessage;
        return refreshResponse;
      });
  };

  setEventsInactive = async (
    eventIdList: number[],
    isActive: boolean,
  ): Promise<ModifyEventResponse> => {
    const url = '/events/setEventsInactive';
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyEventResponse = {
      success: false,
      eventError: undefined,
      statusCode: 200,
    };

    const data = {
      eventIdList: eventIdList,
      isActive: isActive ? 1 : 0,
    };

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        if (!modifyResponse.success) {
          modifyResponse.eventError =
            'Unexpected error occurred while modifying event - please contact your administrator';
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while modifying event - please contact your administrator';
        }
        modifyResponse.eventError = errorMessage;
        return modifyResponse;
      });
  };

  setEventsDeleted = async (
    eventIdList: number[],
    isDeleted: boolean,
  ): Promise<ModifyEventResponse> => {
    const url = '/events/setEventsDeleted';
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyEventResponse = {
      success: false,
      eventError: undefined,
      statusCode: 200,
    };

    const data = {
      eventIdList: eventIdList,
      isDeleted: isDeleted ? 1 : 0,
    };

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        if (!modifyResponse.success) {
          modifyResponse.eventError =
            'Unexpected error occurred while modifying event - please contact your administrator';
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while modifying event - please contact your administrator';
        }
        modifyResponse.eventError = errorMessage;
        return modifyResponse;
      });
  };

  setEventsHidden = async (
    eventIdList: number[],
    isHidden: boolean,
  ): Promise<ModifyEventResponse> => {
    const url = '/events/setEventsHidden';
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyEventResponse = {
      success: false,
      eventError: undefined,
      statusCode: 200,
    };

    const data = {
      eventIdList: eventIdList,
      isHidden: isHidden ? 1 : 0,
    };

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        if (!modifyResponse.success) {
          modifyResponse.eventError =
            'Unexpected error occurred while modifying event - please contact your administrator';
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while modifying event - please contact your administrator';
        }
        modifyResponse.eventError = errorMessage;
        return modifyResponse;
      });
  };

  setOrdersInactive = async (
    orderIdList: number[],
    isActive: boolean,
  ): Promise<ModifyOrderResponse> => {
    const url = '/events/setOrdersInactive';
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyOrderResponse = {
      success: false,
      orderError: undefined,
      statusCode: 200,
    };

    const data = {
      orderIdList: orderIdList,
      isActive: isActive ? 1 : 0,
    };

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        if (!modifyResponse.success) {
          modifyResponse.orderError =
            'Unexpected error occurred while modifying order - please contact your administrator';
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while modifying order - please contact your administrator';
        }
        modifyResponse.orderError = errorMessage;
        return modifyResponse;
      });
  };

  setOrdersDeleted = async (
    orderIdList: number[],
    isDeleted: boolean,
  ): Promise<ModifyOrderResponse> => {
    const url = '/events/setOrdersDeleted';
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyOrderResponse = {
      success: false,
      orderError: undefined,
      statusCode: 200,
    };

    const data = {
      orderIdList: orderIdList,
      isDeleted: isDeleted ? 1 : 0,
    };

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        if (!modifyResponse.success) {
          modifyResponse.orderError =
            'Unexpected error occurred while modifying order - please contact your administrator';
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while modifying order - please contact your administrator';
        }
        modifyResponse.orderError = errorMessage;
        return modifyResponse;
      });
  };

  setTicketsCheckedIn = async (
    ticketIdList: number[],
    isCheckedIn: boolean,
  ): Promise<ModifyTicketResponse> => {
    const url = '/events/setTicketsCheckin';
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyTicketResponse = {
      success: false,
      ticketError: undefined,
      statusCode: 200,
    };

    const data = {
      ticketIdList: ticketIdList,
      isCheckedIn: isCheckedIn ? 1 : 0,
    };

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        if (!modifyResponse.success) {
          modifyResponse.ticketError =
            'Unexpected error occurred while modifying ticket - please contact your administrator';
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while modifying ticket - please contact your administrator';
        }
        modifyResponse.ticketError = errorMessage;
        return modifyResponse;
      });
  };

  exportEventsToCsv = (
    events: VipEvent[],
    viewServiceFees: boolean,
    showRevenueData: boolean,
  ): string => {
    if (!events || events.length == 0) {
      return '';
    }

    let exportStr = `"Summary"\n"Shows Listed:","${events.length}"\n`;

    const ticketData: ITicketData = getTicketDataFromEvents(events);
    const ticketTypes = ticketData?.TicketTypes;
    if (ticketTypes?.length > 0) {
      exportStr += '"Ticket Type breakdown:"\n';
      let arr: any = [];
      ticketData.TicketData?.forEach((ticketTypeData: ITicketTypeData[]) => {
        ticketTypes.forEach((ticketType: TicketType) => {
          var data = ticketTypeData.find(
            (x) => x.TicketType == ticketType.ticketTypeName,
          );
          var number = arr[ticketType.ticketTypeName] ?? 0;
          if (data) {
            number += data.Number;
          }
          arr[ticketType.ticketTypeName] = number;
        });
      });
      for (const ticketType in arr) {
        exportStr += `"${ticketType}","${arr[ticketType]}"\n`;
      }
    }

    exportStr += '"Seller Name","Date","Title","Venue","Location","Tickets sold",';
    if (showRevenueData) {
      exportStr += '"Revenue (USD)",';
    }
    if (viewServiceFees) {
      exportStr += '"Service Fees (USD)"\n';
    } else {
      exportStr += '\n';
    }

    let totalTcketsSold = 0;
    let totalRevenue = 0.0;
    let totalServiceFees = 0.0;

    events.forEach((vipEvent: VipEvent) => {
      const sellerName = vipEvent.sellerName;
      const eventDate = moment(vipEvent.eventDate).format('MM/DD/YYYY');
      const title = vipEvent.title;
      let venue = '';
      let location = '';
      if (vipEvent.venue) {
        venue = vipEvent.venue.name;
        location = this.getLocationInfoFromVenue(vipEvent.venue);
      }
      const ticketsSold = vipEvent.totalTickets;
      totalTcketsSold += ticketsSold;
      const revenue = vipEvent.totalRevenue;
      const serviceFees = vipEvent.totalServiceFees;
      totalRevenue += revenue;
      exportStr += `"${sellerName}","${eventDate}","${title}","${venue}","${location}","${ticketsSold}",`;
      if (showRevenueData) {
        exportStr += `"${revenue.toFixed(2)}",`;
      }
      if (viewServiceFees) {
        exportStr += `"${serviceFees.toFixed(2)}"\n`;
      } else {
        exportStr += '\n';
      }
    });

    exportStr += `"Total","","","","","${totalTcketsSold}",`;
    if (showRevenueData) {
      exportStr += `"${totalRevenue.toFixed(2)}",`;
    }
    if (viewServiceFees) {
      exportStr += `"${totalServiceFees.toFixed(2)}"\n`;
    } else {
      exportStr += '\n';
    }

    return exportStr;
  };

  getOrderExportTableHeader = (
    viewServiceFees: boolean,
    showRevenueData: boolean,
    hasPhoneData: boolean,
    hasShirtData: boolean,
    hasNonUsaOrders: boolean,
    currencyAbbrev?: string,
    hideCurrencyInHeaders: boolean = false,
    showOnlyEmails: boolean = false,
    showOnlyPhones: boolean = false,
  ): string => {
    let exportStr = '';
    if (showOnlyEmails) {
      exportStr += '"Email"\n';
    } else if (showOnlyPhones && hasPhoneData) {
      exportStr += '"Phone"\n';
    } else {
      exportStr =
        '"Seller Name","Purchaser Name","Purchaser Zip","Purchaser IP Address","Attendee Name(s)","Purchase Date","Event Date","Event Name","Ticket Type","Number of tickets"';
      if (hasNonUsaOrders) {
        if (showRevenueData) {
          if (hideCurrencyInHeaders) {
            exportStr += `,"Original Price","Exchange Rate"`;
          } else {
            exportStr += `,"Original Price (${currencyAbbrev})","Exchange Rate (${currencyAbbrev} to USD)"`;
          }
        }
        if (viewServiceFees) {
          if (hideCurrencyInHeaders) {
            exportStr += `,"Original Service Fees"`;
          } else {
            exportStr += `,"Original Service Fees (${currencyAbbrev})"`;
          }
        }
      }
      if (viewServiceFees) {
        exportStr += ',"Service Fees (USD)"';
      }
      if (showRevenueData) {
        exportStr += ',"Revenue (USD)"';
      }
      exportStr += ',"Email"';
      if (hasPhoneData) {
        exportStr += ',"Phone"';
      }
      if (hasShirtData) {
        exportStr += ',"Shirt Sizes"';
      }
      exportStr +=
        ',"Venue","Event Address","Event City","Event State","Event Zip","Event Country"\n';
    }
    return exportStr;
  };

  getOrderExportTableFromEvent = (
    vipEvent: VipEvent,
    viewServiceFees: boolean,
    showRevenueData: boolean,
    hasPhoneData: boolean,
    hasShirtData: boolean,
    hasNonUsaOrders: boolean,
    showOnlyEmails: boolean = false,
    showOnlyPhones: boolean = false,
  ): string => {
    let exportStr = '';
    if (vipEvent.orders && vipEvent.orders.length > 0) {
      vipEvent.orders.forEach((order: Order) => {
        exportStr += this.getOrderExportRow(
          order,
          viewServiceFees,
          showRevenueData,
          hasPhoneData,
          hasShirtData,
          hasNonUsaOrders,
          showOnlyEmails,
          showOnlyPhones,
        );
      });
    }
    return exportStr;
  };

  getOrderExportRow = (
    order: Order,
    viewServiceFees: boolean,
    showRevenueData: boolean,
    hasPhoneData: boolean,
    hasShirtData: boolean,
    hasNonUsaOrders: boolean,
    showOnlyEmails: boolean = false,
    showOnlyPhones: boolean = false,
  ): string => {
    let exportStr = '';
    const email = order.email;
    let phone = '';
    if (order.phone) {
      phone = order.phone;
    }
    if (showOnlyEmails) {
      exportStr += `"${email}"\n`;
    } else if (hasPhoneData && showOnlyPhones) {
      exportStr += `"${phone}"\n`;
    } else {
      const purchaserName = `${order.purchaserLastName}, ${order.purchaserFirstName}`;
      const purchaserZip = order.purchaserZipCode ?? '';
      const purchaserIpAddress = order.purchaserIpAddress ?? '';
      const purchaseDate = moment(order.purchaseTimestamp).format('MM/DD/YYYY LT');
      const eventDate = moment(order.eventDate).format('MM/DD/YYYY');
      const eventName = order.eventTitle;
      const sellerName = order.sellerName;
      const numTickets = order.numTickets;
      const originalPrice = order.revenue?.toFixed(2) ?? 0;
      const originalServiceFees = order.serviceFees?.toFixed(2) ?? 0;
      const exchangeRate = order.exchangeRate;
      const revenue = order.revenueUsd?.toFixed(2) ?? 0;
      const serviceFees = order.serviceFeesUsd?.toFixed(2) ?? 0;
      let shirts = '';
      let ticketTypeStr = '';
      let attendeeNames = '';
      if (numTickets > 0) {
        const ticketMap = new Map<string, number>();
        order.tickets?.forEach((ticket) => {
          if (attendeeNames.length > 0) {
            attendeeNames += ' / ';
          }
          if (shirts.length > 0) {
            shirts += ' / ';
          }
          attendeeNames += `${ticket.attendeeFirstName} ${ticket.attendeeLastName}`;
          if (ticket.shirtSize) {
            shirts += ticket.shirtSize;
          }
          const item = ticketMap.get(ticket.ticketType);
          let num: number = 1;
          if (item && item > 0) {
            num = item + 1;
          }
          ticketMap.set(ticket.ticketType, num);
        });
        ticketMap.forEach((value: Number, key: string) => {
          if (ticketTypeStr.length > 0) {
            ticketTypeStr += ' / ';
          }
          ticketTypeStr += `${key} (${value})`;
        });
      }

      exportStr += `"${sellerName}","${purchaserName}","${purchaserZip}","${purchaserIpAddress}","${attendeeNames}","${purchaseDate}","${eventDate}","${eventName}","${ticketTypeStr}","${numTickets}"`;
      if (hasNonUsaOrders) {
        if (showRevenueData) {
          if (order.currencyAbbrev != 'USD' && order.currencySymbol != '$') {
            exportStr += `,"${originalPrice} ${order.currencySymbol}","${exchangeRate}"`;
          } else {
            exportStr += `,"${originalPrice}","${exchangeRate}"`;
          }
        }
        if (viewServiceFees) {
          if (order.currencyAbbrev != 'USD' && order.currencySymbol != '$') {
            exportStr += `,"${originalServiceFees} ${order.currencySymbol}"`;
          } else {
            exportStr += `,"${originalServiceFees}"`;
          }
        }
      }
      if (viewServiceFees) {
        exportStr += `,"${serviceFees}"`;
      }
      if (showRevenueData) {
        exportStr += `,"${revenue}"`;
      }
      exportStr += `,"${email}"`;
      if (hasPhoneData) {
        exportStr += `,"${phone}"`;
      }
      if (hasShirtData) {
        exportStr += `,"${shirts}"`;
      }
      exportStr += `,${order.venue},${order.eventAddress},${order.eventCity},${order.eventState},${order.eventZip},${order.eventCountry}\n`;
    }
    return exportStr;
  };

  exportCustomerDataToCsv = (
    events: VipEvent[],
    viewServiceFees: boolean,
    showRevenueData: boolean,
    hasPhoneData: boolean,
    hasShirtData: boolean,
    hasNonUsaOrders: boolean,
    currencyAbbrev?: string,
  ): string => {
    if (!events || events.length == 0) {
      return '';
    }

    let exportStr = this.getOrderExportTableHeader(
      viewServiceFees,
      showRevenueData,
      hasPhoneData,
      hasShirtData,
      hasNonUsaOrders,
      currencyAbbrev,
    );

    events.forEach((vipEvent: VipEvent) => {
      exportStr += this.getOrderExportTableFromEvent(
        vipEvent,
        viewServiceFees,
        showRevenueData,
        hasPhoneData,
        hasShirtData,
        hasNonUsaOrders,
      );
    });

    return exportStr;
  };

  exportEventCustomerDataToCsv = (
    vipEvent: VipEvent,
    viewServiceFees: boolean,
    showRevenueData: boolean,
    hasPhoneData: boolean,
    hasNonUsaOrders: boolean,
    currencyAbbrev?: string,
    showOnlyEmails?: boolean,
    showOnlyPhones?: boolean,
  ): string => {
    if (!vipEvent || !vipEvent?.orders || vipEvent.orders.length == 0) {
      return '';
    }

    let exportStr = '';
    let hasShirtData = false;

    const ticketData = getTicketDataFromEvents([vipEvent]);
    const ticketTypes = ticketData?.TicketTypes;
    if (ticketTypes?.length > 0) {
      exportStr += '"Ticket Type breakdown:"\n';
      exportStr += '"Type","Number"\n';
      ticketData.TicketData?.forEach((ticketTypeData: ITicketTypeData[]) => {
        ticketTypes.forEach((ticketType: TicketType) => {
          var data = ticketTypeData.find(
            (x) => x.TicketType == ticketType.ticketTypeName,
          );
          var number = 0;
          if (data) {
            number = data.Number;
          }
          exportStr += `"${ticketType}","${number}"\n`;
        });
      });
      exportStr += '\n';
    }

    const shirtData = getShirtDataFromEvents([vipEvent]);
    const shirtSizes = shirtData?.ShirtSizes ?? [];
    if (shirtSizes.length > 0) {
      hasShirtData = true;
      exportStr += '"Shirt Totals:"\n';
      exportStr += '"Type","Number"\n';
      shirtData?.ShirtData?.forEach((shirtSizeData: IShirtSizeData[]) => {
        shirtSizeData.forEach((shirtSize) => {
          exportStr += `"${shirtSize.ShirtSize}","${shirtSize.Number}"\n`;
        });
      });
      exportStr += '\n';
    }

    exportStr += this.getOrderExportTableHeader(
      viewServiceFees,
      showRevenueData,
      hasPhoneData,
      hasShirtData,
      hasNonUsaOrders,
      currencyAbbrev,
      false,
      showOnlyEmails,
      showOnlyPhones,
    );
    exportStr += this.getOrderExportTableFromEvent(
      vipEvent,
      viewServiceFees,
      showRevenueData,
      hasPhoneData,
      hasShirtData,
      hasNonUsaOrders,
      showOnlyEmails,
      showOnlyPhones,
    );

    return exportStr;
  };

  exportDashboardOrdersToCsv = (
    currentDashboardSelection: AdminDashboardSelection,
  ): string => {
    if (
      !currentDashboardSelection.currentDashboardData ||
      !currentDashboardSelection.currentDashboardData.orders ||
      currentDashboardSelection.currentDashboardData.orders.length == 0
    ) {
      return '';
    }

    const orders = currentDashboardSelection.currentDashboardData.orders;
    const startDate = moment.unix(currentDashboardSelection.start).format('M/D/YYYY');
    const endDate = moment.unix(currentDashboardSelection.end).format('M/D/YYYY');

    let exportStr = `"Admin dashboard - orders from ${startDate} to ${endDate}"\n\n`;

    let hasShirtData = false;
    let hasPhoneData = false;
    let hasNonUsaOrders = false;
    for (const order of orders) {
      if (order.phone && order.phone != '') {
        hasPhoneData = true;
      }
      if (order.totalShirts ?? 0 > 0) {
        hasShirtData = true;
      }
      if (order.currencyAbbrev != 'USD') {
        hasNonUsaOrders = true;
      }
      if (hasPhoneData && hasShirtData && hasNonUsaOrders) {
        break;
      }
    }

    exportStr += this.getOrderExportTableHeader(
      true,
      true,
      hasPhoneData,
      hasShirtData,
      hasNonUsaOrders,
      '',
      true,
    );

    orders.forEach((order: Order) => {
      exportStr += this.getOrderExportRow(
        order,
        true,
        true,
        hasPhoneData,
        hasShirtData,
        hasNonUsaOrders,
      );
    });

    return exportStr;
  };

  getLocationInfoFromVenue = (venue: Venue): string => {
    let location = `${venue.city}`;
    if (venue.state && venue.state.trim() != '') {
      location += `, ${venue.state}`;
    }
    if (
      venue.country &&
      venue.country != 'United States' &&
      venue.country != 'USA' &&
      venue.state &&
      venue.country.trim() != venue.state.trim()
    ) {
      location += ', ' + venue.country;
    }
    return location;
  };

  getLocationInfoFromDailyOrderData = (order: IDailyOrderData): string => {
    let location = `${order.city}`;
    if (order.state && order.state.trim() != '') {
      location += `, ${order.state}`;
    }
    if (
      order.country &&
      order.country != 'United States' &&
      order.country != 'USA' &&
      order.state &&
      order.country.trim() != order.state.trim()
    ) {
      location += ', ' + order.country;
    }
    return location;
  };

  getAccountNameFromTicketSocketId = (ticketSocketId: number): string => {
    let accountName = '';
    switch (ticketSocketId) {
      case 2:
        accountName = 'European VIP Tickets';
        break;
      case 3:
        accountName = 'Australian VIP tickets';
        break;
      case 4:
        accountName = 'USA Concert tickets';
        break;
      default:
        accountName = 'USA VIP Tickets';
        break;
    }
    return accountName;
  };
}

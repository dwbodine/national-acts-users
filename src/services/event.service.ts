import {
  AdminDashboardSelection,
  AdminSelection,
  IDashboardTotals,
  UserReportSelection,
} from '@/types/user';
import {
  GetDashboardOrdersResponse,
  GetEventResponse,
  GetEventsResponse,
  GetNotesResponse,
  GetOrderResponse,
  GetOrdersResponse,
  GetRefreshHistoryResponse,
  GetToursResponse,
  ModifyEventResponse,
  ModifyNoteResponse,
  ModifyOrderResponse,
  ModifyTicketResponse,
  ModifyTourResponse,
  RefreshHistoryResponse
} from '@/types/responses';
import {
  Note,
  Order,
  TicketSocketRefreshHistory,
  Tour,
  VipEvent,
} from '../types/event';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { MINIMUM_UNIX_TIMESTAMP } from '@/constants';
import { getAuthorizationHeader } from '../utils/getAuthorizationHeader';
import moment from 'moment';


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
    let url = `/events/getEventsAndOrders?portal=1&excludeExternal=1&sellerId=${reportSelection.seller.sellerId}`;

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

    const response: GetEventsResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.events = res.data ? (res.data as VipEvent[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while fetching events - please contact your administrator';
    }

    return response;
  };

  getTours = async (sellerId: number): Promise<GetToursResponse> => {
    const url = `/events/tours/${sellerId}`;

    const response: GetToursResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.tours = res.data ? (res.data as Tour[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while fetching tours - please contact your administrator';
    }

    return response;
  };

  getAdminEvents = async (
    reportSelection: AdminSelection,
  ): Promise<GetEventsResponse> => {
    let url = `/events/getEventsAndOrders?ignoreFlags=1&sellerId=${reportSelection.sellerId}`;

    if (reportSelection.selectedTour) {
      url += `&tourId=${reportSelection.selectedTour.tourId}`;
    }

    if (reportSelection.start) {
      url += `&start=${reportSelection.start}`;
    }

    if (reportSelection.end) {
      url += `&end=${reportSelection.end}`;
    }

    const response: GetEventsResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.events = res.data ? (res.data as VipEvent[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while fetching events - please contact your administrator';
    }

    return response;
  };

  getAdminSellerEvents = async (sellerIds: number[]): Promise<GetEventsResponse> => {
    const url = `/events/getEventsAndOrders?ignoreFlags=1&omitOrders=1&sellerIds=${sellerIds.join(',')}`;

    const response: GetEventsResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.events = res.data ? (res.data as VipEvent[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while fetching events - please contact your administrator';
    }

    return response;
  };

  getTicketSocketEventsOnly = async (
    sellerId: number | undefined,
  ): Promise<GetEventsResponse> => {
    let url = `/admin/events/ticketSocketOnly`;

    if (sellerId) {
      url += `?sellerId=${sellerId}`;
    }

    const response: GetEventsResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.events = res.data ? (res.data as VipEvent[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while fetching events - please contact your administrator';
    }

    return response;
  };

  getAllOrders = async (start: number, end: number): Promise<GetOrdersResponse> => {
    const url = `/events/getOrders?start=${start}&end=${end}&ignoreFlags=1`;

    const response: GetOrdersResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.orders = res.data ? (res.data as Order[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while fetching orders - please contact your administrator';
    }

    return response;
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

    const response: GetDashboardOrdersResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.totals = res.data ? (res.data as IDashboardTotals) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while fetching dashboard data - please contact your administrator';
    }

    return response;
  };

  getAllEvents = async (
    start: number = 0,
    end: number = 0,
    sellerId: number = 0,
  ): Promise<GetEventsResponse> => {
    let startUnix: number = start;
    let endUnix: number = end;
    if (startUnix > 0 && startUnix < MINIMUM_UNIX_TIMESTAMP) {
      startUnix = MINIMUM_UNIX_TIMESTAMP;
    }

    if (startUnix > 0 && endUnix > 0 && endUnix <= startUnix) {
      endUnix = startUnix + 7 * 24 * 60 * 60;
    }

    let url = `/events/getEventsAndOrders?excludeExternal=1&ignoreFlags=1`;

    if (startUnix > 0) {
      url += `&start=${startUnix}`;
    }

    if (endUnix > 0) {
      url += `&end=${endUnix}`;
    }

    if (sellerId > 0) {
      url += `&sellerId=${sellerId}`;
    }

    const response: GetEventsResponse = {};

    const headers = getAuthorizationHeader();

    const apiInstance = axios.create({
      baseURL: this.baseUrl,
    });

    try {
      const res = await apiInstance.get(url, { headers });
      response.statusCode = res.status;
      response.events = res.data ? (res.data as VipEvent[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while fetching events - please contact your administrator';
    }

    return response;
  };

  getEventById = async (eventId: number): Promise<GetEventResponse> => {
    const url = `/events/getEventsAndOrders?excludeExternal=1&ignoreFlags=1&eventId=${eventId}`;

    const response: GetEventResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      const events = res.data as VipEvent[];
      response.event = events && events.length > 0 ? events[0] : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while fetching event - please contact your administrator';
    }

    return response;
  };

  getOrderById = async (orderId: number): Promise<GetOrderResponse> => {
    const url = `/events/getOrderById?tsOrderId=${orderId}`;

    const response: GetOrderResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      const orders = res.data as Order[];
      response.order = orders && orders.length > 0 ? orders[0] : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while fetching order - please contact your administrator';
    }

    return response;
  };

  updateEvent = async (eventToUpdate: VipEvent): Promise<ModifyEventResponse> => {
    const url = `/admin/events/update`;

    const response: ModifyEventResponse = {};

    const data = JSON.stringify(eventToUpdate);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while updating event - please contact your administrator';
    }

    return response;
  };

  updateTour = async (tourToUpdate: Tour): Promise<ModifyTourResponse> => {
    const url = `/admin/tours/update`;

    const response: ModifyTourResponse = {};

    const data = JSON.stringify(tourToUpdate);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while updating tour - please contact your administrator';
    }

    return response;
  };

  refundEvent = async (
    eventId: number,
    markCancelled: boolean,
    refundServiceFees: boolean,
  ): Promise<ModifyEventResponse> => {
    const url = 'admin/events/refund';

    const response: ModifyEventResponse = {};

    const eventData = {
      eventId,
      markCancelled,
      refundServiceFees,
    };

    const data = JSON.stringify(eventData);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while issuing event refund - please contact your administrator';
    }

    return response;
  };

  cancelEvent = async (
    eventId: number,
    isCancelled: boolean,
  ): Promise<ModifyEventResponse> => {
    const url = '/admin/events/cancel';

    const response: ModifyEventResponse = {};

    const eventData = {
      cancelled: isCancelled,
      eventId,
    };

    const data = JSON.stringify(eventData);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while cancelling event - please contact your administrator';
    }

    return response;
  };

  sendListToBand = async (
    eventId: number,
    isSent: boolean,
  ): Promise<ModifyEventResponse> => {
    const url = '/admin/events/sendListToBand';

    const response: ModifyEventResponse = {};

    const eventData = {
      eventId,
      isSent: isSent ? 1 : 0,
    };

    const data = JSON.stringify(eventData);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
      response.updatedEvent = res.data as VipEvent;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while marking list as sent to band - please contact your administrator';
    }

    return response;
  };

  refundOrder = async (
    orderId: number,
    refundServiceFees: boolean,
    markChargeback: boolean = false,
  ): Promise<ModifyOrderResponse> => {
    const url = 'admin/orders/refund';

    const response: ModifyOrderResponse = {};

    const orderData = {
      markChargeback,
      orderId,
      refundServiceFees,
    };

    const data = JSON.stringify(orderData);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while issuing order refund - please contact your administrator';
    }

    return response;
  };

  refundTicket = async (
    ticketId: number,
    refundServiceFees: boolean,
  ): Promise<ModifyOrderResponse> => {
    const url = 'admin/tickets/refund';

    const response: ModifyOrderResponse = {};

    const orderData = {
      refundServiceFees,
      ticketId,
    };

    const data = JSON.stringify(orderData);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while issuing ticket refund - please contact your administrator';
    }

    return response;
  };

  updateOrder = async (orderToUpdate: Order): Promise<ModifyOrderResponse> => {
    const url = `/admin/orders/update`;

    const response: ModifyOrderResponse = {};

    const data = JSON.stringify(orderToUpdate);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while updating order - please contact your administrator';
    }

    return response;
  };

  addCompedOrder = async (
    eventId: number,
    numTickets: number,
  ): Promise<ModifyOrderResponse> => {
    const url = `/admin/orders/comp`;

    const response: ModifyOrderResponse = {};

    const data = JSON.stringify({
      eventId,
      numTickets,
    });

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while adding comp order - please contact your administrator';
    }

    return response;
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

    const response: RefreshHistoryResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.results = res.data ? (res.data as TicketSocketRefreshHistory) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while refreshing events from TicketSocket - please contact your administrator';
    }

    return response;
  };

  getTicketSocketRefreshHistory = async (): Promise<GetRefreshHistoryResponse> => {
    const url = `/events/getRefreshHistory`;

    const response: GetRefreshHistoryResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.history = res.data ? (res.data as TicketSocketRefreshHistory[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while fetching event refresh history from TicketSocket - please contact your administrator';
    }

    return response;
  };

  addNote = async (
    note: string,
    eventId?: number,
    calendarDate?: string,
    noteTitle?: string,
  ): Promise<ModifyNoteResponse> => {
    const url = '/admin/notes/add';
    const headers = getAuthorizationHeader();

    const response: ModifyNoteResponse = {};

    let calendarDateStr: string | undefined = calendarDate;
    let noteTitleStr: string | undefined = noteTitle;

    if (eventId) {
      calendarDateStr = undefined;
      noteTitleStr = undefined;
    }

    const data = {
      calendarDate: calendarDateStr,
      eventId,
      note,
      noteTitle: noteTitleStr,
    };

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while adding note - please contact your administrator';
    }

    return response;
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

    const response: ModifyNoteResponse = {};

    const data = {
      isCompleted,
      note,
      noteDate: moment(noteDate).format('YYYY-MM-DD'),
      noteId,
      noteTitle,
    };

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while editing note - please contact your administrator';
    }

    return response;
  };

  deleteNote = async (noteId: number): Promise<ModifyNoteResponse> => {
    const url = '/admin/notes/delete';
    const headers = getAuthorizationHeader();

    const response: ModifyNoteResponse = {};

    const data = { noteId };

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while deleting note - please contact your administrator';
    }

    return response;
  };

  getCalendarNotes = async (start: number, end: number): Promise<GetNotesResponse> => {
    const url = `/admin/notes/calendar?start=${start}&end=${end}`;

    const response: GetNotesResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.notes = res.data ? (res.data as Note[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while fetching calendar notes - please contact your administrator';
    }

    return response;
  };

  getMissingVenueEvents = async (): Promise<GetEventsResponse> => {
    const url = `/reports/getMissingVenueEvents`;

    const response: GetEventsResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.events = res.data ? (res.data as VipEvent[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while fetching missing events - please contact your administrator';
    }

    return response;
  };

  searchOrders = async (searchTerm: string): Promise<GetOrdersResponse> => {
    const url = `/admin/orders/search?sTerm=${encodeURIComponent(searchTerm)}`;

    const response: GetOrdersResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.orders = res.data ? (res.data as Order[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while searching orders - please contact your administrator';
    }

    return response;
  };

  setEventsInactive = async (
    eventIdList: number[],
    isActive: boolean,
  ): Promise<ModifyEventResponse> => {
    const url = '/events/setEventsInactive';
    const headers = getAuthorizationHeader();

    const response: ModifyEventResponse = {};

    const data = {
      eventIdList,
      isActive: isActive ? 1 : 0,
    };

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while modifying event - please contact your administrator';
    }

    return response;
  };

  setEventsDeleted = async (
    eventIdList: number[],
    isDeleted: boolean,
  ): Promise<ModifyEventResponse> => {
    const url = '/events/setEventsDeleted';
    const headers = getAuthorizationHeader();

    const response: ModifyEventResponse = {};

    const data = {
      eventIdList,
      isDeleted: isDeleted ? 1 : 0,
    };

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while modifying event - please contact your administrator';
    }

    return response;
  };

  setEventsHidden = async (
    eventIdList: number[],
    isHidden: boolean,
  ): Promise<ModifyEventResponse> => {
    const url = '/events/setEventsHidden';
    const headers = getAuthorizationHeader();

    const response: ModifyEventResponse = {};

    const data = {
      eventIdList,
      isHidden: isHidden ? 1 : 0,
    };

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while modifying event - please contact your administrator';
    }

    return response;
  };

  setOrdersInactive = async (
    orderIdList: number[],
    isActive: boolean,
  ): Promise<ModifyOrderResponse> => {
    const url = '/events/setOrdersInactive';
    const headers = getAuthorizationHeader();

    const response: ModifyOrderResponse = {};

    const data = {
      isActive: isActive ? 1 : 0,
      orderIdList,
    };

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while modifying order - please contact your administrator';
    }

    return response;
  };

  setOrdersDeleted = async (
    orderIdList: number[],
    isDeleted: boolean,
  ): Promise<ModifyOrderResponse> => {
    const url = '/events/setOrdersDeleted';
    const headers = getAuthorizationHeader();

    const response: ModifyOrderResponse = {};

    const data = {
      isDeleted: isDeleted ? 1 : 0,
      orderIdList,
    };

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while modifying order - please contact your administrator';
    }

    return response;
  };

  setTicketsCheckedIn = async (
    ticketIdList: number[],
    isCheckedIn: boolean,
  ): Promise<ModifyTicketResponse> => {
    const url = '/events/setTicketsCheckin';
    const headers = getAuthorizationHeader();

    const response: ModifyTicketResponse = {};

    const data = {
      isCheckedIn: isCheckedIn ? 1 : 0,
      ticketIdList,
    };

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while modifying ticket - please contact your administrator';
    }

    return response;
  };
}
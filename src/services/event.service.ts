import axios, { AxiosInstance } from "axios";
import { VipEvent, GetEventsResponse, ModifyEventResponse, ModifyOrderResponse } from "../types/event";
import { UserReportSelection } from "@/types/user";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";

export class EventService {
  protected readonly instance: AxiosInstance;
  
  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: "Time out!",
    });
  }

  getEvents = async (reportSelection: UserReportSelection): Promise<GetEventsResponse> => {
    let url = `/user/eventsAndOrdersSecured?sellerId=${reportSelection.seller.sellerId}`;

    if (reportSelection.start) {
      url += `&start=${reportSelection.start}`;
    }

    if (reportSelection.end) {
      url += `&end=${reportSelection.end}`;
    }

    if (reportSelection.showInactive || reportSelection.showInactiveOrders) {
      url += '&inactive=1';
    }

    if (reportSelection.showDeleted || reportSelection.showDeletedOrders) {
      url += '&deleted=1';
    }

    let eventResponse: GetEventsResponse = {
      events: undefined,
      eventError: undefined
    };

    const headers = getAuthorizationHeader();

    return this.instance
      .get(url, {
        headers: headers
      })
      .then((res) => {
        const events = res.data;
        eventResponse.events = events.length ? events as VipEvent[] : [];
        return eventResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = "Unknown error while fetching events - please contact your administrator";
        }
        eventResponse.eventError = errorMessage;
        return eventResponse;
      });
  };

  setEventInactive = async(eventId: number, isActive: boolean): Promise<ModifyEventResponse> => {
    const url = "/user/setEventInactiveSecured";
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyEventResponse = {
      success: false,
      eventError: undefined
    };

    const data = {
      'eventId': eventId,
      'isActive': isActive ? 0 : 1
    };

    return this.instance
      .post(url, data, {
        headers: headers
      }).then((res) => {
        modifyResponse.success = res.data as boolean;
        if (!modifyResponse.success) {
          modifyResponse.eventError = "Unexpected error occurred while modifying event - please contact your administrator";
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = "Unknown error while modifying event - please contact your administrator";
        }
        modifyResponse.eventError = errorMessage;
        return modifyResponse;
      });
  };

  setEventDeleted = async(eventId: number, isDeleted: boolean): Promise<ModifyEventResponse> => {
    const url = "/user/setEventDeletedSecured";
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyEventResponse = {
      success: false,
      eventError: undefined
    };

    const data = {
      'eventId': eventId,
      'isDeleted': isDeleted ? 0 : 1
    };

    return this.instance
      .post(url, data, {
        headers: headers
      }).then((res) => {
        modifyResponse.success = res.data as boolean;
        if (!modifyResponse.success) {
          modifyResponse.eventError = "Unexpected error occurred while modifying event - please contact your administrator";
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = "Unknown error while modifying event - please contact your administrator";
        }
        modifyResponse.eventError = errorMessage;
        return modifyResponse;
      });
  };

  setOrderInactive = async(orderId: number, isActive: boolean): Promise<ModifyOrderResponse> => {
    const url = "/user/setOrderInactiveSecured";
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyOrderResponse = {
      success: false,
      orderError: undefined
    };

    const data = {
      'orderId': orderId,
      'isActive': isActive ? 0 : 1
    };

    return this.instance
      .post(url, data, {
        headers: headers
      }).then((res) => {
        modifyResponse.success = res.data as boolean;
        if (!modifyResponse.success) {
          modifyResponse.orderError = "Unexpected error occurred while modifying order - please contact your administrator";
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = "Unknown error while modifying order - please contact your administrator";
        }
        modifyResponse.orderError = errorMessage;
        return modifyResponse;
      });
  };

  setOrderDeleted = async(orderId: number, isDeleted: boolean): Promise<ModifyOrderResponse> => {
    const url = "/user/setOrderDeletedSecured";
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyOrderResponse = {
      success: false,
      orderError: undefined
    };

    const data = {
      'orderId': orderId,
      'isDeleted': isDeleted ? 0 : 1
    };

    return this.instance
      .post(url, data, {
        headers: headers
      }).then((res) => {
        modifyResponse.success = res.data as boolean;
        if (!modifyResponse.success) {
          modifyResponse.orderError = "Unexpected error occurred while modifying order - please contact your administrator";
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = "Unknown error while modifying order - please contact your administrator";
        }
        modifyResponse.orderError = errorMessage;
        return modifyResponse;
      });
  };

}
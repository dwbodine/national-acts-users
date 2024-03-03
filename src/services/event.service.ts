import axios, { AxiosInstance } from "axios";
import { VipEvent, GetEventsResponse } from "../types/event";
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
    let url = `/user/eventsAndOrdersSecured?sellerId=${reportSelection.sellerId}`;

    if (reportSelection.start) {
      url += `&start=${reportSelection.start}`;
    }

    if (reportSelection.end) {
      url += `&end=${reportSelection.end}`;
    }

    if (reportSelection.showInactive) {
      url += '&inactive=1';
    }

    if (reportSelection.showDeleted) {
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


}
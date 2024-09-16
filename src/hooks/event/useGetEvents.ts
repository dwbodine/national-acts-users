import { UserReportSelection } from "@/types/user";
import { eventService } from "../../services";
import { GetEventsResponse } from "@/types/event";

export const useGetEvents = () => {
  const getEvents = async (reportSelection: UserReportSelection): Promise<GetEventsResponse> => {
    let response: GetEventsResponse = {
        events: [],
        eventError: undefined
    };
    if (reportSelection.seller.sellerId > 0) {
        if (reportSelection.reloadEvents) {
            response = await eventService.getEvents(reportSelection);
        } else {
            response.events = reportSelection.currentEvents;
        }    
    }
    return response;    
  };

  return { getEvents };
};
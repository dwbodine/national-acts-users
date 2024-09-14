import { eventService } from "../services";
import { GetEventsResponse } from "@/types/event";

export const useGetEventDetails = () => {
  const getEventDetails = async (eventId: number): Promise<GetEventsResponse> => {
    let response: GetEventsResponse = {
        events: [],
        eventError: undefined
    };
    if (eventId > 0) {
        response = await eventService.getEventDetail(eventId);
    }
    return response;    
  };

  return { getEventDetails };
};
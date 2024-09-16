import { eventService } from "../services";
import { GetEventsResponse } from "@/types/event";

export const useGetAllEvents = () => {
  const getAllEvents = async (start: number, end: number, sellerId: number = 0): Promise<GetEventsResponse> => {
    let response: GetEventsResponse = {
        events: [],
        eventError: undefined
    };

    response = await eventService.getAllEvents(start, end, sellerId);

    return response;    
  };

  return { getAllEvents };
};
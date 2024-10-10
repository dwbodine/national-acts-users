import { AdminSelection } from "@/types/user";
import { eventService } from "../../services";
import { GetEventsResponse } from "@/types/event";

export const useGetAdminEvents = () => {
  const getAdminEvents = async (reportSelection: AdminSelection): Promise<GetEventsResponse> => {
    let response: GetEventsResponse = {
        events: [],
        eventError: undefined
    };
    response = await eventService.getAdminEvents(reportSelection);
    return response;    
  };

  return { getAdminEvents };
};
import { eventService } from "../../services";
import { ModifyEventResponse, VipEvent } from "@/types/event";

export const useUpdateEvent = () => {
  const updateEvent = async (eventToUpdate: VipEvent): Promise<ModifyEventResponse> => {
    let response: ModifyEventResponse = {
        success: false,
        eventError: undefined
    };
    response = await eventService.updateEvent(eventToUpdate);
    return response;    
  };

  return { updateEvent };
};
import { eventService } from "../services";
import { ModifyEventResponse } from "@/types/event";

export const useSetEventInactive = () => {
  const setEventInactive = async (ticketSocketEventId: number, isActive: boolean): Promise<ModifyEventResponse> => {
    return await eventService.setEventInactive(ticketSocketEventId, isActive);
  };

  return { setEventInactive };
};
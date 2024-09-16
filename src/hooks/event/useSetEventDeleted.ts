import { eventService } from "../../services";
import { ModifyEventResponse } from "@/types/event";

export const useSetEventDeleted = () => {
  const setEventDeleted = async (ticketSocketEventId: number, isDeleted: boolean): Promise<ModifyEventResponse> => {
    return await eventService.setEventDeleted(ticketSocketEventId, isDeleted);
  };

  return { setEventDeleted };
};
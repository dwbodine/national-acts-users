import { eventService } from "../../services";
import { ModifyEventResponse } from "@/types/event";

export const useSetEventListDeleted = () => {
  const setEventListDeleted = async (ticketSocketEventIds: number[], isDeleted: boolean): Promise<ModifyEventResponse> => {
    return await eventService.setEventListDeleted(ticketSocketEventIds, isDeleted);
  };

  return { setEventListDeleted };
};
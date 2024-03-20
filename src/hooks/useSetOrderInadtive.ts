import { eventService } from "../services";
import { ModifyOrderResponse } from "@/types/event";

export const useSetOrderInactive = () => {
  const setOrderInactive = async (ticketSocketOrderId: number, isActive: boolean): Promise<ModifyOrderResponse> => {
    return await eventService.setOrderInactive(ticketSocketOrderId, isActive);
  };

  return { setOrderInactive };
};
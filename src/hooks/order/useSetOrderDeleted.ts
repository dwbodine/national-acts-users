import { eventService } from "../../services";
import { ModifyOrderResponse } from "@/types/event";

export const useSetOrderDeleted = () => {
  const setOrderDeleted = async (ticketSocketOrderId: number, isDeleted: boolean): Promise<ModifyOrderResponse> => {
    return await eventService.setOrderDeleted(ticketSocketOrderId, isDeleted);
  };

  return { setOrderDeleted };
};
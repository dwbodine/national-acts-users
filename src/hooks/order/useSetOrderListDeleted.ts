import { eventService } from "../../services";
import { ModifyOrderResponse } from "@/types/event";

export const useSetOrderListDeleted = () => {
  const setOrderListDeleted = async (ticketSocketOrderIds: number[], isDeleted: boolean): Promise<ModifyOrderResponse> => {
    return await eventService.setOrderListDeleted(ticketSocketOrderIds, isDeleted);
  };

  return { setOrderListDeleted };
};
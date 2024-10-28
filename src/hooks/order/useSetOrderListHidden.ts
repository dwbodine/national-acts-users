import { eventService } from "../../services";
import { ModifyOrderResponse } from "@/types/event";

export const useSetOrderListHidden = () => {
  const setOrderListHidden = async (ticketSocketOrderIds: number[], isHidden: boolean): Promise<ModifyOrderResponse> => {
    return await eventService.setOrderListHidden(ticketSocketOrderIds, isHidden);
  };

  return { setOrderListHidden };
};
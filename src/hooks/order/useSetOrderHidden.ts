import { eventService } from "../../services";
import { ModifyOrderResponse } from "@/types/event";

export const useSetOrderHidden = () => {
  const setOrderHidden = async (ticketSocketOrderId: number, isHidden: boolean): Promise<ModifyOrderResponse> => {
    return await eventService.setOrderHidden(ticketSocketOrderId, isHidden);
  };

  return { setOrderHidden };
};
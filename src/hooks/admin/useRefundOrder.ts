import { eventService } from "../../services";
import { ModifyOrderResponse } from "@/types/event";

export const useRefundOrder = () => {
  const refundOrder = async (ticketSocketOrderId: number, refundServiceFees: boolean, markChargeback: boolean = false): Promise<ModifyOrderResponse> => {
    let response: ModifyOrderResponse = {
        success: false,
        orderError: undefined
    };
    response = await eventService.refundOrder(ticketSocketOrderId, refundServiceFees, markChargeback);
    return response;    
  };

  return { refundOrder };
};
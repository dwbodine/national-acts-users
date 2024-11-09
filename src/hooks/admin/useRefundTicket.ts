import { eventService } from "../../services";
import { ModifyOrderResponse } from "@/types/event";

export const useRefundTicket = () => {
  const refundTicket = async (ticketId: number, refundServiceFees: boolean): Promise<ModifyOrderResponse> => {
    let response: ModifyOrderResponse = {
        success: false,
        orderError: undefined
    };
    response = await eventService.refundTicket(ticketId, refundServiceFees);
    return response;    
  };

  return { refundTicket };
};
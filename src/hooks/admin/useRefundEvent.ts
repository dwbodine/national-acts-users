import { eventService } from "../../services";
import { ModifyEventResponse } from "@/types/event";

export const useRefundEvent = () => {
  const refundEvent = async (ticketSocketEventId: number, markCancelled: boolean, refundServiceFees: boolean): Promise<ModifyEventResponse> => {
    let response: ModifyEventResponse = {
        success: false,
        eventError: undefined
    };
    response = await eventService.refundEvent(ticketSocketEventId, markCancelled, refundServiceFees);
    return response;    
  };

  return { refundEvent };
};
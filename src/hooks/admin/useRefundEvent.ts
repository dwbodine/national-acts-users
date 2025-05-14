import { eventService } from '../../services';
import { ModifyEventResponse } from '@/types/event';

export const useRefundEvent = () => {
  const refundEvent = async (
    eventId: number,
    markCancelled: boolean,
    refundServiceFees: boolean,
  ): Promise<ModifyEventResponse> => {
    let response: ModifyEventResponse = {
      success: false,
      eventError: undefined,
    };
    response = await eventService.refundEvent(eventId, markCancelled, refundServiceFees);
    return response;
  };

  return { refundEvent };
};

import { ModifyEventResponse } from '@/types/event';
import { eventService } from '../../services';

export const useRefundEvent = () => {
  const refundEvent = async (
    eventId: number,
    markCancelled: boolean,
    refundServiceFees: boolean,
  ): Promise<ModifyEventResponse> =>
    await eventService.refundEvent(eventId, markCancelled, refundServiceFees);

  return { refundEvent };
};

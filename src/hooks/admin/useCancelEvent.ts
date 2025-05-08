import { eventService } from '../../services';
import { ModifyEventResponse } from '@/types/event';

export const useCancelEvent = () => {
  const cancelEvent = async (
    eventId: number,
    isCancelled: boolean,
  ): Promise<ModifyEventResponse> => {
    let response: ModifyEventResponse = {
      success: false,
      eventError: undefined,
    };
    response = await eventService.cancelEvent(eventId, isCancelled);
    return response;
  };

  return { cancelEvent };
};

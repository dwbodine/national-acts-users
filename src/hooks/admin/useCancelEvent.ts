import { ModifyEventResponse } from '@/types/responses';
import { eventService } from '../../services';

export const useCancelEvent = () => {
  const cancelEvent = async (eventId: number, isCancelled: boolean): Promise<ModifyEventResponse> =>
    await eventService.cancelEvent(eventId, isCancelled);

  return { cancelEvent };
};

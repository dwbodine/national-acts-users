import { eventService } from '../../services';
import { ModifyEventResponse } from '@/types/event';

export const useSetEventHidden = () => {
  const setEventHidden = async (
    ticketSocketEventId: number,
    isHidden: boolean,
  ): Promise<ModifyEventResponse> => {
    return await eventService.setEventHidden(ticketSocketEventId, isHidden);
  };

  return { setEventHidden };
};

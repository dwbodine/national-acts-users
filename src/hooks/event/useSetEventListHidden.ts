import { eventService } from '../../services';
import { ModifyEventResponse } from '@/types/event';

export const useSetEventListHidden = () => {
  const setEventListHidden = async (
    ticketSocketEventIds: number[],
    isHidden: boolean,
  ): Promise<ModifyEventResponse> => {
    return await eventService.setEventListHidden(ticketSocketEventIds, isHidden);
  };

  return { setEventListHidden };
};

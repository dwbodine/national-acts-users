import { eventService } from '../../services';
import { ModifyEventResponse } from '@/types/event';

export const useSetEventsHidden = () => {
  const setEventsHidden = async (
    ticketSocketEventIdList: number[],
    isHidden: boolean,
  ): Promise<ModifyEventResponse> => {
    return await eventService.setEventsHidden(ticketSocketEventIdList, isHidden);
  };

  return { setEventsHidden };
};

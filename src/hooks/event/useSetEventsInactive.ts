import { eventService } from '../../services';
import { ModifyEventResponse } from '@/types/event';

export const useSetEventsInactive = () => {
  const setEventsInactive = async (
    ticketSocketEventIdList: number[],
    isActive: boolean,
  ): Promise<ModifyEventResponse> => {
    return await eventService.setEventsInactive(ticketSocketEventIdList, isActive);
  };

  return { setEventsInactive };
};

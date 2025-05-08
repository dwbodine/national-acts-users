import { eventService } from '../../services';
import { ModifyEventResponse } from '@/types/event';

export const useSetEventsInactive = () => {
  const setEventsInactive = async (
    eventIdList: number[],
    isActive: boolean,
  ): Promise<ModifyEventResponse> => {
    return await eventService.setEventsInactive(eventIdList, isActive);
  };

  return { setEventsInactive };
};

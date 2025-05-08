import { eventService } from '../../services';
import { ModifyEventResponse } from '@/types/event';

export const useSetEventsHidden = () => {
  const setEventsHidden = async (
    eventIdList: number[],
    isHidden: boolean,
  ): Promise<ModifyEventResponse> => {
    return await eventService.setEventsHidden(eventIdList, isHidden);
  };

  return { setEventsHidden };
};

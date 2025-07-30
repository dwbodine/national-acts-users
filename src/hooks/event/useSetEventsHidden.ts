import { ModifyEventResponse } from '@/types/event';
import { eventService } from '../../services';

export const useSetEventsHidden = () => {
  const setEventsHidden = async (
    eventIdList: number[],
    isHidden: boolean,
  ): Promise<ModifyEventResponse> => await eventService.setEventsHidden(eventIdList, isHidden);

  return { setEventsHidden };
};

import { eventService } from '../../services';
import { ModifyEventResponse } from '@/types/event';

export const useSetEventsDeleted = () => {
  const setEventsDeleted = async (
    eventIdList: number[],
    isDeleted: boolean,
  ): Promise<ModifyEventResponse> => {
    return await eventService.setEventsDeleted(eventIdList, isDeleted);
  };

  return { setEventsDeleted };
};

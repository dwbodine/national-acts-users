import { ModifyEventResponse } from '@/types/event';
import { eventService } from '../../services';

export const useSetEventsDeleted = () => {
  const setEventsDeleted = async (
    eventIdList: number[],
    isDeleted: boolean,
  ): Promise<ModifyEventResponse> => await eventService.setEventsDeleted(eventIdList, isDeleted);

  return { setEventsDeleted };
};

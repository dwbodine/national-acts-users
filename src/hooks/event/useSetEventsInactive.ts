import { ModifyEventResponse } from '@/types/responses';
import { eventService } from '../../services';

export const useSetEventsInactive = () => {
  const setEventsInactive = async (
    eventIdList: number[],
    isActive: boolean,
  ): Promise<ModifyEventResponse> =>
    await eventService.setEventsInactive(eventIdList, isActive);

  return { setEventsInactive };
};

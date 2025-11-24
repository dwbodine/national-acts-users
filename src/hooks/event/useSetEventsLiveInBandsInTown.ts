import { ModifyEventResponse } from '@/types/responses';
import { eventService } from '../../services';

export const useSetEventsLiveInBandsInTown = () => {
  const setEventsLiveInBandsInTown = async (
    eventIdList: number[],
  ): Promise<ModifyEventResponse> =>
    await eventService.setEventsLiveInBandsInTown(eventIdList);

  return { setEventsLiveInBandsInTown };
};

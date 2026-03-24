import { ModifyEventResponse } from '@/types/responses';

import { eventService } from '../../services';

export const useCancelEvents = () => {
  const cancelEvents = async (
    eventIdList: number[],
    isCancelled: boolean,
  ): Promise<ModifyEventResponse> => await eventService.cancelEvents(eventIdList, isCancelled);

  return { cancelEvents };
};

import { ModifyEventResponse } from '@/types/responses';
import { VipEvent } from '@/types/event';
import { eventService } from '../../services';

export const useUpdateEvent = () => {
  const updateEvent = async (eventToUpdate: VipEvent): Promise<ModifyEventResponse> =>
    await eventService.updateEvent(eventToUpdate);

  return { updateEvent };
};

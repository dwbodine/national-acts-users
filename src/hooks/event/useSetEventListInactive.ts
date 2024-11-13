import { eventService } from '../../services';
import { ModifyEventResponse } from '@/types/event';

export const useSetEventListInactive = () => {
  const setEventListInactive = async (
    ticketSocketEventIds: number[],
    isActive: boolean,
  ): Promise<ModifyEventResponse> => {
    return await eventService.setEventListInactive(ticketSocketEventIds, isActive);
  };

  return { setEventListInactive };
};

import { eventService } from '../../services';
import { ModifyOrderResponse } from '@/types/event';

export const useSetOrdersInactive = () => {
  const setOrdersInactive = async (
    ticketSocketOrderIdList: number[],
    isActive: boolean,
  ): Promise<ModifyOrderResponse> => {
    return await eventService.setOrdersInactive(ticketSocketOrderIdList, isActive);
  };

  return { setOrdersInactive };
};

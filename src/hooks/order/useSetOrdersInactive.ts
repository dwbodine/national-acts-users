import { ModifyOrderResponse } from '@/types/event';
import { eventService } from '../../services';

export const useSetOrdersInactive = () => {
  const setOrdersInactive = async (
    ticketSocketOrderIdList: number[],
    isActive: boolean,
  ): Promise<ModifyOrderResponse> => await eventService.setOrdersInactive(ticketSocketOrderIdList, isActive);

  return { setOrdersInactive };
};

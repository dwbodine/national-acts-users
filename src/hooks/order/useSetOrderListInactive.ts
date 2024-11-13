import { eventService } from '../../services';
import { ModifyOrderResponse } from '@/types/event';

export const useSetOrderListInactive = () => {
  const setOrderListInactive = async (
    ticketSocketOrderIds: number[],
    isActive: boolean,
  ): Promise<ModifyOrderResponse> => {
    return await eventService.setOrderListInactive(ticketSocketOrderIds, isActive);
  };

  return { setOrderListInactive };
};

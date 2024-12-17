import { eventService } from '../../services';
import { ModifyOrderResponse } from '@/types/event';

export const useSetOrdersDeleted = () => {
  const setOrdersDeleted = async (
    ticketSocketOrderIdList: number[],
    isDeleted: boolean,
  ): Promise<ModifyOrderResponse> => {
    return await eventService.setOrdersDeleted(ticketSocketOrderIdList, isDeleted);
  };

  return { setOrdersDeleted };
};

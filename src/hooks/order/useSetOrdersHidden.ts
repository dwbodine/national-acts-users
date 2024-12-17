import { eventService } from '../../services';
import { ModifyOrderResponse } from '@/types/event';

export const useSetOrdersHidden = () => {
  const setOrdersHidden = async (
    ticketSocketOrderIdList: number[],
    isHidden: boolean,
  ): Promise<ModifyOrderResponse> => {
    return await eventService.setOrdersHidden(ticketSocketOrderIdList, isHidden);
  };

  return { setOrdersHidden };
};

import { ModifyOrderResponse } from '@/types/responses';
import { eventService } from '../../services';

export const useSetOrdersDeleted = () => {
  const setOrdersDeleted = async (
    ticketSocketOrderIdList: number[],
    isDeleted: boolean,
  ): Promise<ModifyOrderResponse> =>
    await eventService.setOrdersDeleted(ticketSocketOrderIdList, isDeleted);

  return { setOrdersDeleted };
};

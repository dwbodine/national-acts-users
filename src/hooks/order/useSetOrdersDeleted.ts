import { ModifyOrderResponse } from '@/types/responses';

import { eventService } from '../../services';

export const useSetOrdersDeleted = () => {
  const setOrdersDeleted = async (
    ticketPartnerOrderIdList: number[],
    isDeleted: boolean,
  ): Promise<ModifyOrderResponse> =>
    await eventService.setOrdersDeleted(ticketPartnerOrderIdList, isDeleted);

  return { setOrdersDeleted };
};

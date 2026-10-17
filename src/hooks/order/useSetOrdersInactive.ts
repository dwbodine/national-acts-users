import { ModifyOrderResponse } from '@/types/responses';

import { eventService } from '../../services';

export const useSetOrdersInactive = () => {
  const setOrdersInactive = async (
    ticketPartnerOrderIdList: number[],
    isActive: boolean,
  ): Promise<ModifyOrderResponse> =>
    await eventService.setOrdersInactive(ticketPartnerOrderIdList, isActive);

  return { setOrdersInactive };
};

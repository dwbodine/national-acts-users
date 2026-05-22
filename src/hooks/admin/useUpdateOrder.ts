import { Order } from '@/types/event';
import { ModifyOrderResponse } from '@/types/responses';

import { eventService } from '../../services';

export const useUpdateOrder = () => {
  const updateOrder = async (orderToUpdate: Order): Promise<ModifyOrderResponse> =>
    await eventService.updateOrder(orderToUpdate);

  return { updateOrder };
};

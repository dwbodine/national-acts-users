import { ModifyOrderResponse, Order } from '@/types/event';
import { eventService } from '../../services';

export const useUpdateOrder = () => {
  const updateOrder = async (orderToUpdate: Order): Promise<ModifyOrderResponse> => await eventService.updateOrder(orderToUpdate);

  return { updateOrder };
};

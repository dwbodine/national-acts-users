import { eventService } from '../../services';
import { GetOrderResponse } from '@/types/event';

export const useGetOrderById = () => {
  const getOrderById = async (orderId: number): Promise<GetOrderResponse> => {
    let response: GetOrderResponse = {
      order: undefined,
      orderError: undefined,
    };
    if (orderId > 0) {
      response = await eventService.getOrderById(orderId);
    }
    return response;
  };

  return { getOrderById };
};

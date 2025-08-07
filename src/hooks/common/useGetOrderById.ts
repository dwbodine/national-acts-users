import { GetOrderResponse } from '@/types/responses';
import { eventService } from '../../services';

export const useGetOrderById = () => {
  const getOrderById = async (orderId: number): Promise<GetOrderResponse> => {
    let response: GetOrderResponse = {
      error: undefined,
      order: undefined,
    };
    if (orderId > 0) {
      response = await eventService.getOrderById(orderId);
    }
    return response;
  };

  return { getOrderById };
};

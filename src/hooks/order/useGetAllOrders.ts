import { eventService } from '../../services';
import { GetOrdersResponse } from '@/types/event';

export const useGetAllOrders = () => {
  const getAllOrders = async (start: number, end: number): Promise<GetOrdersResponse> => {
    let response: GetOrdersResponse = {
      orders: [],
      orderError: undefined,
    };

    response = await eventService.getAllOrders(start, end);

    return response;
  };

  return { getAllOrders };
};

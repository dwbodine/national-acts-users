import { GetOrdersResponse } from '@/types/event';
import { eventService } from '../../services';

export const useGetAllOrders = () => {
  const getAllOrders = async (start: number, end: number): Promise<GetOrdersResponse> => await eventService.getAllOrders(start, end);

  return { getAllOrders };
};

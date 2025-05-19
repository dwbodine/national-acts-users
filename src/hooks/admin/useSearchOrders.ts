import { eventService } from '../../services';
import { GetOrdersResponse } from '@/types/event';

export const useSearchOrders = () => {
  const searchOrders = async (searchTerm: string): Promise<GetOrdersResponse> => {
    let response: GetOrdersResponse = {
      orders: undefined,
      orderError: undefined,
    };
    response = await eventService.searchOrders(searchTerm);
    return response;
  };

  return { searchOrders };
};

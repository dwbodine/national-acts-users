import { GetOrdersResponse } from '@/types/event';
import { eventService } from '../../services';

export const useSearchOrders = () => {
  const searchOrders = async (searchTerm: string): Promise<GetOrdersResponse> =>
    await eventService.searchOrders(searchTerm);

  return { searchOrders };
};

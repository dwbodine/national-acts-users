import { eventService } from '../../services';
import { GetEventsResponse } from '@/types/event';

export const useGetAdminSellerEvents = () => {
  const getAdminSellerEvents = async (
    sellerIds: number[],
  ): Promise<GetEventsResponse> => {
    let response: GetEventsResponse = {
      events: [],
      eventError: undefined,
    };
    response = await eventService.getAdminSellerEvents(sellerIds);
    return response;
  };

  return { getAdminSellerEvents };
};

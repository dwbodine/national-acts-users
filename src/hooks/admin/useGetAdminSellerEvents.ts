import { GetEventsResponse } from '@/types/event';
import { eventService } from '../../services';

export const useGetAdminSellerEvents = () => {
  const getAdminSellerEvents = async (sellerIds: number[]): Promise<GetEventsResponse> =>
    await eventService.getAdminSellerEvents(sellerIds);

  return { getAdminSellerEvents };
};

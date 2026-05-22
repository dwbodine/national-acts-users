import { GetEventsResponse } from '@/types/responses';

import { eventService } from '../../services';

export const useGetAdminSellerEvents = () => {
  const getAdminSellerEvents = async (sellerIds: number[]): Promise<GetEventsResponse> =>
    await eventService.getAdminSellerEvents(sellerIds);

  return { getAdminSellerEvents };
};

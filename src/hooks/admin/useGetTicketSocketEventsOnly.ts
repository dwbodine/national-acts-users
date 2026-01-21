import { GetEventsResponse } from '@/types/responses';

import { eventService } from '../../services';

export const useGetTicketSocketEventsOnly = () => {
  const getTicketSocketEventsOnly = async (
    sellerId: number | undefined,
  ): Promise<GetEventsResponse> => await eventService.getTicketSocketEventsOnly(sellerId);

  return { getTicketSocketEventsOnly };
};

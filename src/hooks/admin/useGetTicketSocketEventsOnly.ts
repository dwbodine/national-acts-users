import { GetEventsResponse } from '@/types/event';
import { eventService } from '../../services';

export const useGetTicketSocketEventsOnly = () => {
  const getTicketSocketEventsOnly = async (
    sellerId: number | undefined,
  ): Promise<GetEventsResponse> => await eventService.getTicketSocketEventsOnly(sellerId);

  return { getTicketSocketEventsOnly };
};

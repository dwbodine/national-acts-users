import { eventService } from '../../services';
import { GetEventsResponse } from '@/types/event';

export const useGetTicketSocketEventsOnly = () => {
  const getTicketSocketEventsOnly = async (
    sellerId: number | undefined,
  ): Promise<GetEventsResponse> => {
    let response: GetEventsResponse = {
      events: [],
      eventError: undefined,
    };
    response = await eventService.getTicketSocketEventsOnly(sellerId);
    return response;
  };

  return { getTicketSocketEventsOnly };
};

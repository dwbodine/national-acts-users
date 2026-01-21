import { GetEventsResponse } from '@/types/responses';

import { eventService } from '../../services';

export const useGetAllEvents = () => {
  const getAllEvents = async (
    start: number,
    end: number,
    sellerId: number = 0,
  ): Promise<GetEventsResponse> => await eventService.getAllEvents(start, end, sellerId);

  return { getAllEvents };
};

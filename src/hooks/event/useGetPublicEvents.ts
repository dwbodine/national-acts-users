import { GetEventsResponse } from '@/types/responses';

import { publicService } from '../../services';

export const useGetPublicEvents = () => {
  const getPublicEvents = async (
    start: number = 0,
    end: number = 0,
    sellerId: number = 0,
  ): Promise<GetEventsResponse> => await publicService.getEvents(start, end, sellerId);

  return { getPublicEvents };
};

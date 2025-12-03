import { eventService } from '@/services';
import { GetEventsResponse } from '@/types/responses';

export const useGetMissingVenueEvents = () => {
  const getMissingVenueEvents = async (): Promise<GetEventsResponse> =>
    await eventService.getMissingVenueEvents();

  return { getMissingVenueEvents };
};

import { GetEventsResponse } from '@/types/responses';
import { eventService } from '@/services';

export const useGetMissingVenueEvents = () => {
  const getMissingVenueEvents = async (): Promise<GetEventsResponse> =>
    await eventService.getMissingVenueEvents();

  return { getMissingVenueEvents };
};

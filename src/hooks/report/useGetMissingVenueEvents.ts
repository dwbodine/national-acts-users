import { GetEventsResponse } from '@/types/event';
import { eventService } from '@/services';

export const useGetMissingVenueEvents = () => {
  const getMissingVenueEvents = async (): Promise<GetEventsResponse> =>
    await eventService.getMissingVenueEvents();

  return { getMissingVenueEvents };
};

import { eventService } from '@/services';
import { GetEventsResponse } from '@/types/event';

export const useGetMissingVenueEvents = () => {
  const getMissingVenueEvents = async () => {
    let response: GetEventsResponse = {
      statusCode: 200,
    };
    response = await eventService.getMissingVenueEvents();
    return response;
  };

  return { getMissingVenueEvents };
};

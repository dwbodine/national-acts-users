import { GetEventResponse } from '@/types/event';
import { eventService } from '../../services';

export const useGetEventById = () => {
  const getEventById = async (eventId: number): Promise<GetEventResponse> => {
    let response: GetEventResponse = {
      event: undefined,
      eventError: undefined,
    };
    if (eventId > 0) {
      response = await eventService.getEventById(eventId);
    }
    return response;
  };

  return { getEventById };
};

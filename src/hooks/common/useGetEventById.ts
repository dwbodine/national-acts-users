import { GetEventResponse } from '@/types/responses';

import { eventService } from '../../services';

export const useGetEventById = () => {
  const getEventById = async (eventId: number): Promise<GetEventResponse> => {
    let response: GetEventResponse = {
      error: undefined,
      event: undefined,
    };
    if (eventId > 0) {
      response = await eventService.getEventById(eventId);
    }
    return response;
  };

  return { getEventById };
};

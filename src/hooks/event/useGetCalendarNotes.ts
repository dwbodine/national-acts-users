import { eventService } from '../../services';
import { GetNotesResponse } from '@/types/event';

export const useGetCalendarNotes = () => {
  const getCalendarNotes = async (
    start: number,
    end: number,
  ): Promise<GetNotesResponse> => {
    let response: GetNotesResponse = {
      notes: [],
      noteError: undefined,
    };

    response = await eventService.getCalendarNotes(start, end);

    return response;
  };

  return { getCalendarNotes };
};

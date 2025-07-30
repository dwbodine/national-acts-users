import { GetNotesResponse } from '@/types/event';
import { eventService } from '../../services';

export const useGetCalendarNotes = () => {
  const getCalendarNotes = async (
    start: number,
    end: number,
  ): Promise<GetNotesResponse> => await eventService.getCalendarNotes(start, end);

  return { getCalendarNotes };
};

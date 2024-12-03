import { eventService } from '../../services';
import { ModifyNoteResponse } from '@/types/event';

export const useAddNote = () => {
  const addNote = async (
    note: string,
    eventId?: number,
    calendarDate?: string,
  ): Promise<ModifyNoteResponse> => {
    let response: ModifyNoteResponse = {
      success: false,
      noteError: undefined,
    };
    response = await eventService.addNote(note, eventId, calendarDate);
    return response;
  };

  return { addNote };
};

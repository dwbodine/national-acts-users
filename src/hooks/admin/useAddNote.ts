import { eventService } from '../../services';
import { ModifyNoteResponse } from '@/types/event';

export const useAddNote = () => {
  const addNote = async (
    note: string,
    eventId?: number,
    calendarDate?: string,
    noteTitle?: string,
  ): Promise<ModifyNoteResponse> => {
    let response: ModifyNoteResponse = {
      success: false,
      noteError: undefined,
    };
    response = await eventService.addNote(note, eventId, calendarDate, noteTitle);
    return response;
  };

  return { addNote };
};

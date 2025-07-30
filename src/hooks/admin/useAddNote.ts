import { ModifyNoteResponse } from '@/types/event';
import { eventService } from '../../services';

export const useAddNote = () => {
  const addNote = async (
    note: string,
    eventId?: number,
    calendarDate?: string,
    noteTitle?: string,
  ): Promise<ModifyNoteResponse> =>
    await eventService.addNote(note, eventId, calendarDate, noteTitle);

  return { addNote };
};

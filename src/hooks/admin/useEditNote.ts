import { ModifyNoteResponse } from '@/types/responses';

import { eventService } from '../../services';

export const useEditNote = () => {
  const editNote = async (
    noteId: number,
    note: string,
    noteTitle?: string,
    noteDate?: Date,
    isCompleted?: boolean,
  ): Promise<ModifyNoteResponse> =>
    await eventService.editNote(noteId, note, noteTitle, noteDate, isCompleted);

  return { editNote };
};

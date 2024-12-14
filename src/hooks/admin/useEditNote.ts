import { eventService } from '../../services';
import { ModifyNoteResponse } from '@/types/event';

export const useEditNote = () => {
  const editNote = async (
    noteId: number,
    note: string,
    noteTitle?: string,
    isCompleted?: boolean,
  ): Promise<ModifyNoteResponse> => {
    let response: ModifyNoteResponse = {
      success: false,
      noteError: undefined,
    };
    response = await eventService.editNote(noteId, note, noteTitle, isCompleted);
    return response;
  };

  return { editNote };
};

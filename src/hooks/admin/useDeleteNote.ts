import { eventService } from '../../services';
import { ModifyNoteResponse } from '@/types/event';

export const useDeleteNote = () => {
  const deleteNote = async (noteId: number): Promise<ModifyNoteResponse> => {
    let response: ModifyNoteResponse = {
      success: false,
      noteError: undefined,
    };
    response = await eventService.deleteNote(noteId);
    return response;
  };

  return { deleteNote };
};

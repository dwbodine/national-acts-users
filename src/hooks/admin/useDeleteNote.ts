import { ModifyNoteResponse } from '@/types/event';
import { eventService } from '../../services';

export const useDeleteNote = () => {
  const deleteNote = async (noteId: number): Promise<ModifyNoteResponse> => await eventService.deleteNote(noteId);

  return { deleteNote };
};

import { ModifyTourResponse, Tour } from '@/types/event';
import { eventService } from '../../services';

export const useUpdateTour = () => {
  const updateTour = async (tourToUpdate: Tour): Promise<ModifyTourResponse> => await eventService.updateTour(tourToUpdate);

  return { updateTour };
};

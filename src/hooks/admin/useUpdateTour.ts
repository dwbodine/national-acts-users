import { Tour } from '@/types/event';
import { ModifyTourResponse } from '@/types/responses';

import { eventService } from '../../services';

export const useUpdateTour = () => {
  const updateTour = async (tourToUpdate: Tour): Promise<ModifyTourResponse> =>
    await eventService.updateTour(tourToUpdate);

  return { updateTour };
};

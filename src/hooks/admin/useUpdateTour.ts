import { AdminSelection } from '@/types/user';
import { eventService } from '../../services';
import { GetToursResponse, ModifyTourResponse, Tour } from '@/types/event';

export const useUpdateTour = () => {
  const updateTour = async (tourToUpdate: Tour): Promise<ModifyTourResponse> => {
    let response: ModifyTourResponse = {
      success: false,
      updatedTour: undefined,
      tourError: undefined,
    };
    response = await eventService.updateTour(tourToUpdate);
    return response;
  };

  return { updateTour };
};

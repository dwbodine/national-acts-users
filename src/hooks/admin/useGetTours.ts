import { AdminSelection } from '@/types/user';
import { eventService } from '../../services';
import { GetToursResponse } from '@/types/event';

export const useGetTours = () => {
  const getTours = async (
    reportSelection: AdminSelection,
  ): Promise<GetToursResponse> => {
    let response: GetToursResponse = {
      tours: [],
      tourError: undefined,
    };
    response = await eventService.getTours(reportSelection);
    return response;
  };

  return { getTours };
};

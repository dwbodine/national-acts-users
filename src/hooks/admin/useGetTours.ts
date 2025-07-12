import { eventService } from '../../services';
import { GetToursResponse } from '@/types/event';

export const useGetTours = () => {
  const getTours = async (sellerId: number): Promise<GetToursResponse> => {
    let response: GetToursResponse = {
      tours: [],
      tourError: undefined,
    };
    response = await eventService.getTours(sellerId);
    return response;
  };

  return { getTours };
};

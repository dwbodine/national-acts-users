import { GetToursResponse } from '@/types/event';
import { eventService } from '../../services';

export const useGetTours = () => {
  const getTours = async (sellerId: number): Promise<GetToursResponse> =>
    await eventService.getTours(sellerId);

  return { getTours };
};

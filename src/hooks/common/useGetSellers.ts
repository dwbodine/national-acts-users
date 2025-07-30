import { GetSellersResponse } from '@/types/event';
import { publicService } from '../../services';

export const useGetSellers = () => {
  const getSellers = async (): Promise<GetSellersResponse> => await publicService.getSellers();

  return { getSellers };
};

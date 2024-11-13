import { publicService } from '../../services';
import { GetSellersResponse } from '@/types/event';

export const useGetSellers = () => {
  const getSellers = async (): Promise<GetSellersResponse> => {
    const response = await publicService.getSellers();
    return response;
  };

  return { getSellers };
};

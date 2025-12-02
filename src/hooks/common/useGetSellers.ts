import { GetSellersResponse } from '@/types/responses';
import { publicService } from '../../services';

export const useGetSellers = () => {
  const getSellers = async (): Promise<GetSellersResponse> => await publicService.getSellers();

  return { getSellers };
};

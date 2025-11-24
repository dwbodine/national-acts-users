import { GetSellersResponse } from '@/types/responses';
import { adminService } from '../../services';

export const useGetAdminSellers = () => {
  const getAdminSellers = async (): Promise<GetSellersResponse> =>
    await adminService.getSellers();

  return { getAdminSellers };
};

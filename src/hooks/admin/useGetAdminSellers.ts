import { adminService } from '../../services';
import { GetSellersResponse } from '@/types/event';

export const useGetAdminSellers = () => {
  const getAdminSellers = async (): Promise<GetSellersResponse> => {
    const response = await adminService.getSellers();
    return response;
  };

  return { getAdminSellers };
};

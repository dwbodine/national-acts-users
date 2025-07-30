import { GetSellersResponse } from '@/types/event';
import { adminService } from '../../services';

export const useGetAdminSellers = () => {
  const getAdminSellers = async (): Promise<GetSellersResponse> => await adminService.getSellers();

  return { getAdminSellers };
};

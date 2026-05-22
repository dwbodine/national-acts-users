import { GetPageSellersResponse } from '@/types/responses';

import { adminService } from '../../services';

export const useGetAllPageSellers = () => {
  const getAllPageSellers = async (): Promise<GetPageSellersResponse> =>
    await adminService.getAllPageSellers();

  return { getAllPageSellers };
};

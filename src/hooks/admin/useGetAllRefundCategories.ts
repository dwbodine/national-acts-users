import { GetRefundCategoriesResponse } from '@/types/responses';

import { adminService } from '../../services';

export const useGetAllRefundCategories = () => {
  const getAllRefundCategories = async (): Promise<GetRefundCategoriesResponse> =>
    await adminService.getAllRefundCategories();

  return { getAllRefundCategories };
};

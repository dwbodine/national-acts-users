import { GetFaqCategoriesResponse } from '@/types/responses';
import { adminService } from '../../services';

export const useGetAllFaqCategories = () => {
  const getAllFaqCategories = async (): Promise<GetFaqCategoriesResponse> =>
    await adminService.getAllFaqCategories();

  return { getAllFaqCategories };
};

import { GetFaqCategoriesResponse } from '@/types/admin';
import { adminService } from '../../services';

export const useGetAllFaqCategories = () => {
  const getAllFaqCategories = async (): Promise<GetFaqCategoriesResponse> => await adminService.getAllFaqCategories();

  return { getAllFaqCategories };
};

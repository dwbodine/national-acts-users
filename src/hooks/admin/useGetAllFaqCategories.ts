import { adminService } from '../../services';
import { GetFaqCategoriesResponse } from '@/types/admin';

export const useGetAllFaqCategories = () => {
  const getAllFaqCategories = async (): Promise<GetFaqCategoriesResponse> => {
    let response: GetFaqCategoriesResponse = {
      categories: [],
      categoryError: undefined,
    };
    response = await adminService.getAllFaqCategories();
    return response;
  };

  return { getAllFaqCategories };
};

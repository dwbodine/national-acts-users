import { adminService } from '../../services';
import { GetPagesResponse } from '@/types/admin';

export const useGetAllPages = () => {
  const getAllPages = async (): Promise<GetPagesResponse> => {
    let response: GetPagesResponse = {
      pages: [],
      pageError: undefined,
    };
    response = await adminService.getAllPages();
    return response;
  };

  return { getAllPages };
};

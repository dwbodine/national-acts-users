import { GetPagesResponse } from '@/types/responses';
import { adminService } from '../../services';

export const useGetAllPages = () => {
  const getAllPages = async (): Promise<GetPagesResponse> => await adminService.getAllPages();

  return { getAllPages };
};

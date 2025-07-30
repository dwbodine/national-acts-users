import { GetPagesResponse } from '@/types/admin';
import { adminService } from '../../services';

export const useGetAllPages = () => {
  const getAllPages = async (): Promise<GetPagesResponse> =>
    await adminService.getAllPages();

  return { getAllPages };
};

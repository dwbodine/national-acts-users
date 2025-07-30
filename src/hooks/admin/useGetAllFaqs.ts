import { GetFaqsResponse } from '@/types/admin';
import { adminService } from '../../services';


export const useGetAllFaqs = () => {
  const getAllFaqs = async (): Promise<GetFaqsResponse> => await adminService.getAllFaqs();

  return { getAllFaqs };
};

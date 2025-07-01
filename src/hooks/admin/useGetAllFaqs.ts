import { adminService } from '../../services';
import { GetFaqsResponse } from '@/types/admin';

export const useGetAllFaqs = () => {
  const getAllFaqs = async (): Promise<GetFaqsResponse> => {
    let response: GetFaqsResponse = {
      faqs: [],
      faqError: undefined,
    };
    response = await adminService.getAllFaqs();
    return response;
  };

  return { getAllFaqs };
};

import { adminService } from '../../services';
import { ModifyFaqResponse } from '@/types/admin';

export const useDeleteFaq = () => {
  const deleteFaq = async (faqId: number): Promise<ModifyFaqResponse> => {
    let response: ModifyFaqResponse = {
      success: false,
      faqError: undefined,
    };
    response = await adminService.deleteFaq(faqId);
    return response;
  };

  return { deleteFaq };
};

import { Faq } from '@/types/public';
import { adminService } from '../../services';
import { ModifyFaqResponse } from '@/types/admin';

export const useUpdateFaq = () => {
  const updateFaq = async (faqToUpdate: Faq): Promise<ModifyFaqResponse> => {
    let response: ModifyFaqResponse = {
      success: false,
      faqError: undefined,
    };
    response = await adminService.updateFaq(faqToUpdate);
    return response;
  };

  return { updateFaq };
};

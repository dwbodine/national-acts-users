import { Faq } from '@/types/public';
import { ModifyFaqResponse } from '@/types/admin';
import { adminService } from '../../services';

export const useUpdateFaq = () => {
  const updateFaq = async (faqToUpdate: Faq): Promise<ModifyFaqResponse> => await adminService.updateFaq(faqToUpdate);

  return { updateFaq };
};

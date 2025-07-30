import { ModifyFaqResponse } from '@/types/admin';
import { adminService } from '../../services';

export const useDeleteFaq = () => {
  const deleteFaq = async (faqId: number): Promise<ModifyFaqResponse> =>
    await adminService.deleteFaq(faqId);

  return { deleteFaq };
};

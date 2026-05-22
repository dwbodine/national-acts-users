import { ModifyFaqResponse } from '@/types/responses';

import { adminService } from '../../services';

export const useDeleteFaq = () => {
  const deleteFaq = async (faqId: number): Promise<ModifyFaqResponse> =>
    await adminService.deleteFaq(faqId);

  return { deleteFaq };
};

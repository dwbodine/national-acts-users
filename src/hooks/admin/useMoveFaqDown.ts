import { ModifyFaqResponse } from '@/types/admin';
import { adminService } from '../../services';

export const useMoveFaqDown = () => {
  const moveFaqDown = async (faqId: number): Promise<ModifyFaqResponse> =>
    await adminService.moveFaqDown(faqId);

  return { moveFaqDown };
};

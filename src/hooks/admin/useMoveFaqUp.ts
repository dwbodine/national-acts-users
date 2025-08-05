import { ModifyFaqResponse } from '@/types/responses';
import { adminService } from '../../services';

export const useMoveFaqUp = () => {
  const moveFaqUp = async (faqId: number): Promise<ModifyFaqResponse> =>
    await adminService.moveFaqUp(faqId);

  return { moveFaqUp };
};

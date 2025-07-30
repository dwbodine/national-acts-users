import { ModifyFaqResponse } from '@/types/admin';
import { adminService } from '../../services';

export const useMoveFaqUp = () => {
  const moveFaqUp = async (faqId: number): Promise<ModifyFaqResponse> => await adminService.moveFaqUp(faqId);

  return { moveFaqUp };
};

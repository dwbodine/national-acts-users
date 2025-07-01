import { adminService } from '../../services';
import { ModifyFaqResponse } from '@/types/admin';

export const useMoveFaqDown = () => {
  const moveFaqDown = async (faqId: number): Promise<ModifyFaqResponse> => {
    let response: ModifyFaqResponse = {
      success: false,
      faqError: undefined,
    };
    response = await adminService.moveFaqDown(faqId);
    return response;
  };

  return { moveFaqDown };
};

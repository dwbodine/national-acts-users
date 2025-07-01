import { adminService } from '../../services';
import { ModifyFaqResponse } from '@/types/admin';

export const useMoveFaqUp = () => {
  const moveFaqUp = async (faqId: number): Promise<ModifyFaqResponse> => {
    let response: ModifyFaqResponse = {
      success: false,
      faqError: undefined,
    };
    response = await adminService.moveFaqUp(faqId);
    return response;
  };

  return { moveFaqUp };
};

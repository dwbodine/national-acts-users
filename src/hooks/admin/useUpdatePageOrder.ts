import { Page } from '@/types/public';
import { adminService } from '../../services';
import { ModifyPageResponse } from '@/types/admin';

export const useUpdatePageOrder = () => {
  const updatePageOrder = async (pagesToUpdate: Page[]): Promise<ModifyPageResponse> => {
    let response: ModifyPageResponse = {
      success: false,
      pageError: undefined,
    };
    response = await adminService.updatePageOrder(pagesToUpdate);
    return response;
  };

  return { updatePageOrder };
};

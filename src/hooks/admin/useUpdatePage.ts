import { Page } from '@/types/public';
import { adminService } from '../../services';
import { ModifyPageResponse } from '@/types/admin';

export const useUpdatePage = () => {
  const updatePage = async (
    pageToUpdate: Page,
  ): Promise<ModifyPageResponse> => {
    let response: ModifyPageResponse = {
      success: false,
      pageError: undefined,
    };
    response = await adminService.updatePage(pageToUpdate);
    return response;
  };

  return { updatePage };
};

import { ModifyPageResponse } from '@/types/responses';
import { Page } from '@/types/public';
import { adminService } from '../../services';

export const useUpdatePage = () => {
  const updatePage = async (pageToUpdate: Page): Promise<ModifyPageResponse> =>
    await adminService.updatePage(pageToUpdate);

  return { updatePage };
};

import { ModifyPageResponse } from '@/types/responses';
import { Page } from '@/types/public';
import { adminService } from '../../services';

export const useUpdatePageOrder = () => {
  const updatePageOrder = async (pagesToUpdate: Page[]): Promise<ModifyPageResponse> =>
    await adminService.updatePageOrder(pagesToUpdate);

  return { updatePageOrder };
};

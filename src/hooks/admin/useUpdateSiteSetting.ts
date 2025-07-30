import { SiteSetting, UpdateSettingResponse } from '@/types/public';
import { adminService } from '../../services';

export const useUpdateSiteSetting = () => {
  const updateSiteSettings = async (
    settingsToUpdate: SiteSetting[],
  ): Promise<UpdateSettingResponse> =>
    await adminService.updateSiteSettings(settingsToUpdate);

  return { updateSiteSettings };
};

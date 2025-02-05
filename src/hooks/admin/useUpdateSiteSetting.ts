import { adminService } from '../../services';
import { SiteSetting, UpdateSettingResponse } from '@/types/public';

export const useUpdateSiteSetting = () => {
  const updateSiteSettings = async (
    settingsToUpdate: SiteSetting[],
  ): Promise<UpdateSettingResponse> => {
    let response: UpdateSettingResponse = {
      success: false,
      settingsError: undefined,
    };
    response = await adminService.updateSiteSettings(settingsToUpdate);
    return response;
  };

  return { updateSiteSettings };
};

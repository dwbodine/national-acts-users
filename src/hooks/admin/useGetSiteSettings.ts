import { GetSettingsResponse } from '@/types/public'; 
import { publicService } from '../../services';

export const useGetSiteSettings = () => {
  const getAllSettings = async (): Promise<GetSettingsResponse> => {
    let response: GetSettingsResponse = {
      settings: undefined,
      settingsError: undefined,
    };
    response = await publicService.getSiteSettings();
    return response;
  };

  return { getAllSettings };
};

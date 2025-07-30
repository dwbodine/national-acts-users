import { GetSettingsResponse } from '@/types/public';
import { publicService } from '../../services';

export const useGetSiteSettings = () => {
  const getAllSettings = async (): Promise<GetSettingsResponse> => await publicService.getSiteSettings();

  return { getAllSettings };
};

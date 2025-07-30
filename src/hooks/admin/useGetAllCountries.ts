import { GetCountriesResponse } from '@/types/admin';
import { adminService } from '../../services';

export const useGetAllCountries = () => {
  const getAllCountries = async (): Promise<GetCountriesResponse> =>
    await adminService.getAllCountries();

  return { getAllCountries };
};

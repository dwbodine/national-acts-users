import { GetCountriesResponse } from '@/types/responses';
import { adminService } from '../../services';

export const useGetAllCountries = () => {
  const getAllCountries = async (): Promise<GetCountriesResponse> =>
    await adminService.getAllCountries();

  return { getAllCountries };
};

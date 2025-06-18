import { adminService } from '../../services';
import { GetCountriesResponse } from '@/types/admin';

export const useGetAllCountries = () => {
  const getAllCountries = async (): Promise<GetCountriesResponse> => {
    let response: GetCountriesResponse = {
      countries: [],
      countryError: undefined,
    };
    response = await adminService.getAllCountries();
    return response;
  };

  return { getAllCountries };
};

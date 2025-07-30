import { GetExternalVenuesResponse } from '@/types/admin';
import { adminService } from '../../services';

export const useGetAllVenues = () => {
  const getAllVenues = async (searchTerm?: string): Promise<GetExternalVenuesResponse> =>
    await adminService.getAllVenues(searchTerm);

  return { getAllVenues };
};

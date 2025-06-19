import { adminService } from '../../services';
import { GetExternalVenuesResponse } from '@/types/admin';

export const useGetAllVenues = () => {
  const getAllVenues = async (searchTerm?: string): Promise<GetExternalVenuesResponse> => {
    let response: GetExternalVenuesResponse = {
      venues: [],
      venueError: undefined,
    };
    response = await adminService.getAllVenues(searchTerm);
    return response;
  };

  return { getAllVenues };
};

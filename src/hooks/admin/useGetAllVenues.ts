import { adminService } from '../../services';
import { GetExternalVenuesResponse } from '@/types/admin';

export const useGetAllVenues = () => {
  const getAllVenues = async (): Promise<GetExternalVenuesResponse> => {
    let response: GetExternalVenuesResponse = {
      venues: [],
      venueError: undefined,
    };
    response = await adminService.getAllVenues();
    return response;
  };

  return { getAllVenues };
};

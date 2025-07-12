import { adminService } from '../../services';
import { ModifyExternalVenueResponse } from '@/types/admin';

export const useDeleteVenue = () => {
  const deleteVenue = async (venueId: number): Promise<ModifyExternalVenueResponse> => {
    let response: ModifyExternalVenueResponse = {
      success: false,
      venueError: undefined,
    };
    response = await adminService.deleteVenue(venueId);
    return response;
  };

  return { deleteVenue };
};

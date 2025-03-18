import { adminService } from '../../services';
import { ExternalVenue, ModifyExternalVenueResponse } from '@/types/admin';

export const useUpdateVenue = () => {
  const updateVenue = async (
    venueToUpdate: ExternalVenue,
  ): Promise<ModifyExternalVenueResponse> => {
    let response: ModifyExternalVenueResponse = {
      success: false,
      venueError: undefined,
    };
    response = await adminService.updateVenue(venueToUpdate);
    return response;
  };

  return { updateVenue };
};

import { ExternalVenue, ModifyExternalVenueResponse } from '@/types/admin';
import { adminService } from '../../services';

export const useUpdateVenue = () => {
  const updateVenue = async (
    venueToUpdate: ExternalVenue,
  ): Promise<ModifyExternalVenueResponse> => await adminService.updateVenue(venueToUpdate);

  return { updateVenue };
};

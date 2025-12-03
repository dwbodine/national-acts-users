import { ExternalVenue } from '@/types/admin';
import { ModifyExternalVenueResponse } from '@/types/responses';

import { adminService } from '../../services';

export const useUpdateVenue = () => {
  const updateVenue = async (venueToUpdate: ExternalVenue): Promise<ModifyExternalVenueResponse> =>
    await adminService.updateVenue(venueToUpdate);

  return { updateVenue };
};

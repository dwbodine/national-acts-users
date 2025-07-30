import { ModifyExternalVenueResponse } from '@/types/admin';
import { adminService } from '../../services';

export const useDeleteVenue = () => {
  const deleteVenue = async (venueId: number): Promise<ModifyExternalVenueResponse> =>
    await adminService.deleteVenue(venueId);

  return { deleteVenue };
};

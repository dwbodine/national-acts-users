import { FeaturedArtist } from '@/types/public';
import { ModifyFeaturedArtistsResponse } from '@/types/responses';

import { adminService } from '../../services';

export const useUpdateFeaturedArtistsOrder = () => {
  const updateFeaturedArtistsOrder = async (
    featuredArtistsToUpdate: FeaturedArtist[],
  ): Promise<ModifyFeaturedArtistsResponse> =>
    await adminService.updateFeaturedArtistOrder(featuredArtistsToUpdate);

  return { updateFeaturedArtistsOrder };
};

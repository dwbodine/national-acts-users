import { FeaturedArtist } from '@/types/public';
import { ModifyFeaturedArtistResponse } from '@/types/responses';

import { adminService } from '../../services';

export const useUpdateFeaturedArtist = () => {
  const updateFeaturedArtist = async (
    featuredArtistToUpdate: FeaturedArtist,
  ): Promise<ModifyFeaturedArtistResponse> =>
    await adminService.updateFeaturedArtist(featuredArtistToUpdate);

  return { updateFeaturedArtist };
};

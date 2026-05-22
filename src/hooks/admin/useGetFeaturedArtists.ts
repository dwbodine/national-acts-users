'use client';

import { publicService } from '@/services';
import { GetFeaturedArtistsResponse } from '@/types/responses';

export const useGetFeaturedArtists = () => {
  const getFeaturedArtists = async (): Promise<GetFeaturedArtistsResponse> =>
    await publicService.getFeaturedArtists();
  return { getFeaturedArtists };
};

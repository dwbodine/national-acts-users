'use client';

import { useCallback } from 'react';

import { publicService } from '@/services';
import { FanMomentFilter } from '@/types/props';
import { GetFanMomentsResponse } from '@/types/responses';

export const useGetFanMoments = () => {
  const getFanMoments = useCallback(
    async (filter: FanMomentFilter): Promise<GetFanMomentsResponse> =>
      await publicService.getFanMoments(filter),
    [],
  );

  return { getFanMoments };
};

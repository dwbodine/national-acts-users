import { useCallback } from 'react';

import { GetSellersResponse } from '@/types/responses';

import { publicService } from '../../services';

let getSellersInFlight: Promise<GetSellersResponse> | null = null;

export const useGetSellers = () => {
  const getSellers = useCallback(async (): Promise<GetSellersResponse> => {
    if (getSellersInFlight) {
      return getSellersInFlight;
    }

    getSellersInFlight = publicService.getSellers().finally(() => {
      getSellersInFlight = null;
    });

    return getSellersInFlight;
  }, []);

  return { getSellers };
};

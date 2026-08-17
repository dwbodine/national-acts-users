import { useCallback } from 'react';

import { GetOrdersResponse } from '@/types/responses';

import { publicService } from '../../services';

export const useGetRecentOrders = () => {
  const getRecentOrders = useCallback(
    async (): Promise<GetOrdersResponse> => await publicService.getRecentOrders(),
    [],
  );

  return { getRecentOrders };
};

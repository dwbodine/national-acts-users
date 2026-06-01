import { useCallback } from 'react';

import { GetExternalVenuesResponse } from '@/types/responses';

import { adminService } from '../../services';

export const useGetAllVenues = () => {
  const getAllVenues = useCallback(
    async (searchTerm?: string): Promise<GetExternalVenuesResponse> =>
      await adminService.getAllVenues(searchTerm),
    [],
  );

  return { getAllVenues };
};

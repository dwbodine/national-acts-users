import { useCallback } from 'react';

import { GetRolesResponse } from '@/types/responses';

import { userService } from '../../services';

let getAllRolesInFlight: Promise<GetRolesResponse> | null = null;

export const useGetAllRoles = () => {
  const getAllRoles = useCallback(async (): Promise<GetRolesResponse> => {
    if (getAllRolesInFlight) {
      return getAllRolesInFlight;
    }

    getAllRolesInFlight = userService.getRoles().finally(() => {
      getAllRolesInFlight = null;
    });

    return getAllRolesInFlight;
  }, []);

  return { getAllRoles };
};

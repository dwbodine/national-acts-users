import { useCallback } from 'react';

import { GetUsersResponse } from '@/types/responses';

import { userService } from '../../services';

let getAllUsersInFlight: Promise<GetUsersResponse> | null = null;

export const useGetAllUsers = () => {
  const getAllUsers = useCallback(async (): Promise<GetUsersResponse> => {
    if (getAllUsersInFlight) {
      return getAllUsersInFlight;
    }

    getAllUsersInFlight = userService.getUsers().finally(() => {
      getAllUsersInFlight = null;
    });

    return getAllUsersInFlight;
  }, []);

  return { getAllUsers };
};

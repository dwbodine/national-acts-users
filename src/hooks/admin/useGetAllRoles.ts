import { GetRolesResponse } from '@/types/user';
import { userService } from '../../services';

export const useGetAllRoles = () => {
  const getAllRoles = async (): Promise<GetRolesResponse> => await userService.getRoles();

  return { getAllRoles };
};

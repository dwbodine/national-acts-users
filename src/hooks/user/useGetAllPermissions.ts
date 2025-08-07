import { GetPermissionsResponse } from '@/types/responses';
import { userService } from '../../services';

export const useGetAllPermissions = () => {
  const getAllPermissions = async (): Promise<GetPermissionsResponse> =>
    await userService.getPermissions();

  return { getAllPermissions };
};

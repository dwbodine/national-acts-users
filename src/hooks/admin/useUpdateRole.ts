import { Role } from '@/types/user';
import { UpdateRoleResponse } from '@/types/responses';
import { userService } from '../../services';

export const useUpdateRole = () => {
  const updateRole = async (roleToUpdate: Role): Promise<UpdateRoleResponse> =>
    await userService.updateRole(roleToUpdate);

  return { updateRole };
};

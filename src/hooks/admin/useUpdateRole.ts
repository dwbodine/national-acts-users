import { UpdateRoleResponse } from '@/types/responses';
import { Role } from '@/types/user';

import { userService } from '../../services';

export const useUpdateRole = () => {
  const updateRole = async (roleToUpdate: Role): Promise<UpdateRoleResponse> =>
    await userService.updateRole(roleToUpdate);

  return { updateRole };
};

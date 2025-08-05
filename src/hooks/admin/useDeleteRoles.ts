import { UpdateRoleResponse } from '@/types/responses';
import { userService } from '../../services';

export const useDeleteRoles = () => {
  const deleteRoles = async (roleIds: number[]): Promise<UpdateRoleResponse> =>
    await userService.deleteRoles(roleIds);

  return { deleteRoles };
};

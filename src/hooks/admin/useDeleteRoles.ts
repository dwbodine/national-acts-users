import { UpdateRoleResponse } from '@/types/user';
import { userService } from '../../services';

export const useDeleteRoles = () => {
  const deleteRoles = async (roleIds: number[]): Promise<UpdateRoleResponse> => await userService.deleteRoles(roleIds);

  return { deleteRoles };
};

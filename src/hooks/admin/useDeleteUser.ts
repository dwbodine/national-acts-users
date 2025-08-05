import { UpdateUserResponse } from '@/types/responses';
import { userService } from '../../services';

export const useDeleteUser = () => {
  const deleteUser = async (userId: number): Promise<UpdateUserResponse> =>
    await userService.deleteUser(userId);
  return { deleteUser };
};

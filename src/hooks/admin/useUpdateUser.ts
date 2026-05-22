import { UpdateUserResponse } from '@/types/responses';
import { User } from '@/types/user';

import { userService } from '../../services';

export const useUpdateUser = () => {
  const updateUser = async (userToUpdate: User): Promise<UpdateUserResponse> =>
    await userService.updateUser(userToUpdate);

  return { updateUser };
};

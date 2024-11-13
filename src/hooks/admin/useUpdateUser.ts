import { UpdateUserResponse, User } from '@/types/user';
import { userService } from '../../services';

export const useUpdateUser = () => {
  const updateUser = async (userToUpdate: User): Promise<UpdateUserResponse> => {
    let response: UpdateUserResponse = {
      success: false,
      userError: undefined,
    };
    response = await userService.updateUser(userToUpdate);
    return response;
  };

  return { updateUser };
};

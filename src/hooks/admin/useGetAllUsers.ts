import { GetUsersResponse } from '@/types/user';
import { userService } from '../../services';

export const useGetAllUsers = () => {
  const getAllUsers = async (): Promise<GetUsersResponse> => {
    let response: GetUsersResponse = {
      users: [],
      userError: undefined,
    };
    response = await userService.getUsers();
    return response;
  };

  return { getAllUsers };
};

import { GetUsersResponse } from '@/types/user';
import { userService } from '../../services';

export const useGetAllUsers = () => {
  const getAllUsers = async (): Promise<GetUsersResponse> => await userService.getUsers();
  
  return { getAllUsers };
};

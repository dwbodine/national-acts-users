import { UpdateUserResponse, User } from "@/types/user";
import { userService } from "../../services";

export const useDeleteUser = () => {
  const deleteUser = async (userId: number): Promise<UpdateUserResponse> => {
    let response: UpdateUserResponse = {
        success: false,
        userError: undefined
    };
    response = await userService.deleteUser(userId);
    return response;    
  };

  return { deleteUser };
};
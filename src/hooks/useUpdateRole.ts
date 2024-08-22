import { Role, UpdateRoleResponse } from "@/types/user";
import { userService } from "../services";

export const useUpdateRole = () => {
  const updateRole = async (roleToUpdate: Role): Promise<UpdateRoleResponse> => {
    let response: UpdateRoleResponse = {
        success: false,
        roleError: undefined
    };
    response = await userService.updateRole(roleToUpdate);
    return response;    
  };

  return { updateRole };
};
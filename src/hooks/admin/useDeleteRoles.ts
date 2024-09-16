import { UpdateRoleResponse } from "@/types/user";
import { userService } from "../../services";

export const useDeleteRoles = () => {
  const deleteRoles = async (roleIds: number[]): Promise<UpdateRoleResponse> => {
    let response: UpdateRoleResponse = {
        success: false,
        roleError: undefined
    };
    response = await userService.deleteRoles(roleIds);
    return response;    
  };

  return { deleteRoles };
};
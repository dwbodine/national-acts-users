import { GetRolesResponse, GetUsersResponse } from "@/types/user";
import { userService } from "../services";

export const useGetAllRoles = () => {
  const getAllRoles = async (): Promise<GetRolesResponse> => {
    let response: GetRolesResponse = {
        roles: [],
        roleError: undefined
    };
    response = await userService.getRoles();
    return response;    
  };

  return { getAllRoles };
};
import { GetPermissionsResponse } from "@/types/user";
import { userService } from "../services";

export const useGetAllPermissions = () => {
  const getAllPermissions = async (): Promise<GetPermissionsResponse> => {
    let response: GetPermissionsResponse = {
        permissions: [],
        permissionError: undefined
    };
    response = await userService.getPermissions();
    return response;    
  };

  return { getAllPermissions };
};
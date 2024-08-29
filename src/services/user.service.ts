import { GetActivityResponse, GetPermissionsResponse, GetRolesResponse, GetUsersResponse, LogActivityResponse, Permission, Role, UpdateRoleResponse, UpdateUserResponse, User, UserActivity, UserActivityType } from "@/types/user";
import { getAuthorizationHeader } from "@/utils/getAuthorizationHeader";
import axios, { AxiosInstance } from "axios";

export class UserService {
    protected readonly instance: AxiosInstance;
    
    public constructor(url: string) {
      this.instance = axios.create({
        baseURL: url,
        timeout: 30000,
        timeoutErrorMessage: "Time out!",
      });
    }

    getUsers = async (): Promise<GetUsersResponse> => {
        let url = `/admin/users`;
    
        let usersResponse: GetUsersResponse = {
          users: undefined,
          userError: undefined,
          statusCode: 200
        };
    
        const headers = getAuthorizationHeader();
    
        return this.instance
          .get(url, {
            headers: headers
          })
          .then((res) => {
            const events = res.data;
            usersResponse.users = events.length ? events as User[] : [];
            return usersResponse;
          })
          .catch((err) => {
            console.log(err);
            var errorMessage = "";
            if (err?.response?.status) {
                usersResponse.statusCode = parseInt(err.response.status);
            }
            if (err?.response?.data?.msg) {
              errorMessage = err.response.data.msg;
            } else {
              errorMessage = "Unknown error while fetching users";
            }
            usersResponse.userError = errorMessage;
            return usersResponse;
        });
    };

    getRoles = async (): Promise<GetRolesResponse> => {
        let url = `/admin/roles`;
    
        let rolesResponse: GetRolesResponse = {
          roles: undefined,
          roleError: undefined,
          statusCode: 200
        };
    
        const headers = getAuthorizationHeader();
    
        return this.instance
          .get(url, {
            headers: headers
          })
          .then((res) => {
            const roles = res.data;
            rolesResponse.roles = roles.length ? roles as Role[] : [];
            return rolesResponse;
          })
          .catch((err) => {
            console.log(err);
            var errorMessage = "";
            if (err?.response?.status) {
                rolesResponse.statusCode = parseInt(err.response.status);
            }
            if (err?.response?.data?.msg) {
              errorMessage = err.response.data.msg;
            } else {
              errorMessage = "Unknown error while fetching roles";
            }
            rolesResponse.roleError = errorMessage;
            return rolesResponse;
        });
    }

    getPermissions = async (): Promise<GetPermissionsResponse> => {
      let url = `/admin/permissions`;
  
      let permResponse: GetPermissionsResponse = {
        permissions: undefined,
        permissionError: undefined,
        statusCode: 200
      };
  
      const headers = getAuthorizationHeader();
  
      return this.instance
        .get(url, {
          headers: headers
        })
        .then((res) => {
          const permissions = res.data;
          permResponse.permissions = permissions.length ? permissions as Permission[] : [];
          return permResponse;
        })
        .catch((err) => {
          console.log(err);
          var errorMessage = "";
          if (err?.response?.status) {
            permResponse.statusCode = parseInt(err.response.status);
          }
          if (err?.response?.data?.msg) {
            errorMessage = err.response.data.msg;
          } else {
            errorMessage = "Unknown error while fetching users";
          }
          permResponse.permissionError = errorMessage;
          return permResponse;
      });
    }
    
    updateRole = async (roleToUpdate: Role): Promise<UpdateRoleResponse> => {
      let url = `/admin/updateRole`;

      let rolesResponse: UpdateRoleResponse = {
        success: false,
        roleError: undefined,
        statusCode: 200
      };

      const data = JSON.stringify(roleToUpdate);

      const headers = getAuthorizationHeader();

      return this.instance
        .post(url, data, {
          headers: headers
        })
        .then((res) => {
          rolesResponse.success = res.data;
          return rolesResponse;
        })
        .catch((err) => {
          console.log(err);
          var errorMessage = "";
          if (err?.response?.status) {
              rolesResponse.statusCode = parseInt(err.response.status);
          }
          if (err?.response?.data?.msg) {
            errorMessage = err.response.data.msg;
          } else {
            errorMessage = "Unknown error while updating role";
          }
          rolesResponse.roleError = errorMessage;
          return rolesResponse;
      });
    }

    deleteRoles = async (roleIds: number[]): Promise<UpdateRoleResponse> => {
      let url = `/admin/deleteRoles`;

      let rolesResponse: UpdateRoleResponse = {
        success: false,
        roleError: undefined,
        statusCode: 200
      };

      const data = JSON.stringify(roleIds);

      const headers = getAuthorizationHeader();

      return this.instance
        .post(url, data, {
          headers: headers
        })
        .then((res) => {
          rolesResponse.success = res.data;
          return rolesResponse;
        })
        .catch((err) => {
          console.log(err);
          var errorMessage = "";
          if (err?.response?.status) {
              rolesResponse.statusCode = parseInt(err.response.status);
          }
          if (err?.response?.data?.msg) {
            errorMessage = err.response.data.msg;
          } else {
            errorMessage = "Unknown error while deleting roles";
          }
          rolesResponse.roleError = errorMessage;
          return rolesResponse;
      });
    }

    updateUser = async (userToUpdate: User): Promise<UpdateUserResponse> => {
      let url = `/admin/updateUser`;

      let userResponse: UpdateUserResponse = {
        success: false,
        userError: undefined,
        statusCode: 200
      };

      const data = JSON.stringify(userToUpdate);

      const headers = getAuthorizationHeader();

      return this.instance
        .post(url, data, {
          headers: headers
        })
        .then((res) => {
          userResponse.success = res.data;
          return userResponse;
        })
        .catch((err) => {
          console.log(err);
          var errorMessage = "";
          if (err?.response?.status) {
            userResponse.statusCode = parseInt(err.response.status);
          }
          if (err?.response?.data?.msg) {
            errorMessage = err.response.data.msg;
          } else {
            errorMessage = "Unknown error while updating user";
          }
          userResponse.userError = errorMessage;
          return userResponse;
      });
    }

    deleteUser = async (userId: number): Promise<UpdateUserResponse> => {
      let url = `/admin/deleteUser`;

      let userResponse: UpdateUserResponse = {
        success: false,
        userError: undefined,
        statusCode: 200
      };

      const data = JSON.stringify({
        'userId': userId
      });

      const headers = getAuthorizationHeader();

      return this.instance
        .post(url, data, {
          headers: headers
        })
        .then((res) => {
          userResponse.success = res.data;
          return userResponse;
        })
        .catch((err) => {
          console.log(err);
          var errorMessage = "";
          if (err?.response?.status) {
            userResponse.statusCode = parseInt(err.response.status);
          }
          if (err?.response?.data?.msg) {
            errorMessage = err.response.data.msg;
          } else {
            errorMessage = "Unknown error while deleting user";
          }
          userResponse.userError = errorMessage;
          return userResponse;
      });
    }

    logUserActivity = async(activityType: UserActivityType, activityData: string | undefined = undefined, token: string | undefined = undefined): Promise<LogActivityResponse> => {
      let url = '/internal/logUserActivity';

      let activityResponse: LogActivityResponse = {
        statusCode: 200,
        logActivityError: undefined
      };

      const headers = getAuthorizationHeader(token);

      const data = {
        "activityType": activityType,
        "activityData": activityData
      };
    
      return this.instance
        .post(url, data, {
          headers: headers
        })
        .then((res) => {
          const success = res.data;
          if (!success) {
            activityResponse.statusCode = 500;
            activityResponse.logActivityError = "Unknown error while logging activity data";
          }
          return activityResponse;
        })
        .catch((err) => {
          console.log(err);
          var errorMessage = "";
          if (err?.response?.status) {
            activityResponse.statusCode = parseInt(err.response.status);
          }
          if (err?.response?.data?.msg) {
            errorMessage = err.response.data.msg;
          } else {
            errorMessage = "Unknown error while logging activity data";
          }
          activityResponse.logActivityError = errorMessage;
          return activityResponse;
      });
    };

    getUserActivity = async(start: number, end: number, userId: number | undefined = undefined, activityType: UserActivityType | undefined = undefined, filterAdmins: boolean = false): Promise<GetActivityResponse> => {
      let url = '/dashboard/getUserActivity';

      let activityResponse: GetActivityResponse = {
        statusCode: 200,
        logActivityError: undefined
      };

      const headers = getAuthorizationHeader();

      const data = {
        "start": start,
        "end": end,
        "userId": userId,
        "activityType": activityType,
        "filterAdmins": filterAdmins ? "1" : undefined
      };
    
      return this.instance
        .post(url, data, {
          headers: headers
        })
        .then((res) => {
          const activities = res.data;
          activityResponse.activities = activities.length ? activities as UserActivity[] : [];
          return activityResponse;
        })
        .catch((err) => {
          console.log(err);
          var errorMessage = "";
          if (err?.response?.status) {
            activityResponse.statusCode = parseInt(err.response.status);
          }
          if (err?.response?.data?.msg) {
            errorMessage = err.response.data.msg;
          } else {
            errorMessage = "Unknown error while getting activity data";
          }
          activityResponse.logActivityError = errorMessage;
          return activityResponse;
      });
    };
}
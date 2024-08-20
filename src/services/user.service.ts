import { GetActivityResponse, GetRolesResponse, GetUsersResponse, LogActivityResponse, Role, User, UserActivity, UserActivityType } from "@/types/user";
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
              errorMessage = "Unknown error while fetching users";
            }
            rolesResponse.roleError = errorMessage;
            return rolesResponse;
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

    getUserActivity = async(start: number, end: number, userId: number | undefined = undefined, activityType: UserActivityType | undefined = undefined): Promise<GetActivityResponse> => {
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
        "activityType": activityType
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
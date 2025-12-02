import {
  GetActivityResponse,
  GetPermissionsResponse,
  GetRolesResponse,
  GetUsersResponse,
  LogActivityResponse,
  UpdateRoleResponse,
  UpdateUserResponse,
  UserSellerResponse,
} from '@/types/responses';
import { Permission, Role, User, UserActivity, UserActivityType, UserSeller } from '@/types/user';
import axios, { AxiosError, AxiosInstance } from 'axios';
import getAuthorizationHeader from '@/utils/getAuthorizationHeader';

export class UserService {
  protected readonly instance: AxiosInstance;

  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: 'Time out!',
    });
  }

  getUsers = async (): Promise<GetUsersResponse> => {
    const url = `/admin/users`;

    const response: GetUsersResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.users = res.data ? (res.data as User[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ?? 'Unknown error while fetching users - please contact your administrator';
    }

    return response;
  };

  getRoles = async (): Promise<GetRolesResponse> => {
    const url = `/admin/roles`;

    const response: GetRolesResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.roles = res.data ? (res.data as Role[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ?? 'Unknown error while fetching roles - please contact your administrator';
    }

    return response;
  };

  getPermissions = async (): Promise<GetPermissionsResponse> => {
    const url = `/admin/permissions`;

    const response: GetPermissionsResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.permissions = res.data ? (res.data as Permission[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while fetching permissions - please contact your administrator';
    }

    return response;
  };

  getUserSellerFromEventId = async (
    eventId: number,
    userId: number,
  ): Promise<UserSellerResponse> => {
    const url = `/user/getUserSellerFromEventId/${userId}/${eventId}`;

    const response: UserSellerResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.userSeller = res.data ? (res.data as UserSeller) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while fetching user seller - please contact your administrator';
    }

    return response;
  };

  updateRole = async (roleToUpdate: Role): Promise<UpdateRoleResponse> => {
    const url = `/admin/roles/update`;

    const response: UpdateRoleResponse = {};

    const data = JSON.stringify(roleToUpdate);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.data !== undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ?? 'Unknown error while updating role - please contact your administrator';
    }

    return response;
  };

  deleteRoles = async (roleIds: number[]): Promise<UpdateRoleResponse> => {
    const url = `/admin/roles/delete`;

    const response: UpdateRoleResponse = {};

    const data = JSON.stringify(roleIds);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.data !== undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ?? 'Unknown error while deleting roles - please contact your administrator';
    }

    return response;
  };

  updateUser = async (userToUpdate: User): Promise<UpdateUserResponse> => {
    const url = `/admin/users/update`;

    const response: UpdateUserResponse = {};

    const data = JSON.stringify(userToUpdate);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.data !== undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ?? 'Unknown error while updating user - please contact your administrator';
    }

    return response;
  };

  deleteUser = async (userId: number): Promise<UpdateUserResponse> => {
    const url = `/admin/users/delete`;

    const response: UpdateUserResponse = {};

    const data = JSON.stringify({ userId });

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.data !== undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ?? 'Unknown error while deleting user - please contact your administrator';
    }

    return response;
  };

  logUserActivity = async (
    activityType: UserActivityType,
    activityData: string | undefined = undefined,
    token: string | undefined = undefined,
  ): Promise<LogActivityResponse> => {
    const url = '/user/logUserActivity';

    const response: LogActivityResponse = {};

    const headers = getAuthorizationHeader(token);

    const data = {
      activityData,
      activityType,
    };

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.data !== undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while logging activity data - please contact your administrator';
    }

    return response;
  };

  getUserActivity = async (
    start: number,
    end: number,
    userId: number | undefined = undefined,
    activityType: UserActivityType | undefined = undefined,
    filterAdmins: boolean = false,
  ): Promise<GetActivityResponse> => {
    const url = '/dashboard/getUserActivity';

    const response: GetActivityResponse = {};

    const headers = getAuthorizationHeader();

    const data = {
      activityType,
      end,
      filterAdmins: filterAdmins ? '1' : undefined,
      start,
      userId,
    };

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
      response.activities = res.data ? (res.data as UserActivity[]) : [];
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while fetching activity data - please contact your administrator';
    }

    return response;
  };
}

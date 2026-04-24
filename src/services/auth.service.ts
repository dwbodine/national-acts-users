import axios, { AxiosError, AxiosInstance } from 'axios';

import {
  getErrorMessage,
  getObjectData,
  getOptionalData,
  getStatusCode,
} from '@/lib/serviceResponses';
import {
  LogResponse,
  UserLoginResponse,
  UserLoginResponseData,
  UserResponse,
} from '@/types/responses';
import getAuthorizationHeader from '@/utils/getAuthorizationHeader';

import { User } from '../types/user';

export class AuthService {
  protected readonly instance: AxiosInstance;

  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: 'Time out!',
    });
  }

  getLogs = async (): Promise<LogResponse> => {
    const url = `/log`;

    const response: LogResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.logs = getOptionalData<string>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while fetching logs - please contact your administrator',
      );
    }

    return response;
  };

  getCronLogs = async (): Promise<LogResponse> => {
    const url = `/cron_log`;

    const response: LogResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.logs = getOptionalData<string>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while fetching cron logs - please contact your administrator',
      );
    }

    return response;
  };

  login = async (username: string, password: string): Promise<UserLoginResponse> => {
    const url = '/user/login';
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env['NEXT_PUBLIC_USER_API_KEY']}`,
    };

    const data = {
      password,
      username,
    };

    const response: UserLoginResponse = {};

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
      response.user = getOptionalData<User>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      const errData = err?.response?.data as UserLoginResponseData;
      const errorMessage = errData?.msg ?? err?.message;
      response.error =
        errorMessage ?? 'Unknown error during login - please contact your administrator';
    }

    return response;
  };

  resetPasswordSecure = async (
    username: string,
    password: string,
    confirmPassword: string,
  ): Promise<UserResponse> => {
    const url = '/user/resetPasswordSecured';
    const headers = getAuthorizationHeader();

    const data = {
      confirmPassword,
      password,
      username,
    };

    try {
      const res = await this.instance.post(url, data, { headers });
      return getObjectData<UserResponse>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      const response: UserResponse = {};
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while resetting password - please contact your administrator',
      );
      return response;
    }
  };

  forgotPassword = async (username: string): Promise<UserResponse> => {
    const url = '/user/sendPasswordReset';
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env['NEXT_PUBLIC_USER_API_KEY']}`,
    };

    const data = { username };

    try {
      const res = await this.instance.post(url, data, { headers });
      return getObjectData<UserResponse>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      const response: UserResponse = {};
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error during send of password reset email - please contact your administrator',
      );
      return response;
    }
  };

  validateResetCode = async (username: string, code: number): Promise<UserResponse> => {
    const url = '/user/validateResetCode';
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env['NEXT_PUBLIC_USER_API_KEY']}`,
    };

    const data = { code, username };

    try {
      const res = await this.instance.post(url, data, { headers });
      return getObjectData<UserResponse>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      const response: UserResponse = {};
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while validating reset code - please contact your administrator',
      );
      return response;
    }
  };

  resetPassword = async (
    username: string,
    password: string,
    confirmPassword: string,
    code: number,
  ): Promise<UserResponse> => {
    const url = '/user/resetPassword';
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env['NEXT_PUBLIC_USER_API_KEY']}`,
    };

    const data = {
      code,
      confirmPassword,
      password,
      username,
    };

    try {
      const res = await this.instance.post(url, data, { headers });
      return getObjectData<UserResponse>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      const response: UserResponse = {};
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while resetting password - please contact your administrator',
      );
      return response;
    }
  };

  register = async (
    username: string,
    firstName: string,
    lastName: string,
    sellerId: number,
    password: string,
    confirmPassword: string,
    notes?: string,
  ): Promise<UserResponse> => {
    const url = '/user/register';
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env['NEXT_PUBLIC_USER_API_KEY']}`,
    };

    const data = {
      confirmPassword,
      firstName,
      lastName,
      notes,
      password,
      sellerId,
      username,
    };

    try {
      const res = await this.instance.post(url, data, { headers });
      return getObjectData<UserResponse>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      const response: UserResponse = {};
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while registering user - please contact your administrator',
      );
      return response;
    }
  };
}

import {
  LogResponse,
  UserLoginResponse,
  UserLoginResponseData,
  UserResponse,
} from '@/types/responses';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { User } from '../types/user';
import getAuthorizationHeader from '@/utils/getAuthorizationHeader';

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
      response.logs = res.data ? (res.data as string) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ?? 'Unknown error while fetching logs - please contact your administrator';
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
      response.logs = res.data ? (res.data as string) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while fetching cron logs - please contact your administrator';
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
      response.user = res.data ? (res.data as User) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
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
      return res.data ? (res.data as UserResponse) : {};
    } catch (e) {
      const err = e as AxiosError;
      const response: UserResponse = {};
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while resetting password - please contact your administrator';
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
      return res.data ? (res.data as UserResponse) : {};
    } catch (e) {
      const err = e as AxiosError;
      const response: UserResponse = {};
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error during send of password reset email - please contact your administrator';
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
      return res.data ? (res.data as UserResponse) : {};
    } catch (e) {
      const err = e as AxiosError;
      const response: UserResponse = {};
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while validating reset code - please contact your administrator';
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
      return res.data ? (res.data as UserResponse) : {};
    } catch (e) {
      const err = e as AxiosError;
      const response: UserResponse = {};
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while resetting password - please contact your administrator';
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
      return res.data ? (res.data as UserResponse) : {};
    } catch (e) {
      const err = e as AxiosError;
      const response: UserResponse = {};
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ?? 'Unknown error while registering user - please contact your administrator';
      return response;
    }
  };
}

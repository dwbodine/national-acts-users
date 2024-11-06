import axios, { AxiosInstance } from "axios";
import { User, UserLoginResponse, UserResponse } from "../types/user";
import { getAuthorizationHeader } from "@/utils/getAuthorizationHeader";

export class AuthService {
  protected readonly instance: AxiosInstance;

  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: "Time out!",
    });
  }

  login = async (
    username: string,
    password: string
  ): Promise<UserLoginResponse> => {
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": `${process.env.NEXT_PUBLIC_USER_API_KEY}`,
    };

    const data = {
      username: username,
      password: password,
    };

    let userResponse: UserLoginResponse = {
      user: undefined,
      loginError: undefined,
    };

    return this.instance
      .post("/user/login", data, {
        headers: headers,
      })
      .then((res) => {
        const user = { ...res.data };
        userResponse.user = user as User;
        return userResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            "Unknown error during login - please contact your administrator";
        }
        userResponse.loginError = errorMessage;
        return userResponse;
      });
  };

  resetPasswordSecure = async (
    username: string,
    password: string,
    confirmPassword: string
  ): Promise<UserResponse> => {
    const headers = getAuthorizationHeader();

    const data = {
      username: username,
      password: password,
      confirmPassword: confirmPassword,
    };

    let userResponse: UserResponse = {
      user: undefined,
      errorMessage: undefined,
    };

    return this.instance
      .post("/user/resetPasswordSecured", data, {
        headers: headers,
      })
      .then((res) => {
        const response = { ...res.data };
        userResponse = response as UserResponse;
        return userResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            "Unknown error while resetting password - please contact your administrator";
        }
        userResponse.errorMessage = errorMessage;
        return userResponse;
      });
  };

  forgotPassword = async (username: string): Promise<UserResponse> => {
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": `${process.env.NEXT_PUBLIC_USER_API_KEY}`,
    };

    const data = {
      username: username,
    };

    let userResponse: UserResponse = {
      user: undefined,
      errorMessage: undefined,
    };

    return this.instance
      .post("/user/sendPasswordReset", data, {
        headers: headers,
      })
      .then((res) => {
        const response = { ...res.data };
        userResponse = response as UserResponse;
        return userResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            "Unknown error during send of password reset email - please contact your administrator";
        }
        userResponse.errorMessage = errorMessage;
        return userResponse;
      });
  };

  validateResetCode = async (
    username: string,
    code: number
  ): Promise<UserResponse> => {
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": `${process.env.NEXT_PUBLIC_USER_API_KEY}`,
    };

    const data = {
      username: username,
      code: code,
    };

    let userResponse: UserResponse = {
      user: undefined,
      errorMessage: undefined,
    };

    return this.instance
      .post("/user/validateResetCode", data, {
        headers: headers,
      })
      .then((res) => {
        const response = { ...res.data };
        userResponse = response as UserResponse;
        return userResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            "Unknown error while validating reset code - please contact your administrator";
        }
        userResponse.errorMessage = errorMessage;
        return userResponse;
      });
  };

  resetPassword = async (
    username: string,
    password: string,
    confirmPassword: string,
    code: number
  ): Promise<UserResponse> => {
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": `${process.env.NEXT_PUBLIC_USER_API_KEY}`,
    };

    const data = {
      username: username,
      password: password,
      confirmPassword: confirmPassword,
      code: code,
    };

    let userResponse: UserResponse = {
      user: undefined,
      errorMessage: undefined,
    };

    return this.instance
      .post("/user/resetPassword", data, {
        headers: headers,
      })
      .then((res) => {
        const response = { ...res.data };
        userResponse = response as UserResponse;
        return userResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            "Unknown error while resetting password - please contact your administrator";
        }
        userResponse.errorMessage = errorMessage;
        return userResponse;
      });
  };

  register = async (
    username: string,
    firstName: string,
    lastName: string,
    sellerId: number,
    password: string,
    confirmPassword: string,
    notes?: string
  ): Promise<UserResponse> => {
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": `${process.env.NEXT_PUBLIC_USER_API_KEY}`,
    };

    const data = {
      username: username,
      firstName: firstName,
      lastName: lastName,
      sellerId: sellerId,
      password: password,
      confirmPassword: confirmPassword,
      notes: notes,
    };

    let userResponse: UserResponse = {
      user: undefined,
      errorMessage: undefined,
    };

    return this.instance
      .post("/user/register", data, {
        headers: headers,
      })
      .then((res) => {
        const response = { ...res.data };
        userResponse = response as UserResponse;
        return userResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            "Unknown error while registering user - please contact your administrator";
        }
        userResponse.errorMessage = errorMessage;
        return userResponse;
      });
  };
}

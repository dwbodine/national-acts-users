import axios, { AxiosInstance } from "axios";
import { User, UserLoginResponse } from "../types/user";

export class AuthService {
  protected readonly instance: AxiosInstance;
  
  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: "Time out!",
    });
  }

  login = async (username: string, password: string): Promise<UserLoginResponse> => {
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env.NEXT_PUBLIC_USER_API_KEY}`
    };

    const data = {
      "username": username,
      "password": password,
    };

    let userResponse: UserLoginResponse = {
      user: undefined,
      loginError: undefined
    };

    return this.instance
      .post("/user/login", data, {
        headers: headers
      })
      .then((res) => {
        const user = { ...res.data};
        userResponse.user = user as User;
        return userResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = "Unknown error during login - please contact your administrator";
        }
        userResponse.loginError = errorMessage;
        return userResponse;
      });
  };
}
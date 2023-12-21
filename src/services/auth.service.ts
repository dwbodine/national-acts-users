import axios, { AxiosInstance } from "axios";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";
import { User } from "../types/user";

export class AuthService {
  protected readonly instance: AxiosInstance;
  
  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: "Time out!",
    });
  }

  login = (username: string, password: string) => {
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': 'AhRTNs.Hi63UCJetidPliMbyNeBMRbtkK58k-0rqmcnk3RsUWnbZ'
    };

    const data = {
      "username": username,
      "password": password,
    };

    return this.instance
      .post("/user/login", data, {
        headers: headers
      })
      .then((res) => {
        var user = {
          userId: res.data.userId,
          username: res.data.username,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          notes: res.data.notes,
          createdAt: res.data.createdAt,
          token: res.data.access_token,
          isAdmin: res.data.isAdmin,
          showInactiveEvents: res.data.showInactiveEvents,
          isAuthenticated: res.data.isAuthenticated,
          sellers: res.data.sellers
        };
        return {
          user: user as User,
          loginError: null
        }
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = "";
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = "Unknown error during login - please contact your administrator";
        }
        return {
          user: null,
          loginError: errorMessage
        }
      });
  };

  getMe = (userId: string) => {
    return this.instance
      .get(`/user/profile/${userId}`, {
        headers: getAuthorizationHeader(),
      })
      .then((res) => {
        return res.data;
      });
  };
}
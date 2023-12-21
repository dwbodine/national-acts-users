import { authService } from "../services";
import Cookies from "js-cookie";
import { LoginResponse, User } from "../types/user";

export const useLogin = () => {
  const login = async (username: string, password: string) => {
    const response = await authService.login(username, password);
    if (response && response.user) {
      Cookies.set("currentUser", JSON.stringify(response.user));
    }
    return response;
  };

  return { login };
};
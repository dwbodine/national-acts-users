import { authService } from "../services";
import Cookies from "js-cookie";

export const useLogin = () => {
  const login = async (username: string, password: string) => {
    const response = await authService.login(username, password);
    if (response && response.user && response.user.isAuthenticated) {
      const token = response.user.token || '';
      Cookies.set("currentUser", token);
    }
    return response;
  };

  return { login };
};
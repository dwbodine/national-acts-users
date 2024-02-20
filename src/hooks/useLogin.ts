import { authService } from "../services";
import Cookies from "js-cookie";

export const useLogin = () => {
  const login = async (username: string, password: string) => {
    const response = await authService.login(username, password);
    if (response && response.user && response.user.isAuthenticated) {
      Cookies.set("currentUser", JSON.stringify(response.user.username));
    }
    return response;
  };

  return { login };
};
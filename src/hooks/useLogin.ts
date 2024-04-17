import { User } from "@/types/user";
import { authService } from "../services";
import Cookies from "js-cookie";

export const useLogin = () => {
  const login = async (username: string, password: string) => {
    const response = await authService.login(username, password);
    if (response && response.user && response.user.isAuthenticated) {
      const user: User = { ...response.user};
      user.selectedSellerId = 0;
      localStorage.clear();
      localStorage.setItem('currentUser', JSON.stringify(user));
      Cookies.set('authToken', user.token || '');
    }
    return response;
  };

  return { login };
};
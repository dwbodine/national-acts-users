import { User, UserActivityType } from "@/types/user";
import { authService } from "../services";

import Cookies from "js-cookie";
import { useLogActivityData } from "./useLogActivityData";


export const useLogin = () => {
  const { logActivityData } = useLogActivityData();
  const login = async (username: string, password: string) => {
    const response = await authService.login(username, password);
    if (response && response.user && response.user.isAuthenticated) {
      const user: User = { ...response.user};
      await logActivityData(UserActivityType.Login, undefined, user.token);
      user.selectedSellerId = 0;
      user.selectedHideRevenue = true;
      user.selectedHideServiceFees = true;
      localStorage.clear();
      localStorage.setItem('currentUser', JSON.stringify(user));
      const now = new Date().getTime();
      const expires = new Date(now + (30 * 60 * 1000));
      Cookies.set('authToken', user.token || '', { expires: expires });
    }
    return response;
  };

  return { login };
};
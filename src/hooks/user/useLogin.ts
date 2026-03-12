import Cookies from 'js-cookie';

import { User, UserActivityType } from '@/types/user';

import { authService } from '../../services';
import { useLogActivityData } from '../common/useLogActivityData';

export const useLogin = () => {
  const { logActivityData } = useLogActivityData();
  const login = async (username: string, password: string) => {
    const response = await authService.login(username, password);
    if (response && response.user && response.user.isAuthenticated) {
      const user: User = { ...response.user };
      await logActivityData(UserActivityType.Login, undefined, user.token);
      localStorage.clear();
      localStorage.setItem('currentUser', JSON.stringify(user));
      const now = new Date().getTime();
      const expires = new Date(now + 24 * 60 * 60 * 1000);
      Cookies.set('authToken', user.token || '', { expires });
    }
    return response;
  };

  return { login };
};

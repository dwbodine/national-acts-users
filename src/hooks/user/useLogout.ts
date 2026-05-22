import Cookies from 'js-cookie';

export const useLogout = () => {
  const logout = (): Promise<boolean> => {
    let success = true;
    try {
      Cookies.remove('authToken');
      localStorage.clear();
    } catch {
      success = false;
    }
    return new Promise<boolean>((resolve) => {
      resolve(success);
    });
  };

  return { logout };
};

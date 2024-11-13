import Cookies from 'js-cookie';

export const useLogout = () => {
  const logout = async () => {
    let success = true;
    try {
      Cookies.remove('authToken');
      localStorage.clear();
    } catch (e) {
      console.log(e);
      success = false;
    }
    return success;
  };

  return { logout };
};

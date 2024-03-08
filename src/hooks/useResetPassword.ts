import { authService } from "../services";

export const useResetPassword = () => {
  const resetPassword = async (username: string, password: string, confirmPassword: string, code: number) => {
    const response = await authService.resetPassword(username, password, confirmPassword, code);
    return response;
  };

  return { resetPassword };
};
import { authService } from "../../services";

export const useResetPasswordSecure = () => {
  const resetPasswordSecure = async (username: string, password: string, confirmPassword: string) => {
    const response = await authService.resetPasswordSecure(username, password, confirmPassword);
    return response;
  };

  return { resetPasswordSecure };
};
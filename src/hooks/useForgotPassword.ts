import { authService } from "../services";

export const useForgotPassword = () => {
  const forgotPassword = async (username: string) => {
    const response = await authService.forgotPassword(username);
    return response;
  };

  return { forgotPassword };
};
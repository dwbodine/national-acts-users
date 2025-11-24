import { authService } from '../../services';

export const useForgotPassword = () => {
  const forgotPassword = async (username: string) =>
    await authService.forgotPassword(username);

  return { forgotPassword };
};

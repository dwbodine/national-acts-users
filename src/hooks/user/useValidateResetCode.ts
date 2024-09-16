import { authService } from "../../services";

export const useValidateResetCode = () => {
  const validateResetCode = async (username: string, code: number) => {
    const response = await authService.validateResetCode(username, code);
    return response;
  };

  return { validateResetCode };
};
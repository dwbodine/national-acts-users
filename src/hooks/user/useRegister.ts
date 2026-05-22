import { authService } from '../../services';

export const useRegister = () => {
  const register = async (
    username: string,
    firstName: string,
    lastName: string,
    sellerId: number,
    password: string,
    confirmPassword: string,
    notes?: string,
  ) => {
    const response = await authService.register(
      username,
      firstName,
      lastName,
      sellerId,
      password,
      confirmPassword,
      notes,
    );
    return response;
  };

  return { register };
};

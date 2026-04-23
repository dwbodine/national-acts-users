import { UserResponse } from '@/types/responses';

export type RegisterFormValues = {
  confirmPassword: string;
  firstName: string;
  lastName: string;
  notes?: string;
  password: string;
  sellerId: number;
  username: string;
};

export const REGISTER_SUCCESS_MESSAGE =
  'User registration succeeded, please wait for response from the administrator';
export const REGISTER_SELLERS_LOAD_ERROR = 'Unknown error occurred while fetching sellers';
export const REGISTER_SUBMIT_ERROR = 'Unknown error occurred during user registration';

export function validateRegisterForm(values: RegisterFormValues): string | undefined {
  if (!values.username) {
    return 'Username cannot be blank';
  }

  if (!values.firstName) {
    return 'First name cannot be blank';
  }

  if (!values.lastName) {
    return 'Last name cannot be blank';
  }

  if (!values.sellerId || values.sellerId <= 0) {
    return 'Must select an associated artist/venue';
  }

  if (!values.password) {
    return 'Password cannot be blank';
  }

  if (!values.confirmPassword) {
    return 'Confirm password cannot be blank';
  }

  if (values.password !== values.confirmPassword) {
    return 'Passwords do not match';
  }

  return undefined;
}

export function getRegisterResponseState(response: UserResponse): {
  error?: string;
  success?: string;
} {
  if (response.errorMessage) {
    return { error: response.errorMessage };
  }

  return { success: REGISTER_SUCCESS_MESSAGE };
}

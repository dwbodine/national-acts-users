import { ForgotPasswordMode } from '@/types/user';

export const FORGOT_PASSWORD_SEND_ERROR =
  'Unknown error during send of password reset email - please contact your administrator';
export const FORGOT_PASSWORD_VALIDATE_ERROR =
  'Unknown error while validating code - please contact your administrator';
export const FORGOT_PASSWORD_RESET_ERROR =
  'Unknown error while resetting password - please contact your administrator';
export const FORGOT_PASSWORD_RESET_SUCCESS =
  'Password changed successfully, redirecting to login...';

export function getForgotPasswordTitle(mode: ForgotPasswordMode): string {
  switch (mode) {
    case ForgotPasswordMode.ValidateResetCode:
      return 'Client Portal - Validate Reset Code';
    case ForgotPasswordMode.ResetPassword:
      return 'Client Portal - Reset Password';
    default:
      return 'Client Portal - Forgot Password';
  }
}

export function validateForgotPasswordUsername(username: string): string | undefined {
  if (!username) {
    return 'Username cannot be blank';
  }

  return undefined;
}

export function validateForgotPasswordCode(code: number): string | undefined {
  if (!code || isNaN(code)) {
    return 'Missing or invalid code';
  }

  return undefined;
}

export function validateForgotPasswordReset(
  password: string,
  confirmPassword: string,
): string | undefined {
  if (!password) {
    return 'Password is required';
  }

  if (!confirmPassword) {
    return 'Confirm password is required';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return undefined;
}

export function getForgotPasswordBackNavigation(mode: ForgotPasswordMode): {
  mode?: ForgotPasswordMode;
  route?: string;
} {
  if (mode === ForgotPasswordMode.ValidateResetCode) {
    return { mode: ForgotPasswordMode.SendPasswordReset };
  }

  if (mode === ForgotPasswordMode.ResetPassword) {
    return { mode: ForgotPasswordMode.ValidateResetCode };
  }

  return { route: '/login' };
}

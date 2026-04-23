import { UserLoginResponse } from '@/types/responses';

export const LOGIN_UNKNOWN_ERROR = 'Unknown error during login - please contact your administrator';

const LOGIN_WELCOME_BEGIN = new Date('2024-08-11').getTime();
const LOGIN_WELCOME_END = new Date('2024-08-18').getTime();

export function shouldShowLoginWelcome(now: number = Date.now()): boolean {
  return now >= LOGIN_WELCOME_BEGIN && now <= LOGIN_WELCOME_END;
}

export function validateLoginCredentials(name: string, password: string): string | undefined {
  if (!name || !password) {
    return 'Please enter username and password';
  }

  return undefined;
}

export function getLoginErrorMessage(response?: UserLoginResponse): string | undefined {
  if (response?.user?.isAuthenticated) {
    return undefined;
  }

  if (response?.error) {
    return response.error;
  }

  return LOGIN_UNKNOWN_ERROR;
}

export function getLoginRedirectPath(returnPath: string | null, isAdmin: boolean): string {
  if (returnPath) {
    return returnPath;
  }

  return isAdmin ? '/dashboard' : '/';
}

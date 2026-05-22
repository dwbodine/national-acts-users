import { describe, expect, it } from 'vitest';

import {
  getLoginErrorMessage,
  getLoginRedirectPath,
  LOGIN_UNKNOWN_ERROR,
  shouldShowLoginWelcome,
  validateLoginCredentials,
} from './loginComponent.helpers';

describe('loginComponent helpers', () => {
  it('shows the welcome banner only within the configured date window', () => {
    expect(shouldShowLoginWelcome(new Date('2024-08-12').getTime())).toBe(true);
    expect(shouldShowLoginWelcome(new Date('2024-08-25').getTime())).toBe(false);
  });

  it('validates that both login fields are present', () => {
    expect(validateLoginCredentials('', '')).toBe('Please enter username and password');
    expect(validateLoginCredentials('jane@example.com', 'secret123')).toBeUndefined();
  });

  it('derives login errors from the auth response', () => {
    expect(getLoginErrorMessage({ error: 'Invalid credentials' })).toBe('Invalid credentials');
    expect(getLoginErrorMessage(undefined)).toBe(LOGIN_UNKNOWN_ERROR);
  });

  it('computes the post-login redirect path', () => {
    expect(getLoginRedirectPath('/admin/users', false)).toBe('/admin/users');
    expect(getLoginRedirectPath(null, true)).toBe('/dashboard');
    expect(getLoginRedirectPath(null, false)).toBe('/');
  });
});

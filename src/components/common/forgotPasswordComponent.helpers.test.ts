import { describe, expect, it } from 'vitest';

import { ForgotPasswordMode } from '@/types/user';

import {
  getForgotPasswordBackNavigation,
  getForgotPasswordTitle,
  validateForgotPasswordCode,
  validateForgotPasswordReset,
  validateForgotPasswordUsername,
} from './forgotPasswordComponent.helpers';

describe('forgotPasswordComponent helpers', () => {
  it('returns the right title for each forgot-password mode', () => {
    expect(getForgotPasswordTitle(ForgotPasswordMode.SendPasswordReset)).toBe(
      'Client Portal - Forgot Password',
    );
    expect(getForgotPasswordTitle(ForgotPasswordMode.ValidateResetCode)).toBe(
      'Client Portal - Validate Reset Code',
    );
    expect(getForgotPasswordTitle(ForgotPasswordMode.ResetPassword)).toBe(
      'Client Portal - Reset Password',
    );
  });

  it('validates the forgot-password inputs', () => {
    expect(validateForgotPasswordUsername('')).toBe('Username cannot be blank');
    expect(validateForgotPasswordCode(0)).toBe('Missing or invalid code');
    expect(validateForgotPasswordReset('secret123', 'different123')).toBe('Passwords do not match');
    expect(validateForgotPasswordReset('secret123', 'secret123')).toBeUndefined();
  });

  it('returns the right back navigation for each mode', () => {
    expect(getForgotPasswordBackNavigation(ForgotPasswordMode.ValidateResetCode)).toEqual({
      mode: ForgotPasswordMode.SendPasswordReset,
    });
    expect(getForgotPasswordBackNavigation(ForgotPasswordMode.ResetPassword)).toEqual({
      mode: ForgotPasswordMode.ValidateResetCode,
    });
    expect(getForgotPasswordBackNavigation(ForgotPasswordMode.SendPasswordReset)).toEqual({
      route: '/login',
    });
  });
});

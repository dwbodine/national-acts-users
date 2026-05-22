import { describe, expect, it } from 'vitest';

import {
  getRegisterResponseState,
  REGISTER_SUCCESS_MESSAGE,
  validateRegisterForm,
} from './registerComponent.helpers';

describe('registerComponent helpers', () => {
  it('validates required registration fields in order', () => {
    expect(
      validateRegisterForm({
        confirmPassword: '',
        firstName: '',
        lastName: '',
        password: '',
        sellerId: 0,
        username: '',
      }),
    ).toBe('Username cannot be blank');
  });

  it('returns a password mismatch error when passwords differ', () => {
    expect(
      validateRegisterForm({
        confirmPassword: 'different123',
        firstName: 'Jane',
        lastName: 'Doe',
        password: 'secret123',
        sellerId: 12,
        username: 'jane@example.com',
      }),
    ).toBe('Passwords do not match');
  });

  it('accepts a valid registration payload', () => {
    expect(
      validateRegisterForm({
        confirmPassword: 'secret123',
        firstName: 'Jane',
        lastName: 'Doe',
        notes: 'VIP request',
        password: 'secret123',
        sellerId: 12,
        username: 'jane@example.com',
      }),
    ).toBeUndefined();
  });

  it('maps register responses into UI state', () => {
    expect(getRegisterResponseState({ errorMessage: 'Email already exists' })).toEqual({
      error: 'Email already exists',
    });
    expect(getRegisterResponseState({ success: true })).toEqual({
      success: REGISTER_SUCCESS_MESSAGE,
    });
  });
});

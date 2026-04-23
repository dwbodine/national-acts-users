import { describe, expect, it, vi } from 'vitest';

const cookiesMock = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock('js-cookie', () => ({
  default: cookiesMock,
}));

import getAuthorizationHeader from './getAuthorizationHeader';

describe('getAuthorizationHeader', () => {
  it('prefers the explicit token when provided', () => {
    const headers = getAuthorizationHeader('manual-token');
    const authorizationHeader = headers.get('Authorization');
    const contentTypeHeader = headers.get('Content-Type');

    expect(authorizationHeader).toBe('Bearer manual-token');
    expect(contentTypeHeader).toBe('application/json');
  });

  it('falls back to the auth cookie when no token is passed', () => {
    cookiesMock.get.mockReturnValue('cookie-token');

    const headers = getAuthorizationHeader();
    const authorizationHeader = headers.get('Authorization');

    expect(cookiesMock.get).toHaveBeenCalledWith('authToken');
    expect(authorizationHeader).toBe('Bearer cookie-token');
  });
});

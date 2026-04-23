import { beforeEach, describe, expect, it, vi } from 'vitest';

import getAuthorizationHeader from '@/utils/getAuthorizationHeader';

const authServiceMocks = vi.hoisted(() => ({
  create: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    create: authServiceMocks.create,
  },
}));

vi.mock('@/utils/getAuthorizationHeader', () => ({
  default: vi.fn(),
}));

import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    authServiceMocks.create.mockReturnValue({
      get: authServiceMocks.get,
      post: authServiceMocks.post,
    });

    process.env['NEXT_PUBLIC_USER_API_KEY'] = 'test-api-key';
    vi.mocked(getAuthorizationHeader).mockReturnValue({
      Authorization: 'Bearer test-token',
      'Content-Type': 'application/json',
    } as never);
  });

  it('submits register requests with the expected payload and headers', async () => {
    authServiceMocks.post.mockResolvedValueOnce({
      data: { success: true },
    });

    const service = new AuthService('https://service.example.com');
    const response = await service.register(
      'jane@example.com',
      'Jane',
      'Doe',
      12,
      'secret123',
      'secret123',
      'VIP notes',
    );

    expect(authServiceMocks.create).toHaveBeenCalledWith({
      baseURL: 'https://service.example.com',
      timeout: 30000,
      timeoutErrorMessage: 'Time out!',
    });
    expect(authServiceMocks.post).toHaveBeenCalledWith(
      '/user/register',
      {
        confirmPassword: 'secret123',
        firstName: 'Jane',
        lastName: 'Doe',
        notes: 'VIP notes',
        password: 'secret123',
        sellerId: 12,
        username: 'jane@example.com',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'test-api-key',
        },
      },
    );
    expect(response).toEqual({ success: true });
  });

  it('returns login errors using the API message when present', async () => {
    authServiceMocks.post.mockRejectedValueOnce({
      message: 'Request failed with status code 401',
      response: {
        data: {
          msg: 'Invalid username or password',
        },
        status: 401,
      },
    });

    const service = new AuthService('https://service.example.com');
    const response = await service.login('jane@example.com', 'bad-password');

    expect(authServiceMocks.post).toHaveBeenCalledWith(
      '/user/login',
      {
        password: 'bad-password',
        username: 'jane@example.com',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'test-api-key',
        },
      },
    );
    expect(response).toEqual({
      error: 'Invalid username or password',
      statusCode: 401,
    });
  });

  it('uses the authorization helper when fetching logs', async () => {
    authServiceMocks.get.mockResolvedValueOnce({
      data: 'job finished',
      status: 200,
    });

    const service = new AuthService('https://service.example.com');
    const response = await service.getLogs();

    expect(getAuthorizationHeader).toHaveBeenCalledTimes(1);
    expect(authServiceMocks.get).toHaveBeenCalledWith('/log', {
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      },
    });
    expect(response).toEqual({
      logs: 'job finished',
      statusCode: 200,
    });
  });

  it('returns status and error details when secure password reset fails', async () => {
    authServiceMocks.post.mockRejectedValueOnce({
      message: 'Request failed with status code 403',
      response: {
        status: 403,
      },
    });

    const service = new AuthService('https://service.example.com');
    const response = await service.resetPasswordSecure(
      'jane@example.com',
      'secret123',
      'secret123',
    );

    expect(getAuthorizationHeader).toHaveBeenCalledTimes(1);
    expect(authServiceMocks.post).toHaveBeenCalledWith(
      '/user/resetPasswordSecured',
      {
        confirmPassword: 'secret123',
        password: 'secret123',
        username: 'jane@example.com',
      },
      {
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        },
      },
    );
    expect(response).toEqual({
      error: 'Request failed with status code 403',
      statusCode: 403,
    });
  });
});

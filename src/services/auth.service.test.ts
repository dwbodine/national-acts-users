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

const createService = () => new AuthService('https://service.example.com');

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

  it('configures the axios instance and handles log retrieval branches', async () => {
    authServiceMocks.get
      .mockResolvedValueOnce({
        data: 'job finished',
        status: 200,
      })
      .mockResolvedValueOnce({
        data: undefined,
        status: 200,
      })
      .mockRejectedValueOnce({
        response: {
          status: 503,
        },
      })
      .mockRejectedValueOnce({
        message: 'cron unavailable',
        response: {
          status: 500,
        },
      });

    const service = createService();

    expect(authServiceMocks.create).toHaveBeenCalledWith({
      baseURL: 'https://service.example.com',
      timeout: 30000,
      timeoutErrorMessage: 'Time out!',
    });

    await expect(service.getLogs()).resolves.toEqual({
      logs: 'job finished',
      statusCode: 200,
    });
    await expect(service.getCronLogs()).resolves.toEqual({
      logs: undefined,
      statusCode: 200,
    });
    await expect(service.getLogs()).resolves.toEqual({
      error: 'Unknown error while fetching logs - please contact your administrator',
      statusCode: 503,
    });
    await expect(service.getCronLogs()).resolves.toEqual({
      error: 'cron unavailable',
      statusCode: 500,
    });

    expect(getAuthorizationHeader).toHaveBeenCalledTimes(4);
    expect(authServiceMocks.get).toHaveBeenNthCalledWith(1, '/log', {
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      },
    });
    expect(authServiceMocks.get).toHaveBeenNthCalledWith(2, '/cron_log', {
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      },
    });
  });

  it('handles login success and both login error message fallbacks', async () => {
    authServiceMocks.post
      .mockResolvedValueOnce({
        data: { userId: 10 },
        status: 200,
      })
      .mockRejectedValueOnce({
        message: 'Request failed with status code 401',
        response: {
          data: {
            msg: 'Invalid username or password',
          },
          status: 401,
        },
      })
      .mockRejectedValueOnce({
        response: {
          status: 500,
        },
      });

    const service = createService();

    await expect(service.login('jane@example.com', 'secret123')).resolves.toEqual({
      statusCode: 200,
      success: true,
      user: { userId: 10 },
    });
    await expect(service.login('jane@example.com', 'bad-password')).resolves.toEqual({
      error: 'Invalid username or password',
      statusCode: 401,
    });
    await expect(service.login('jane@example.com', 'missing-message')).resolves.toEqual({
      error: 'Unknown error during login - please contact your administrator',
      statusCode: 500,
    });

    expect(authServiceMocks.post).toHaveBeenNthCalledWith(
      1,
      '/user/login',
      {
        password: 'secret123',
        username: 'jane@example.com',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'test-api-key',
        },
      },
    );
  });

  it('covers secure password reset request branches', async () => {
    authServiceMocks.post
      .mockResolvedValueOnce({
        data: { success: true },
      })
      .mockResolvedValueOnce({
        data: undefined,
      })
      .mockRejectedValueOnce({
        response: {
          status: 403,
        },
      })
      .mockRejectedValueOnce({
        message: 'reset failed',
        response: {
          status: 403,
        },
      });

    const service = createService();

    await expect(
      service.resetPasswordSecure('jane@example.com', 'secret123', 'secret123'),
    ).resolves.toEqual({ success: true });
    await expect(
      service.resetPasswordSecure('jane@example.com', 'secret123', 'secret123'),
    ).resolves.toEqual({});
    await expect(
      service.resetPasswordSecure('jane@example.com', 'secret123', 'secret123'),
    ).resolves.toEqual({
      error: 'Unknown error while resetting password - please contact your administrator',
      statusCode: 403,
    });
    await expect(
      service.resetPasswordSecure('jane@example.com', 'secret123', 'secret123'),
    ).resolves.toEqual({
      error: 'reset failed',
      statusCode: 403,
    });
  });

  it('covers forgot-password, reset-code validation, password reset, and registration branches', async () => {
    authServiceMocks.post
      .mockResolvedValueOnce({ data: { success: true } })
      .mockResolvedValueOnce({ data: undefined })
      .mockRejectedValueOnce({ response: { status: 502 } })
      .mockRejectedValueOnce({ message: 'reset email failed', response: { status: 502 } })
      .mockResolvedValueOnce({ data: { success: true } })
      .mockResolvedValueOnce({ data: undefined })
      .mockRejectedValueOnce({ response: { status: 400 } })
      .mockRejectedValueOnce({ message: 'bad code', response: { status: 400 } })
      .mockResolvedValueOnce({ data: { success: true } })
      .mockResolvedValueOnce({ data: undefined })
      .mockRejectedValueOnce({ response: { status: 422 } })
      .mockRejectedValueOnce({ message: 'reset denied', response: { status: 422 } })
      .mockResolvedValueOnce({ data: { success: true } })
      .mockResolvedValueOnce({ data: undefined })
      .mockRejectedValueOnce({ response: { status: 409 } })
      .mockRejectedValueOnce({ message: 'register failed', response: { status: 409 } });

    const service = createService();

    await expect(service.forgotPassword('jane@example.com')).resolves.toEqual({ success: true });
    await expect(service.forgotPassword('jane@example.com')).resolves.toEqual({});
    await expect(service.forgotPassword('jane@example.com')).resolves.toEqual({
      error:
        'Unknown error during send of password reset email - please contact your administrator',
      statusCode: 502,
    });
    await expect(service.forgotPassword('jane@example.com')).resolves.toEqual({
      error: 'reset email failed',
      statusCode: 502,
    });

    await expect(service.validateResetCode('jane@example.com', 123456)).resolves.toEqual({
      success: true,
    });
    await expect(service.validateResetCode('jane@example.com', 123456)).resolves.toEqual({});
    await expect(service.validateResetCode('jane@example.com', 123456)).resolves.toEqual({
      error: 'Unknown error while validating reset code - please contact your administrator',
      statusCode: 400,
    });
    await expect(service.validateResetCode('jane@example.com', 123456)).resolves.toEqual({
      error: 'bad code',
      statusCode: 400,
    });

    await expect(
      service.resetPassword('jane@example.com', 'secret123', 'secret123', 123456),
    ).resolves.toEqual({ success: true });
    await expect(
      service.resetPassword('jane@example.com', 'secret123', 'secret123', 123456),
    ).resolves.toEqual({});
    await expect(
      service.resetPassword('jane@example.com', 'secret123', 'secret123', 123456),
    ).resolves.toEqual({
      error: 'Unknown error while resetting password - please contact your administrator',
      statusCode: 422,
    });
    await expect(
      service.resetPassword('jane@example.com', 'secret123', 'secret123', 123456),
    ).resolves.toEqual({
      error: 'reset denied',
      statusCode: 422,
    });

    await expect(
      service.register(
        'jane@example.com',
        'Jane',
        'Doe',
        12,
        'secret123',
        'secret123',
        'VIP notes',
      ),
    ).resolves.toEqual({ success: true });
    await expect(
      service.register(
        'jane@example.com',
        'Jane',
        'Doe',
        12,
        'secret123',
        'secret123',
        'VIP notes',
      ),
    ).resolves.toEqual({});
    await expect(
      service.register(
        'jane@example.com',
        'Jane',
        'Doe',
        12,
        'secret123',
        'secret123',
        'VIP notes',
      ),
    ).resolves.toEqual({
      error: 'Unknown error while registering user - please contact your administrator',
      statusCode: 409,
    });
    await expect(
      service.register(
        'jane@example.com',
        'Jane',
        'Doe',
        12,
        'secret123',
        'secret123',
        'VIP notes',
      ),
    ).resolves.toEqual({
      error: 'register failed',
      statusCode: 409,
    });
  });
});

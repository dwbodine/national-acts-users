import { beforeEach, describe, expect, it, vi } from 'vitest';

import getAuthorizationHeader from '@/utils/getAuthorizationHeader';

const userServiceMocks = vi.hoisted(() => ({
  create: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    create: userServiceMocks.create,
  },
}));

vi.mock('@/utils/getAuthorizationHeader', () => ({
  default: vi.fn(),
}));

import { UserService } from './user.service';

const createService = () => new UserService('https://user.example.com');

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    userServiceMocks.create.mockReturnValue({
      get: userServiceMocks.get,
      post: userServiceMocks.post,
    });
    vi.mocked(getAuthorizationHeader).mockReturnValue({
      Authorization: 'Bearer test-token',
      'Content-Type': 'application/json',
    } as never);
  });

  it('loads user data endpoints and supports empty activity lists', async () => {
    userServiceMocks.get
      .mockResolvedValueOnce({ data: [{ userId: 1 }], status: 200 })
      .mockResolvedValueOnce({ data: [{ roleId: 2 }], status: 200 })
      .mockResolvedValueOnce({ data: [{ permissionId: 3 }], status: 200 })
      .mockResolvedValueOnce({ data: { sellerId: 4 }, status: 200 });
    userServiceMocks.post
      .mockResolvedValueOnce({ data: { ok: true }, status: 200 })
      .mockResolvedValueOnce({ data: { ok: true }, status: 200 })
      .mockResolvedValueOnce({ data: { ok: true }, status: 200 })
      .mockResolvedValueOnce({ data: { ok: true }, status: 200 })
      .mockResolvedValueOnce({ data: { ok: true }, status: 200 })
      .mockResolvedValueOnce({ data: [{ id: 10 }], status: 200 })
      .mockResolvedValueOnce({ data: undefined, status: 200 });

    const service = createService();

    await expect(service.getUsers()).resolves.toEqual({
      statusCode: 200,
      users: [{ userId: 1 }],
    });
    await expect(service.getRoles()).resolves.toEqual({
      roles: [{ roleId: 2 }],
      statusCode: 200,
    });
    await expect(service.getPermissions()).resolves.toEqual({
      permissions: [{ permissionId: 3 }],
      statusCode: 200,
    });
    await expect(service.getUserSellerFromEventId(9, 8)).resolves.toEqual({
      statusCode: 200,
      userSeller: { sellerId: 4 },
    });
    await expect(service.updateRole({ roleId: 1 } as never)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.deleteRoles([1, 2])).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.updateUser({ userId: 3 } as never)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.deleteUser(5)).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(
      service.logUserActivity('LOGIN' as never, 'from test', 'custom-token'),
    ).resolves.toEqual({
      statusCode: 200,
      success: true,
    });
    await expect(service.getUserActivity(1, 2, 3, 'LOGIN' as never, true)).resolves.toEqual({
      activities: [{ id: 10 }],
      statusCode: 200,
      success: true,
    });
    await expect(service.getUserActivity(1, 2)).resolves.toEqual({
      activities: [],
      statusCode: 200,
      success: true,
    });

    expect(getAuthorizationHeader).toHaveBeenCalledWith('custom-token');
    expect(userServiceMocks.post).toHaveBeenNthCalledWith(
      6,
      '/dashboard/getUserActivity',
      {
        activityType: 'LOGIN',
        end: 2,
        filterAdmins: '1',
        start: 1,
        userId: 3,
      },
      {
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        },
      },
    );
    expect(userServiceMocks.post).toHaveBeenNthCalledWith(
      7,
      '/dashboard/getUserActivity',
      {
        activityType: undefined,
        end: 2,
        filterAdmins: undefined,
        start: 1,
        userId: undefined,
      },
      {
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        },
      },
    );
  });

  it('returns user-service errors and falsey update responses', async () => {
    userServiceMocks.get
      .mockRejectedValueOnce({ response: { status: 500 } })
      .mockRejectedValueOnce({ message: 'roles failed', response: { status: 503 } })
      .mockRejectedValueOnce({ response: { status: 401 } })
      .mockRejectedValueOnce({ message: 'seller lookup failed', response: { status: 404 } });
    userServiceMocks.post
      .mockResolvedValueOnce({ data: undefined, status: 200 })
      .mockResolvedValueOnce({ data: undefined, status: 200 })
      .mockResolvedValueOnce({ data: undefined, status: 200 })
      .mockResolvedValueOnce({ data: undefined, status: 200 })
      .mockResolvedValueOnce({ data: undefined, status: 200 })
      .mockRejectedValueOnce({ response: { status: 422 } })
      .mockRejectedValueOnce({ message: 'activity failed', response: { status: 400 } })
      .mockRejectedValueOnce({ response: { status: 409 } })
      .mockRejectedValueOnce({ message: 'delete user failed', response: { status: 410 } })
      .mockRejectedValueOnce({ response: { status: 411 } })
      .mockRejectedValueOnce({ response: { status: 500 } })
      .mockRejectedValueOnce({ message: 'activity lookup failed', response: { status: 502 } });

    const service = createService();

    await expect(service.getUsers()).resolves.toEqual({
      error: 'Unknown error while fetching users - please contact your administrator',
      statusCode: 500,
    });
    await expect(service.getRoles()).resolves.toEqual({
      error: 'roles failed',
      statusCode: 503,
    });
    await expect(service.getPermissions()).resolves.toEqual({
      error: 'Unknown error while fetching permissions - please contact your administrator',
      statusCode: 401,
    });
    await expect(service.getUserSellerFromEventId(9, 8)).resolves.toEqual({
      error: 'seller lookup failed',
      statusCode: 404,
    });

    await expect(service.updateRole({ roleId: 1 } as never)).resolves.toEqual({
      statusCode: 200,
      success: false,
    });
    await expect(service.deleteRoles([1])).resolves.toEqual({
      statusCode: 200,
      success: false,
    });
    await expect(service.updateUser({ userId: 1 } as never)).resolves.toEqual({
      statusCode: 200,
      success: false,
    });
    await expect(service.deleteUser(1)).resolves.toEqual({
      statusCode: 200,
      success: false,
    });
    await expect(service.logUserActivity('LOGIN' as never)).resolves.toEqual({
      statusCode: 200,
      success: false,
    });

    await expect(service.updateRole({ roleId: 2 } as never)).resolves.toEqual({
      error: 'Unknown error while updating role - please contact your administrator',
      statusCode: 422,
    });
    await expect(service.deleteRoles([2])).resolves.toEqual({
      error: 'activity failed',
      statusCode: 400,
    });
    await expect(service.updateUser({ userId: 2 } as never)).resolves.toEqual({
      error: 'Unknown error while updating user - please contact your administrator',
      statusCode: 409,
    });
    await expect(service.deleteUser(2)).resolves.toEqual({
      error: 'delete user failed',
      statusCode: 410,
    });
    await expect(service.logUserActivity('LOGOUT' as never)).resolves.toEqual({
      error: 'Unknown error while logging activity data - please contact your administrator',
      statusCode: 411,
    });
    await expect(service.getUserActivity(1, 2)).resolves.toEqual({
      error: 'Unknown error while fetching activity data - please contact your administrator',
      statusCode: 500,
    });
    await expect(service.getUserActivity(1, 2)).resolves.toEqual({
      error: 'activity lookup failed',
      statusCode: 502,
    });
  });
});

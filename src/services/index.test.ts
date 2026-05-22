import { beforeEach, describe, expect, it, vi } from 'vitest';

const constructorMocks = vi.hoisted(() => ({
  admin: vi.fn(),
  auth: vi.fn(),
  event: vi.fn(),
  publicService: vi.fn(),
  user: vi.fn(),
}));

vi.mock('./admin.service', () => ({
  AdminService: constructorMocks.admin,
}));

vi.mock('./auth.service', () => ({
  AuthService: constructorMocks.auth,
}));

vi.mock('./event.service', () => ({
  EventService: constructorMocks.event,
}));

vi.mock('./public.service', () => ({
  PublicService: constructorMocks.publicService,
}));

vi.mock('./user.service', () => ({
  UserService: constructorMocks.user,
}));

describe('services/index', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env['NEXT_PUBLIC_SERVICE_URL'] = 'https://services.example.com';
    constructorMocks.auth.mockImplementation(function (this: unknown, url: string) {
      return { kind: 'auth', url };
    });
    constructorMocks.event.mockImplementation(function (this: unknown, url: string) {
      return { kind: 'event', url };
    });
    constructorMocks.publicService.mockImplementation(function (this: unknown, url: string) {
      return { kind: 'public', url };
    });
    constructorMocks.user.mockImplementation(function (this: unknown, url: string) {
      return { kind: 'user', url };
    });
    constructorMocks.admin.mockImplementation(function (this: unknown, url: string) {
      return { kind: 'admin', url };
    });
  });

  it('instantiates singleton services with the configured base URL', async () => {
    const services = await import('./index');

    expect(constructorMocks.auth).toHaveBeenCalledWith('https://services.example.com');
    expect(constructorMocks.event).toHaveBeenCalledWith('https://services.example.com');
    expect(constructorMocks.publicService).toHaveBeenCalledWith('https://services.example.com');
    expect(constructorMocks.user).toHaveBeenCalledWith('https://services.example.com');
    expect(constructorMocks.admin).toHaveBeenCalledWith('https://services.example.com');
    expect(services.authService).toEqual({ kind: 'auth', url: 'https://services.example.com' });
    expect(services.eventService).toEqual({ kind: 'event', url: 'https://services.example.com' });
    expect(services.publicService).toEqual({ kind: 'public', url: 'https://services.example.com' });
    expect(services.userService).toEqual({ kind: 'user', url: 'https://services.example.com' });
    expect(services.adminService).toEqual({ kind: 'admin', url: 'https://services.example.com' });
  });
});

import { describe, expect, it } from 'vitest';

import { SellerType } from '@/types/event';
import type { User } from '@/types/user';

import {
  addSellerToUser,
  buildUserUpdatePayload,
  getAdminUserFormValues,
  hasInvalidSellerAssignments,
  removeSellerFromUser,
  updateUserRoleAssignment,
  updateUserSellerAssignment,
  validateAdminUserSubmission,
} from './adminUserEdit.helpers';

const buildUser = (overrides: Partial<User> = {}): User => ({
  disableCheckIn: false,
  firstName: 'Jane',
  isActive: true,
  isAdmin: false,
  lastName: 'Doe',
  mobile: '555-1111',
  notes: 'Original notes',
  requireResetPassword: true,
  sellers: [
    {
      roleId: 2,
      sellerId: 12,
      sellerName: 'Red Rocks',
      sellerType: SellerType.Artist,
    },
  ],
  sendEmailReset: false,
  sendTextReset: false,
  userId: 7,
  username: 'jane@example.com',
  ...overrides,
});

describe('adminUserEdit helpers', () => {
  it('creates editable form values from the selected user', () => {
    expect(getAdminUserFormValues(buildUser())).toEqual({
      disableCheckIn: false,
      firstName: 'Jane',
      isActive: true,
      lastName: 'Doe',
      mobile: '555-1111',
      notes: 'Original notes',
      password: undefined,
      requireResetPassword: true,
      sendEmailReset: false,
      sendTextReset: false,
      userId: 7,
      username: 'jane@example.com',
      editPassword: false,
    });
  });

  it('marks form values as password-editable when requested', () => {
    expect(getAdminUserFormValues(buildUser(), true)).toEqual(
      expect.objectContaining({
        editPassword: true,
        userId: 7,
      }),
    );
  });

  it('updates seller assignments using the selected seller details', () => {
    const updatedUser = updateUserSellerAssignment(
      buildUser(),
      [{ name: 'MSG', sellerId: 13, sellerType: SellerType.Venue }],
      12,
      13,
    );

    expect(updatedUser?.sellers?.[0]).toEqual({
      roleId: 2,
      sellerId: 13,
      sellerName: 'MSG',
      sellerType: SellerType.Venue,
    });
  });

  it('updates seller roles for an existing seller assignment', () => {
    const updatedUser = updateUserRoleAssignment(
      buildUser(),
      [{ roleId: 3, roleName: 'Manager' }],
      12,
      3,
    );

    expect(updatedUser?.sellers?.[0]?.roleId).toBe(3);
  });

  it('adds and removes temporary seller rows', () => {
    const addedUser = addSellerToUser(buildUser());
    expect(addedUser?.sellers).toHaveLength(2);
    expect(addedUser?.sellers?.[1]).toEqual({
      sellerId: 0,
      sellerName: '',
      sellerType: SellerType.Artist,
    });

    expect(removeSellerFromUser(buildUser(), 12).sellers).toEqual([]);
  });

  it('validates duplicate usernames and invalid seller assignments', () => {
    expect(
      validateAdminUserSubmission(buildUser(), [buildUser({ userId: 99 })], {
        disableCheckIn: false,
        firstName: 'Jane',
        isActive: true,
        lastName: 'Doe',
        mobile: '',
        notes: '',
        password: undefined,
        requireResetPassword: true,
        sendEmailReset: false,
        sendTextReset: false,
        username: 'jane@example.com',
        editPassword: false,
      }),
    ).toBe('Username already exists, please choose another');

    expect(
      hasInvalidSellerAssignments(
        buildUser({
          sellers: [{ sellerId: 0, sellerName: '', sellerType: SellerType.Artist }],
        }),
      ),
    ).toBe(true);
  });

  it('builds a submission payload without forcing false booleans to true', () => {
    const newUser = buildUser({
      isActive: true,
      requireResetPassword: true,
      userId: 0,
      username: '',
    });
    const payload = buildUserUpdatePayload(newUser, {
      disableCheckIn: true,
      firstName: 'Janet',
      isActive: false,
      lastName: 'Smith',
      mobile: '',
      notes: '',
      password: 'secret123',
      requireResetPassword: false,
      sendEmailReset: true,
      sendTextReset: true,
      username: 'janet@example.com',
      editPassword: true,
    });

    expect(payload).toEqual(
      expect.objectContaining({
        disableCheckIn: true,
        firstName: 'Janet',
        isActive: false,
        lastName: 'Smith',
        password: 'secret123',
        requireResetPassword: false,
        sendEmailReset: true,
        sendTextReset: true,
        username: 'janet@example.com',
      }),
    );
  });

  it('does not require or submit a password unless password editing is enabled', () => {
    const selectedUser = buildUser({ userId: 7 });
    const values = {
      disableCheckIn: false,
      firstName: 'Jane',
      isActive: true,
      lastName: 'Doe',
      mobile: '',
      notes: '',
      password: undefined,
      requireResetPassword: true,
      sendEmailReset: false,
      sendTextReset: false,
      username: 'jane@example.com',
      editPassword: false,
    };

    expect(validateAdminUserSubmission(selectedUser, [selectedUser], values)).toBeUndefined();
    expect(buildUserUpdatePayload(selectedUser, values)).not.toHaveProperty('password');

    expect(
      validateAdminUserSubmission(selectedUser, [selectedUser], {
        ...values,
        editPassword: true,
      }),
    ).toBe('Password cannot be blank');
  });
});

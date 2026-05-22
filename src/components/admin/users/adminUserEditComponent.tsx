'use client';

import { useRouter } from 'next/navigation';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Checkbox, Input } from 'rsuite';

import PageHeader from '@/components/common/PageHeaderComponent';
import Textarea from '@/components/common/Textarea';
import { useDeleteUser } from '@/hooks/admin/useDeleteUser';
import { useGetAllCountries } from '@/hooks/admin/useGetAllCountries';
import { useGetAllRoles } from '@/hooks/admin/useGetAllRoles';
import { useUpdateUser } from '@/hooks/admin/useUpdateUser';
import { useGetSellers } from '@/hooks/common/useGetSellers';
import {
  setCountries,
  setReloadCountries,
  setReloadUsers,
  setSelectedUser,
} from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { Seller } from '@/types/event';
import {
  GetCountriesResponse,
  GetRolesResponse,
  GetSellersResponse,
  UpdateUserResponse,
} from '@/types/responses';
import { Role } from '@/types/user';

import ConfirmationDialog from '../../common/confirmationDialogComponent';
import AdminSellerSelect from '../common/adminSellerSelectComponent';
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

export default function AdminUserEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getSellers } = useGetSellers();
  const { getAllRoles } = useGetAllRoles();
  const { updateUser } = useUpdateUser();
  const { deleteUser } = useDeleteUser();
  const { getAllCountries } = useGetAllCountries();
  const [allSellers, setAllSellers] = useState<Seller[] | undefined>(undefined);
  const [allRoles, setAllRoles] = useState<Role[] | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>('');
  const [password, setPassword] = useState<string | undefined>('');
  const [editPassword, setEditPassword] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string | undefined>('');
  const [lastName, setLastName] = useState<string | undefined>('');
  const [mobile, setMobile] = useState<string | undefined>('');
  const [notes, setNotes] = useState<string | undefined>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [requireResetPassword, setRequireResetPassword] = useState<boolean>(false);
  const [sendEmailReset, setSendEmailReset] = useState<boolean>(false);
  const [sendTextReset, setSendTextReset] = useState<boolean>(false);
  const [disableCheckIn, setDisableCheckIn] = useState<boolean>(false);
  const router = useRouter();

  const goBack = useCallback(() => {
    router.push('/admin/users');
  }, [router]);

  useEffect(() => {
    if (currentAdminSelection.selectedUser === undefined) {
      goBack();
    } else if (currentAdminSelection.reloadCountries) {
      dispatch(setReloadCountries(false));
      dispatch(setIsLoading(true));
      void getAllCountries().then((response: GetCountriesResponse) => {
        if (response.countries && !response.error) {
          dispatch(setCountries(response.countries));
        } else {
          toast.error(response.error);
          dispatch(setIsLoading(false));
        }
      });
    } else if (username === undefined || allSellers === undefined || allRoles === undefined) {
      dispatch(setIsLoading(true));
      const isNewUser =
        !currentAdminSelection.selectedUser.userId ||
        currentAdminSelection.selectedUser.userId <= 0;
      const nextValues = getAdminUserFormValues(currentAdminSelection.selectedUser, isNewUser);
      setUsername(nextValues.username);
      setPassword(nextValues.password);
      setFirstName(nextValues.firstName);
      setLastName(nextValues.lastName);
      setMobile(nextValues.mobile);
      setNotes(nextValues.notes);
      setIsActive(nextValues.isActive);
      setRequireResetPassword(nextValues.requireResetPassword);
      setSendEmailReset(nextValues.sendEmailReset);
      setSendTextReset(nextValues.sendTextReset);
      setDisableCheckIn(nextValues.disableCheckIn);
      setEditPassword(nextValues.editPassword);
      void getSellers().then((response: GetSellersResponse) => {
        setAllSellers(response.sellers);
        void getAllRoles().then((resp: GetRolesResponse) => {
          const roles = resp.roles?.filter((x) => x.roleId !== 1);
          setAllRoles(roles);
          dispatch(setIsLoading(false));
        });
      });
    }
  }, [
    currentAdminSelection,
    username,
    allSellers,
    getSellers,
    allRoles,
    getAllRoles,
    dispatch,
    goBack,
  ]);

  const updateSeller = (sellerId: number, newSellerId: number | null) => {
    if (currentAdminSelection.selectedUser) {
      const updatedUser = updateUserSellerAssignment(
        currentAdminSelection.selectedUser,
        allSellers,
        sellerId,
        newSellerId,
      );

      if (updatedUser) {
        dispatch(setSelectedUser(updatedUser));
      }
    } else {
      goBack();
    }
  };

  const updateRole = (sellerId: number, newRoleId: number | null) => {
    if (currentAdminSelection.selectedUser) {
      const updatedUser = updateUserRoleAssignment(
        currentAdminSelection.selectedUser,
        allRoles,
        sellerId,
        newRoleId,
      );

      if (updatedUser) {
        dispatch(setSelectedUser(updatedUser));
      }
    } else {
      goBack();
    }
  };

  const addSeller = () => {
    if (currentAdminSelection.selectedUser) {
      const updatedUser = addSellerToUser(currentAdminSelection.selectedUser);
      if (updatedUser) {
        dispatch(setSelectedUser(updatedUser));
      }
    } else {
      goBack();
    }
  };

  const removeSeller = (sId: number) => {
    if (currentAdminSelection.selectedUser) {
      dispatch(setSelectedUser(removeSellerFromUser(currentAdminSelection.selectedUser, sId)));
    } else {
      goBack();
    }
  };

  const deleteCurrentUser = () => {
    if (!currentAdminSelection.selectedUser) {
      return;
    }

    const { userId } = currentAdminSelection.selectedUser;

    void deleteUser(userId).then((response: UpdateUserResponse) => {
      if (response.success) {
        dispatch(setReloadUsers(true));
        toast.success('User deleted successfully');
        router.push('/admin/users');
      } else {
        toast.error(response.error);
      }
    });
  };

  const confirmDeleteUser = () => {
    if (!currentAdminSelection.selectedUser) {
      return;
    }

    const message: string = 'Are you sure you want to delete this user?';
    toast.warning(
      <ConfirmationDialog
        Message={message}
        ConfirmText="Yes"
        CancelText="No"
        OnConfirm={deleteCurrentUser}
        OnCancel={() => {
          toast.dismiss();
        }}
      />,
      {
        autoClose: false,
        closeOnClick: true,
        position: 'top-center',
      },
    );
  };

  const onSubmit = () => {
    const { users, selectedUser } = currentAdminSelection;

    if (!selectedUser) {
      return;
    }

    const formValues = {
      disableCheckIn,
      firstName,
      isActive,
      lastName,
      mobile,
      notes,
      password,
      requireResetPassword,
      sendEmailReset,
      sendTextReset,
      username,
      editPassword,
    };

    const validationError = validateAdminUserSubmission(selectedUser, users, formValues);
    if (validationError) {
      toast.warn(validationError);
      return;
    }

    const userToUpdate = buildUserUpdatePayload(selectedUser, formValues);
    if (hasInvalidSellerAssignments(userToUpdate)) {
      toast.warning('Seller selection invalid, please correct before submitting');
      return;
    }

    dispatch(setIsLoading(true));
    void updateUser(userToUpdate).then((response: UpdateUserResponse) => {
      if (response.success) {
        dispatch(setReloadUsers(true));
        toast.success('User updated successfully');
        router.push('/admin/users');
      } else {
        toast.error(response.error ?? 'Error occurred while saving user');
      }
      dispatch(setIsLoading(false));
    });
  };

  const sellerRows: ReactElement[] = [];
  if (
    allSellers !== undefined &&
    allRoles !== undefined &&
    currentAdminSelection.selectedUser &&
    !currentAdminSelection.selectedUser.isAdmin
  ) {
    if (
      currentAdminSelection.selectedUser.sellers &&
      currentAdminSelection.selectedUser.sellers.length > 0
    ) {
      currentAdminSelection.selectedUser.sellers.forEach((item, index) => {
        sellerRows.push(
          <AdminSellerSelect
            Id={item.sellerId.toString()}
            key={item.sellerId}
            Number={index + 1}
            Sellers={allSellers}
            Roles={allRoles}
            SellerId={item.sellerId}
            RoleId={item.roleId}
            OnSellerChange={(newSellerId: number | null) =>
              updateSeller(parseInt(`${item.sellerId}`), newSellerId)
            }
            OnRoleChange={(newRoleId: number | null) =>
              updateRole(parseInt(`${item.sellerId}`), newRoleId)
            }
            OnDelete={() => removeSeller(parseInt(`${item.sellerId}`))}
            Countries={currentAdminSelection.countries}
          />,
        );
      });
    }
    sellerRows.push(
      <div title="Add Seller" key="addSeller" className="admin-click-cell" onClick={addSeller}>
        <FaPlus></FaPlus> Add Seller
      </div>,
    );
  }

  return currentAdminSelection.selectedUser &&
    (sellerRows !== null || currentAdminSelection.selectedUser.isAdmin) ? (
    <>
      <PageHeader pageTitle="Edit User" />
      <div className="admin-container">
        <div className="admin-user-row">
          <span>Username:</span>
          <span hidden={currentAdminSelection.selectedUser.userId <= 0}>&nbsp;{username}</span>
          <Input
            hidden={currentAdminSelection.selectedUser.userId > 0}
            value={username ?? ''}
            type="email"
            onChange={setUsername}
            className="form-control-half"
            placeholder="Username (must be email)"
          />
        </div>
        <div className="admin-user-row">
          <Checkbox
            hidden={
              !currentAdminSelection.selectedUser.userId ||
              currentAdminSelection.selectedUser.userId <= 0
            }
            checked={editPassword}
            onChange={(_, checked) => setEditPassword(checked)}
          >
            Set password?
          </Checkbox>
          <div hidden={!editPassword}>
            <span>Password:</span>
            <Input
              value={password ?? ''}
              type="password"
              onChange={setPassword}
              className="form-control-half"
              placeholder="Password"
            />
          </div>
        </div>
        <div className="admin-user-row">
          <span>First Name</span>
          <Input
            value={firstName ?? ''}
            onChange={setFirstName}
            className="form-control-half"
            placeholder="First Name"
          />
        </div>
        <div className="admin-user-row">
          <span>Last Name</span>
          <Input
            value={lastName ?? ''}
            onChange={setLastName}
            className="form-control-half"
            placeholder="Last Name"
          />
        </div>
        <div className="admin-user-row">
          <span>Mobile number</span>
          <Input
            value={mobile ?? ''}
            onChange={setMobile}
            className="form-control-half"
            placeholder="Mobile Number"
          />
        </div>
        <div className="admin-user-row">
          <Checkbox checked={isActive} onChange={(_, checked) => setIsActive(checked)}>
            Is Active?
          </Checkbox>
          <Checkbox
            checked={requireResetPassword}
            onChange={(_, checked) => setRequireResetPassword(checked)}
          >
            Require Reset Password?
          </Checkbox>
          <Checkbox checked={sendEmailReset} onChange={(_, checked) => setSendEmailReset(checked)}>
            Send Password Reset by Email?
          </Checkbox>
          <Checkbox checked={sendTextReset} onChange={(_, checked) => setSendTextReset(checked)}>
            Send Password Reset by Text?
          </Checkbox>
          <Checkbox checked={disableCheckIn} onChange={(_, checked) => setDisableCheckIn(checked)}>
            Disable check-in permission?
          </Checkbox>
        </div>
        <div hidden={currentAdminSelection.selectedUser.isAdmin} className="admin-user-row">
          <span>Sellers:</span>
          {sellerRows}
        </div>
        <div className="admin-user-row">
          <span>Notes:</span>
          <Textarea
            className="form-control-half"
            rows={3}
            id="userNotes"
            onChange={(e) => setNotes(e)}
            value={notes ?? ''}
          />
        </div>
        <div className="admin-button-group">
          <Button onClick={onSubmit}>Submit</Button>{' '}
          <Button
            onClick={confirmDeleteUser}
            hidden={currentAdminSelection.selectedUser.userId <= 0}
          >
            Delete User
          </Button>
        </div>
        <div className="admin-button-group">
          <Button onClick={goBack}>Back</Button>
        </div>
      </div>
    </>
  ) : (
    ''
  );
}

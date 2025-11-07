'use client';

import { Button, Checkbox } from 'rsuite';
import {
  GetRolesResponse,
  GetSellersResponse,
  UpdateUserResponse,
} from '@/types/responses';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { Role, User, UserSeller } from '@/types/user';
import { Seller, SellerType } from '@/types/event';
import { setReloadUsers, setSelectedUser } from '@/lib/adminSelectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import AdminSellerSelect from '../common/adminSellerSelectComponent';
import ConfirmationDialog from '../../common/confirmationDialogComponent';
import { FaPlus } from 'react-icons/fa';
import { RootState } from '@/lib/store';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';
import { useDeleteUser } from '@/hooks/admin/useDeleteUser';
import { useGetAllRoles } from '@/hooks/admin/useGetAllRoles';
import { useGetSellers } from '@/hooks/common/useGetSellers';
import { useRouter } from 'next/navigation';
import { useUpdateUser } from '@/hooks/admin/useUpdateUser';

export default function AdminUserEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getSellers } = useGetSellers();
  const { getAllRoles } = useGetAllRoles();
  const { updateUser } = useUpdateUser();
  const { deleteUser } = useDeleteUser();
  const [allSellers, setAllSellers] = useState<Seller[] | undefined>(undefined);
  const [allRoles, setAllRoles] = useState<Role[] | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>('');
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
    } else if (
      username === undefined ||
      allSellers === undefined ||
      allRoles === undefined
    ) {
      dispatch(setIsLoading(true));
      setUsername(currentAdminSelection.selectedUser.username ?? '');
      setFirstName(currentAdminSelection.selectedUser.firstName ?? '');
      setLastName(currentAdminSelection.selectedUser.lastName ?? '');
      setMobile(currentAdminSelection.selectedUser.mobile ?? '');
      setNotes(currentAdminSelection.selectedUser.notes ?? '');
      setIsActive(currentAdminSelection.selectedUser.isActive ?? false);
      setRequireResetPassword(
        currentAdminSelection.selectedUser.requireResetPassword ?? false,
      );
      setSendEmailReset(currentAdminSelection.selectedUser.sendEmailReset ?? false);
      setSendTextReset(currentAdminSelection.selectedUser.sendTextReset ?? false);
      setDisableCheckIn(currentAdminSelection.selectedUser.disableCheckIn ?? false);
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
    if (isNaN(sellerId) || !newSellerId || isNaN(newSellerId)) {
      return;
    }
    if (currentAdminSelection.selectedUser) {
      const user: User = { ...currentAdminSelection.selectedUser };
      const userSellers = user.sellers ? [...user.sellers] : [];
      const newSeller = allSellers?.find((x) => x.sellerId === newSellerId);
      if (newSeller) {
        for (let i = 0; i < userSellers.length; i += 1) {
          const userSeller = { ...userSellers[i] } as UserSeller;
          if (userSeller?.sellerId === sellerId) {
            userSeller.sellerId = newSellerId;
            userSeller.sellerName = newSeller.name;
            userSeller.sellerType = newSeller.sellerType;
            userSellers[i] = userSeller;
            break;
          }
        }
        user.sellers = userSellers;
        dispatch(setSelectedUser(user));
      }
    } else {
      goBack();
    }
  };

  const updateRole = (sellerId: number, newRoleId: number | null) => {
    if (!sellerId || isNaN(sellerId) || !newRoleId || isNaN(newRoleId)) {
      return;
    }
    if (currentAdminSelection.selectedUser) {
      const user: User = { ...currentAdminSelection.selectedUser };
      const newRole = allRoles?.find((x) => x.roleId === newRoleId);
      if (newRole && user.sellers) {
        user.sellers = user.sellers.map((us) => {
          const userSeller = { ...us };
          if (userSeller.sellerId === sellerId) {
            userSeller.roleId = newRoleId;
          }
          return userSeller;
        });
        dispatch(setSelectedUser(user));
      }
    } else {
      goBack();
    }
  };

  const addSeller = () => {
    if (currentAdminSelection.selectedUser) {
      const user: User = { ...currentAdminSelection.selectedUser };
      const userSellers = user.sellers ? [...user.sellers] : [];
      const existingAdd = userSellers.find((x) => x.sellerId === 0);
      if (!existingAdd) {
        userSellers.push({
          sellerId: 0,
          sellerName: '',
          sellerType: SellerType.Artist,
        });
        user.sellers = userSellers;
        dispatch(setSelectedUser(user));
      }
    } else {
      goBack();
    }
  };

  const removeSeller = (sId: number) => {
    let sellerId: number = sId;
    if (!sellerId || isNaN(sellerId)) {
      sellerId = 0;
    }
    if (currentAdminSelection.selectedUser) {
      const user: User = { ...currentAdminSelection.selectedUser };
      let userSellers = user.sellers ? [...user.sellers] : [];
      userSellers = userSellers.filter((x) => x.sellerId !== sellerId);
      user.sellers = userSellers;
      dispatch(setSelectedUser(user));
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
        closeOnClick: false,
        position: 'top-center',
      },
    );
  };

  const onSubmit = () => {
    if (!currentAdminSelection.selectedUser) {
      return;
    }

    if (!firstName) {
      toast.warn('First name cannot be blank');
      return;
    }

    if (!lastName) {
      toast.warn('Last name cannot be blank');
      return;
    }

    const userToUpdate: User = {
      ...currentAdminSelection.selectedUser,
      disableCheckIn: disableCheckIn || false,
      firstName: firstName || '',
      isActive: isActive || false,
      lastName: lastName || '',
      mobile: mobile || '',
      notes: notes || '',
      requireResetPassword: requireResetPassword || false,
      sendEmailReset: sendEmailReset || false,
      sendTextReset: sendTextReset || false,
    };

    const sellersInvalid =
      userToUpdate.sellers === undefined ||
      userToUpdate.sellers.length === 0 ||
      userToUpdate.sellers.find((x) => x.sellerId === 0) !== undefined;
    if (sellersInvalid) {
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
    !currentAdminSelection.selectedUser.isAdmin &&
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
    sellerRows.push(
      <div
        title="Add Seller"
        key="addSeller"
        className="admin-click-cell"
        onClick={addSeller}
      >
        <FaPlus></FaPlus> Add Seller
      </div>,
    );
  }

  return currentAdminSelection.selectedUser &&
    (sellerRows !== null || currentAdminSelection.selectedUser.isAdmin) ? (
    <div className="admin-container">
      <h1>Edit User</h1>
      <div className="form-group">
        <label className="mt-4">Username: {username}</label>
      </div>
      <div className="form-group">
        <label className="mt-4">First Name</label>
        <input
          value={firstName ?? ''}
          onChange={(e) => setFirstName(e.target.value)}
          className="form-control"
          placeholder="first name"
          type="text"
        />
      </div>
      <div className="form-group">
        <label className="mt-4">Last Name</label>
        <input
          value={lastName ?? ''}
          onChange={(e) => setLastName(e.target.value)}
          className="form-control"
          placeholder="last name"
          type="text"
        />
      </div>
      <div className="form-group">
        <label className="mt-4">Mobile number</label>
        <input
          value={mobile ?? ''}
          onChange={(e) => setMobile(e.target.value)}
          className="form-control"
          placeholder="mobile number"
          type="text"
        />
      </div>
      <div className="form-group">
        <Checkbox checked={isActive} onChange={(_, checked) => setIsActive(checked)}>
          Is Active?
        </Checkbox>
        <Checkbox
          checked={requireResetPassword}
          onChange={(_, checked) => setRequireResetPassword(checked)}
        >
          Require Reset Password?
        </Checkbox>
        <Checkbox
          checked={sendEmailReset}
          onChange={(_, checked) => setSendEmailReset(checked)}
        >
          Send Password Reset by Email?
        </Checkbox>
        <Checkbox
          checked={sendTextReset}
          onChange={(_, checked) => setSendTextReset(checked)}
        >
          Send Password Reset by Text?
        </Checkbox>
        <Checkbox
          checked={disableCheckIn}
          onChange={(_, checked) => setDisableCheckIn(checked)}
        >
          Disable check-in permission?
        </Checkbox>
      </div>
      <div className="form-group" hidden={currentAdminSelection.selectedUser.isAdmin}>
        <label className="mt-4">Sellers:</label>
        {sellerRows}
      </div>
      <div className="form-group">
        <label className="mt-4">Notes:</label>
        <textarea onChange={(e) => setNotes(e.target.value)} value={notes ?? ''} />
      </div>
      <div className="admin-button-group">
        <Button onClick={onSubmit}>Submit</Button>{' '}
        <Button onClick={confirmDeleteUser}>Delete User</Button>
      </div>
      <div className="admin-button-group">
        <Button onClick={goBack}>Back</Button>
      </div>
    </div>
  ) : (
    ''
  );
}

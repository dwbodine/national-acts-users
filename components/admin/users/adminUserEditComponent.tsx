import { RootState } from '@/lib/store';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import router from 'next/router';
import { GetRolesResponse, Role, UpdateUserResponse, User } from '@/types/user';
import { Button, Col, Container, FormCheck, Row } from 'react-bootstrap';
import { setReloadUsers, setSelectedUser } from '@/lib/adminSelectionSlice';
import { useGetSellers } from '@/hooks/common/useGetSellers';
import { GetSellersResponse, Seller, SellerType } from '@/types/event';
import { useUpdateUser } from '@/hooks/admin/useUpdateUser';
import AdminSellerSelect from '../common/adminSellerSelectComponent';
import { FaPlus } from 'react-icons/fa';
import { useGetAllRoles } from '@/hooks/admin/useGetAllRoles';
import { useDeleteUser } from '@/hooks/admin/useDeleteUser';
import { current } from '@reduxjs/toolkit';
import { CirclesWithBar } from 'react-loader-spinner';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';

export default function AdminUserEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getSellers } = useGetSellers();
  const { getAllRoles } = useGetAllRoles();
  const { updateUser } = useUpdateUser();
  const { deleteUser } = useDeleteUser();
  const [allSellers, setAllSellers] = useState<Seller[] | undefined>(undefined);
  const [allRoles, setAllRoles] = useState<Role[] | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [firstName, setFirstName] = useState<string | undefined>(undefined);
  const [lastName, setLastName] = useState<string | undefined>(undefined);
  const [mobile, setMobile] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState<string | undefined>(undefined);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [requireResetPassword, setRequireResetPassword] = useState<boolean>(false);
  const [sendEmailReset, setSendEmailReset] = useState<boolean>(false);
  const [sendTextReset, setSendTextReset] = useState<boolean>(false);
  const [disableCheckIn, setDisableCheckIn] = useState<boolean>(false);

  useEffect(() => {
    if (currentAdminSelection.selectedUser == undefined) {
      goBack();
    } else if (
      username == undefined ||
      allSellers == undefined ||
      allRoles == undefined
    ) {
      dispatch(setIsLoading(true));
      setUsername(currentAdminSelection.selectedUser.username);
      setFirstName(currentAdminSelection.selectedUser.firstName);
      setLastName(currentAdminSelection.selectedUser.lastName);
      setMobile(currentAdminSelection.selectedUser.mobile);
      setNotes(currentAdminSelection.selectedUser.notes);
      setIsActive(currentAdminSelection.selectedUser.isActive);
      setRequireResetPassword(
        currentAdminSelection.selectedUser.requireResetPassword ?? false,
      );
      setSendEmailReset(currentAdminSelection.selectedUser.sendEmailReset ?? false);
      setSendTextReset(currentAdminSelection.selectedUser.sendTextReset ?? false);
      setDisableCheckIn(currentAdminSelection.selectedUser.disableCheckIn ?? false);
      getSellers().then((response: GetSellersResponse) => {
        setAllSellers(response.sellers);
        getAllRoles().then((resp: GetRolesResponse) => {
          const roles = resp.roles?.filter((x) => x.roleId != 1);
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
  ]);

  const goBack = () => {
    router.push('/admin/users/');
  };

  const updateSeller = (e: any) => {
    if (currentAdminSelection.selectedUser) {
      let user: User = { ...currentAdminSelection.selectedUser };
      let userSellers = user.sellers ? [...user.sellers] : [];
      const sellerId = parseInt(e.currentTarget.id.replace('_seller', ''));
      const newSellerId = parseInt(e.currentTarget.value);
      const newSeller = allSellers?.find((x) => x.sellerId == newSellerId);
      if (newSeller) {
        for (let i = 0; i < userSellers.length; i++) {
          if (userSellers[i].sellerId == sellerId) {
            let userSeller = { ...userSellers[i] };
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

  const updateRole = (e: any) => {
    if (currentAdminSelection.selectedUser) {
      let user: User = { ...currentAdminSelection.selectedUser };
      let userSellers = user.sellers ? [...user.sellers] : [];
      const sellerId = parseInt(e.currentTarget.id.replace('_role', ''));
      const newRoleId = parseInt(e.currentTarget.value);
      const newRole = allRoles?.find((x) => x.roleId == newRoleId);
      if (newRole) {
        for (let i = 0; i < userSellers.length; i++) {
          if (userSellers[i].sellerId == sellerId) {
            let userSeller = { ...userSellers[i] };
            userSeller.roleId = newRoleId;
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

  const addSeller = (e: any) => {
    if (currentAdminSelection.selectedUser) {
      let user: User = { ...currentAdminSelection.selectedUser };
      let userSellers = user.sellers ? [...user.sellers] : [];
      const existingAdd = userSellers.find((x) => x.sellerId == 0);
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

  const removeSeller = (e: any) => {
    if (currentAdminSelection.selectedUser) {
      let user: User = { ...currentAdminSelection.selectedUser };
      let userSellers = user.sellers ? [...user.sellers] : [];
      const sellerId = parseInt(e.currentTarget.id.replace('_remove', ''));
      userSellers = userSellers.filter((x) => x.sellerId != sellerId);
      user.sellers = userSellers;
      dispatch(setSelectedUser(user));
    } else {
      goBack();
    }
  };

  const deleteCurrentUser = () => {
    if (!currentAdminSelection.selectedUser) {
      return false;
    }

    let userId = currentAdminSelection.selectedUser.userId;

    var result = confirm('Are you sure you want to delete this user?');

    if (result) {
      deleteUser(userId).then((response: UpdateUserResponse) => {
        if (response.success) {
          dispatch(setReloadUsers(true));
          toast.success('User deleted successfully');
          router.push('/admin/users/');
        } else {
          toast.error(response.userError);
        }
      });
    }
  };

  const onSubmit = () => {
    dispatch(setIsLoading(true));
    if (!currentAdminSelection.selectedUser) {
      return false;
    }
    let userToUpdate: User = {
      ...currentAdminSelection.selectedUser,
      firstName: firstName || '',
      lastName: lastName || '',
      mobile: mobile || '',
      notes: notes || '',
      isActive: isActive || false,
      requireResetPassword: requireResetPassword || false,
      sendEmailReset: sendEmailReset || false,
      sendTextReset: sendTextReset || false,
      disableCheckIn: disableCheckIn || false,
    };

    const sellersInvalid =
      userToUpdate.sellers == undefined ||
      userToUpdate.sellers.length == 0 ||
      userToUpdate.sellers.find((x) => x.sellerId == 0) != undefined;
    if (sellersInvalid) {
      toast.warning('Seller selection invalid, please correct before submitting');
      return false;
    }

    updateUser(userToUpdate).then((response: UpdateUserResponse) => {
      if (response.success) {
        dispatch(setReloadUsers(true));
        toast.success('User updated successfully');
        router.push('/admin/users/');
      } else {
        toast.error(response.userError ?? 'Error occurred while saving user');
      }
      dispatch(setIsLoading(false));
    });
  };

  let sellerRows: any[] = [];
  if (
    allSellers != undefined &&
    allRoles != undefined &&
    currentAdminSelection.selectedUser &&
    !currentAdminSelection.selectedUser.isAdmin &&
    currentAdminSelection.selectedUser.sellers &&
    currentAdminSelection.selectedUser.sellers.length > 0
  ) {
    currentAdminSelection.selectedUser.sellers.map((item, index) => {
      sellerRows.push(
        <AdminSellerSelect
          id={item.sellerId}
          key={item.sellerId}
          Number={index + 1}
          Sellers={allSellers}
          Roles={allRoles}
          SellerId={item.sellerId}
          RoleId={item.roleId}
          OnSellerChange={updateSeller}
          OnRoleChange={updateRole}
          OnDelete={removeSeller}
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
    (sellerRows != null || currentAdminSelection.selectedUser.isAdmin) ? (
    <div className="admin-container">
      <h1>Edit User</h1>
      <div className="form-group">
        <label className="mt-4">Username: {username}</label>
      </div>
      <div className="form-group">
        <label className="mt-4">First Name</label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="form-control"
          placeholder="first name"
          type="text"
        />
      </div>
      <div className="form-group">
        <label className="mt-4">Last Name</label>
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="form-control"
          placeholder="last name"
          type="text"
        />
      </div>
      <div className="form-group">
        <label className="mt-4">Mobile number</label>
        <input
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="form-control"
          placeholder="mobile number"
          type="text"
        />
      </div>
      <div className="form-group">
        <FormCheck
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          label="Is Active?"
        />
        <FormCheck
          checked={requireResetPassword}
          onChange={(e) => setRequireResetPassword(e.target.checked)}
          label="Require Reset Password?"
        />
        <FormCheck
          checked={sendEmailReset}
          onChange={(e) => setSendEmailReset(e.target.checked)}
          label="Send Password Reset by Email?"
        />
        <FormCheck
          checked={sendTextReset}
          onChange={(e) => setSendTextReset(e.target.checked)}
          label="Send Password Reset by Text?"
        />
        <FormCheck
          checked={disableCheckIn}
          onChange={(e) => setDisableCheckIn(e.target.checked)}
          label="Disable check-in permission?"
        />
      </div>
      <div className="form-group" hidden={currentAdminSelection.selectedUser.isAdmin}>
        <label className="mt-4">Sellers:</label>
        {sellerRows}
      </div>
      <div className="form-group">
        <label className="mt-4">Notes:</label>
        <textarea onChange={(e) => setNotes(e.target.value)} value={notes} />
      </div>
      <div className="admin-button-group">
        <Button onClick={onSubmit}>Submit</Button>{' '}
        <Button onClick={deleteCurrentUser}>Delete User</Button>
      </div>
      <div className="admin-button-group">
        <Button onClick={goBack}>Back</Button>
      </div>
    </div>
  ) : (
    ''
  );
}

import { Button, FormCheck } from 'react-bootstrap';
import { GetPermissionsResponse, UpdateRoleResponse } from '@/types/responses';
import {
  Permission,
  Role,
} from '@/types/user';
import { ReactElement, useEffect, useState } from 'react';
import { setReloadRoles, setSelectedRole } from '@/lib/adminSelectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import router from 'next/router';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';
import { useGetAllPermissions } from '@/hooks/user/useGetAllPermissions';
import { useUpdateRole } from '@/hooks/admin/useUpdateRole';

export default function AdminRoleEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getAllPermissions } = useGetAllPermissions();
  const { updateRole } = useUpdateRole();
  const [allPermissions, setAllPermissions] = useState<Permission[] | undefined>(
    undefined,
  );
  const [roleName, setRoleName] = useState<string | undefined>(undefined);

  const goBack = () => {
    router.push('/admin/roles/');
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.selectedRole === undefined) {
        goBack();
      } else if (allPermissions === undefined && roleName === undefined) {
        dispatch(setIsLoading(true));
        setRoleName(currentAdminSelection.selectedRole.roleName);
        getAllPermissions().then((response: GetPermissionsResponse) => {
          setAllPermissions(response.permissions);
          dispatch(setIsLoading(false));
        });
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentAdminSelection, roleName, allPermissions, getAllPermissions, dispatch]);

  const hasPermission = (permissionId: number) => {
    if (
      !currentAdminSelection.selectedRole ||
      !currentAdminSelection.selectedRole.permissions
    ) {
      return false;
    }
    return (
      currentAdminSelection.selectedRole.permissions.find(
        (x) => x.permissionId === permissionId,
      ) !== undefined
    );
  };

  const updateRolePermissions = (permissionId: number, isChecked: boolean) => {
    if (!allPermissions || !currentAdminSelection.selectedRole || !permissionId || isNaN(permissionId) || permissionId <= 0) {
      return;
    }
    const hasPerm = hasPermission(permissionId);
    const roleToUpdate: Role = { ...currentAdminSelection.selectedRole };
    let currentPermissions: Permission[] = roleToUpdate.permissions
      ? [...roleToUpdate.permissions]
      : [];
    let changed = false;
    if (isChecked && !hasPerm) {
      const permissionToAdd = allPermissions.find((x) => x.permissionId === permissionId);
      if (permissionToAdd) {
        currentPermissions.push(permissionToAdd);
        changed = true;
      }
    } else if (!isChecked && hasPerm) {
      currentPermissions = currentPermissions.filter(
        (x) => x.permissionId !== permissionId,
      );
      changed = true;
    }
    if (changed) {
      roleToUpdate.permissions = currentPermissions;
      dispatch(setSelectedRole(roleToUpdate));
    }
  };

  const onSubmit = () => {
    if (!currentAdminSelection.selectedRole) {
      return;
    }
    const newRoleName: string = roleName ? roleName : '';

    if (!newRoleName) {
      toast.warn("Role name cannot be blank");
      return;
    }

    const roleToUpdate: Role = {
      ...currentAdminSelection.selectedRole,
      roleName: newRoleName,
    };

    dispatch(setIsLoading(true));
    updateRole(roleToUpdate).then((response: UpdateRoleResponse) => {
      if (response.success) {
        dispatch(setReloadRoles(true));
        toast.success('Save role succeeded');
        router.push('/admin/roles/');
      } else {
        toast.error(response.error ?? 'Error occurred while saving role');
      }
      dispatch(setIsLoading(false));
    });
  };

  const permissionRows: ReactElement[] = [];
  if (allPermissions && allPermissions.length > 0) {
    allPermissions.forEach((item, index) => {
      const checked: boolean = hasPermission(item.permissionId);
      const key = `perm${index}`;
      permissionRows.push(
        <FormCheck
          key={key}
          id={item.permissionId.toString()}
          onChange={(e) => updateRolePermissions(parseInt(`${item.permissionId}`), e.currentTarget.checked)}
          checked={checked}
          label={item.permissionName}
        />,
      );
    });
  }

  const pageHeader =
    ((currentAdminSelection.selectedRole?.roleId ?? 0) > 0) ? 'Edit role' : 'Add role';

  return (
    <div
      className="admin-container"
      hidden={
        !(permissionRows.length > 0 && currentAdminSelection.selectedRole !== undefined)
      }
    >
      <h1>{pageHeader}</h1>
      <div className="form-group">
        <label className="mt-4">Role Name</label>
        <input
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="form-control"
          placeholder="role name"
          type="text"
        />
      </div>
      {permissionRows}
      <Button onClick={onSubmit}>Submit</Button> <Button onClick={goBack}>Back</Button>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Checkbox, Input } from 'rsuite';

import PageHeader from '@/components/common/PageHeaderComponent';
import { useUpdateRole } from '@/hooks/admin/useUpdateRole';
import { useGetAllPermissions } from '@/hooks/user/useGetAllPermissions';
import { setReloadRoles, setSelectedRole } from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { GetPermissionsResponse, UpdateRoleResponse } from '@/types/responses';
import { Permission, Role } from '@/types/user';

export default function AdminRoleEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getAllPermissions } = useGetAllPermissions();
  const { updateRole } = useUpdateRole();
  const [allPermissions, setAllPermissions] = useState<Permission[] | undefined>(undefined);
  const [roleName, setRoleName] = useState<string | undefined>('');
  const router = useRouter();

  const goBack = useCallback(() => {
    router.push('/admin/roles');
  }, [router]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.selectedRole === undefined) {
        goBack();
      } else if (allPermissions === undefined && (roleName === undefined || roleName === '')) {
        dispatch(setIsLoading(true));
        setRoleName(currentAdminSelection.selectedRole.roleName);
        void getAllPermissions().then((response: GetPermissionsResponse) => {
          setAllPermissions(response.permissions);
          dispatch(setIsLoading(false));
        });
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentAdminSelection, roleName, allPermissions, getAllPermissions, dispatch, goBack]);

  const hasPermission = (permissionId: number) => {
    if (!currentAdminSelection.selectedRole || !currentAdminSelection.selectedRole.permissions) {
      return false;
    }
    return (
      currentAdminSelection.selectedRole.permissions.find(
        (x) => x.permissionId === permissionId,
      ) !== undefined
    );
  };

  const updateRolePermissions = (permissionId: number, isChecked: boolean) => {
    if (
      !allPermissions ||
      !currentAdminSelection.selectedRole ||
      !permissionId ||
      isNaN(permissionId) ||
      permissionId <= 0
    ) {
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
      currentPermissions = currentPermissions.filter((x) => x.permissionId !== permissionId);
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
      toast.warn('Role name cannot be blank');
      return;
    }

    const roleToUpdate: Role = {
      ...currentAdminSelection.selectedRole,
      roleName: newRoleName,
    };

    dispatch(setIsLoading(true));
    void updateRole(roleToUpdate).then((response: UpdateRoleResponse) => {
      if (response.success) {
        dispatch(setReloadRoles(true));
        toast.success('Save role succeeded');
        router.push('/admin/roles');
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
        <Checkbox
          key={key}
          id={item.permissionId.toString()}
          onChange={(_, isChecked) =>
            updateRolePermissions(parseInt(`${item.permissionId}`), isChecked)
          }
          checked={checked}
        >
          {item.permissionName}
        </Checkbox>,
      );
    });
  }

  const pageHeader =
    (currentAdminSelection.selectedRole?.roleId ?? 0) > 0 ? 'Edit role' : 'Add role';

  return (
    <>
      <PageHeader pageTitle={pageHeader} />
      <div
        className="admin-container"
        hidden={!(permissionRows.length > 0 && currentAdminSelection.selectedRole !== undefined)}
      >
        <div>
          <span>Role Name</span>
          <Input
            value={roleName ?? ''}
            onChange={setRoleName}
            className="form-control"
            placeholder="role name"
          />
        </div>
        {permissionRows}
        <div className="admin-button-span">
          <Button onClick={onSubmit}>Submit</Button> <Button onClick={goBack}>Back</Button>
        </div>
      </div>
    </>
  );
}

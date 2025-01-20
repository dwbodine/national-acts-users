import { RootState } from '@/lib/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import router from 'next/router';
import { Button, FormCheck } from 'react-bootstrap';
import { setReloadRoles, setSelectedRole } from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';
import { useGetAdminEvents } from '@/hooks/admin/useGetAdminEvents';
import { useUpdateTour } from '@/hooks/admin/useUpdateTour';

export default function AdminTourEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getAdminEvents } = useGetAdminEvents();
  const { updateTour } = useUpdateTour();
  
  const [tourName, setTourName] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (currentAdminSelection.selectedTour == undefined) {
      goBack();
    } else if (currentAdminSelection.selectedEvent == undefined) {

    }
  }, [currentAdminSelection]);

  const goBack = () => {
    router.push('/admin/tour/');
  };

  const hasSeller = (sellerId: number) => {
    if (
      !currentAdminSelection.selectedTour ||
      !currentAdminSelection.selectedTour.sellers
    ) {
      return false;
    }
    return (
      currentAdminSelection.selectedTour.sellers.find(
        (x) => x.sellerId == sellerId,
      ) != undefined
    );
  };

  const hasEvent = (eventId: number) => {
    if (
      !currentAdminSelection.selectedTour ||
      !currentAdminSelection.selectedTour.events
    ) {
      return false;
    }
    return (
      currentAdminSelection.selectedTour.events.find(
        (x) => x.eventId == eventId,
      ) != undefined
    );
  };

  const updateTourSellers = (sellerId: number) => {
    if (!allPermissions || !currentAdminSelection.selectedRole || !permissionId || isNaN(permissionId) || permissionId <= 0) {
      return;
    }
    const hasPerm = hasPermission(permissionId);
    let roleToUpdate: Role = { ...currentAdminSelection.selectedRole };
    let currentPermissions: Permission[] = roleToUpdate.permissions
      ? [...roleToUpdate.permissions]
      : [];
    let changed = false;
    if (isChecked && !hasPerm) {
      const permissionToAdd = allPermissions.find((x) => x.permissionId == permissionId);
      if (permissionToAdd) {
        currentPermissions.push(permissionToAdd);
        changed = true;
      }
    } else if (!isChecked && hasPerm) {
      currentPermissions = currentPermissions.filter(
        (x) => x.permissionId != permissionId,
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
      return false;
    }
    dispatch(setIsLoading(true));
    const newRoleName: string = roleName ? roleName : '';
    let roleToUpdate: Role = {
      ...currentAdminSelection.selectedRole,
      roleName: newRoleName,
    };
    updateRole(roleToUpdate).then((response: UpdateRoleResponse) => {
      if (response.success) {
        dispatch(setReloadRoles(true));
        toast.success('Save role succeeded');
        router.push('/admin/roles/');
      } else {
        toast.error(response.roleError ?? 'Error occurred while saving role');
      }
      dispatch(setIsLoading(false));
    });
  };

  const pageHeader =
    (currentAdminSelection.selectedTour?.tourId ?? 0 > 0) ? 'Edit tour' : 'Add tour';

  return (
    <div className="admin-container">
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
      
      <Button onClick={onSubmit}>Submit</Button> <Button onClick={goBack}>Back</Button>
    </div>
  );
}

import { RootState } from "@/lib/store";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import router from 'next/router';
import { GetPermissionsResponse, Permission, Role, UpdateRoleResponse } from "@/types/user";
import { Button, FormCheck } from "react-bootstrap";
import { useGetAllPermissions } from "@/hooks/user/useGetAllPermissions";
import { setReloadRoles, setSelectedRole } from "@/lib/adminSelectionSlice";
import { useUpdateRole } from "@/hooks/admin/useUpdateRole";
import { setIsLoading } from "@/lib/globalSelectionSlice";

export default function AdminOrderEdit() {
    const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
    const dispatch = useDispatch();
    const { getAllPermissions } = useGetAllPermissions();
    const { updateRole } = useUpdateRole();
    const [allPermissions, setAllPermissions] = useState<Permission[] | undefined>(undefined);
    const [roleName, setRoleName] = useState<string | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (currentAdminSelection.selectedRole == undefined) {
            goBack();
        } else if (allPermissions == undefined && roleName == undefined) {
            dispatch(
                setIsLoading(true)
            );
            setRoleName(currentAdminSelection.selectedRole.roleName);
            getAllPermissions().then((response: GetPermissionsResponse) => {
                setAllPermissions(response.permissions);                
                dispatch(
                    setIsLoading(false)
                );
            }); 
        }
    }, [currentAdminSelection, roleName, allPermissions, getAllPermissions, dispatch]);

    const goBack = () => {
        router.push('/admin/roles/');
    }

    const hasPermission = (permissionId: number) => {
        if (!currentAdminSelection.selectedRole || !currentAdminSelection.selectedRole.permissions) {
            return false;
        }
        return (currentAdminSelection.selectedRole.permissions.find(x => x.permissionId == permissionId) != undefined);
    };

    const updateRolePermissions = (e: any) => {
        if (!allPermissions|| !currentAdminSelection.selectedRole) {
            return;
        }
        const permissionId = parseInt(e.currentTarget.id);
        if (isNaN(permissionId) || permissionId <= 0) {
            return;
        }
        const checked = e.currentTarget.checked;
        const hasPerm = hasPermission(permissionId);
        let roleToUpdate: Role = {...currentAdminSelection.selectedRole};
        let currentPermissions: Permission[] = roleToUpdate.permissions ? [...roleToUpdate.permissions] : [];
        let changed = false;
        if (checked && !hasPerm) {            
            const permissionToAdd = allPermissions.find(x => x.permissionId == permissionId);
            if (permissionToAdd) {                
                currentPermissions.push(permissionToAdd);
                changed = true;
            }            
        } else if (!checked && hasPerm) {
            currentPermissions = currentPermissions.filter(x => x.permissionId != permissionId);
            changed = true;
        }
        if (changed) {
            roleToUpdate.permissions = currentPermissions;
            dispatch (
                setSelectedRole(roleToUpdate)
            );
        }
    };

    const onSubmit = () => {
        setErrorMessage(undefined);
        if (!currentAdminSelection.selectedRole) {
            return false;
        }
        dispatch(
            setIsLoading(true)
        );
        const newRoleName: string = (roleName ? roleName : '');
        let roleToUpdate: Role = {...currentAdminSelection.selectedRole, roleName: newRoleName};
        updateRole(roleToUpdate).then((response: UpdateRoleResponse) => {
            if (response.success) {
                dispatch(
                    setReloadRoles(true)
                )
                router.push('/admin/roles/');
            } else {
                setErrorMessage(response.roleError ?? "Error occurred while saving role");
            }
            dispatch(
                setIsLoading(false)
            );
        });
    }

    let permissionRows: any[] = [];
    if (allPermissions && allPermissions.length > 0) {
        allPermissions.map((item, index) => {
            const checked: boolean = hasPermission(item.permissionId);
            const key = `perm${index}`;
            permissionRows.push(<FormCheck key={key} id={item.permissionId.toString()} onChange={updateRolePermissions} checked={checked} label={item.permissionName} />);
        });
    }

    const pageHeader = (currentAdminSelection.selectedRole?.roleId ?? 0 > 0) ? "Edit role" : "Add role";

    return (
        <div className="admin-container" hidden={!(permissionRows.length > 0 && currentAdminSelection.selectedRole != undefined)}>
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
            { permissionRows }
            <Button onClick={onSubmit}>Submit</Button> <Button onClick={goBack}>Back</Button>
            { errorMessage ? 
            <div className="danger">{errorMessage}</div>
            : ''}
        </div> 
    );
}
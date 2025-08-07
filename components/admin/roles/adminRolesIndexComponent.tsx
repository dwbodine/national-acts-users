import { Button, FormCheck } from 'react-bootstrap';
import { GetRolesResponse, UpdateRoleResponse } from '@/types/responses';
import { setReloadRoles, setRoles, setSelectedRole } from '@/lib/adminSelectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import AdminListHomeButton from '../adminListHomeButton';
import { Role } from '@/types/user';
import { RootState } from '@/lib/store';
import { Table } from 'rsuite';
import router from 'next/router';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';
import { useDeleteRoles } from '@/hooks/admin/useDeleteRoles';
import { useGetAllRoles } from '@/hooks/admin/useGetAllRoles';

export default function AdminRolesIndex() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getAllRoles } = useGetAllRoles();
  const { deleteRoles } = useDeleteRoles();
  const { Column, HeaderCell, Cell } = Table;
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [tableLoading, setTableLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!currentAdminSelection.roles || currentAdminSelection.reloadRoles) {
        setTableLoading(true);
        dispatch(setIsLoading(true));
        setSelectedRoles([]);
        getAllRoles().then((response: GetRolesResponse) => {
          if (!response.error && response.roles) {
            dispatch(setRoles(response.roles));
          }
          dispatch(setIsLoading(false));
          setTableLoading(false);
        });
      } else if (tableLoading) {
        setTimeout(() => {
          setTableLoading(false);
        }, 300);
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [getAllRoles, dispatch, currentAdminSelection, tableLoading]);

  const editRole = (roleId: number) => {
    if (!roleId || isNaN(roleId)) {
      return;
    }
    const role = currentAdminSelection.roles?.find((x) => x.roleId === roleId);
    if (role) {
      dispatch(setSelectedRole(role));
      setTableLoading(true);
      router.push('/admin/roles/edit');
    }
  };

  const addRole = () => {
    const role: Role = {
      permissions: [],
      roleId: 0,
      roleName: '',
    };
    dispatch(setSelectedRole(role));
    setTableLoading(true);
    router.push('/admin/roles/edit');
  };

  const updateSelectedRoles = (roleId: number, isChecked: boolean) => {
    if (!roleId || isNaN(roleId) || roleId <= 0) {
      return;
    }

    if (isChecked && !selectedRoles.includes(roleId)) {
      const rIds = [...selectedRoles];
      rIds.push(roleId);
      setSelectedRoles(rIds);
    } else if (!isChecked && selectedRoles.includes(roleId)) {
      let rIds = [...selectedRoles];
      rIds = rIds.filter((x) => x !== roleId);
      setSelectedRoles(rIds);
    }
  };

  const deleteSelectedRoles = () => {
    if (selectedRoles.length === 0) {
      return;
    }
    deleteRoles(selectedRoles).then((response: UpdateRoleResponse) => {
      if (response.success) {
        setSelectedRoles([]);
        toast.success('Roles deleted successfully');
        dispatch(setReloadRoles(true));
      } else {
        toast.error(response.error);
      }
    });
  };

  return (
    <div className="admin-container">
      <h3>Roles Admin</h3>
      <Table
        height={420}
        data={currentAdminSelection.roles}
        bordered
        cellBordered
        loading={tableLoading}
      >
        <Column width={50} align="center">
          <HeaderCell> </HeaderCell>
          <Cell>
            {(rowData) =>
              rowData.roleId > 4 ? (
                <FormCheck
                  id={rowData.roleId}
                  checked={selectedRoles.includes(rowData.roleId)}
                  onChange={(e) => updateSelectedRoles(parseInt(`${rowData.roleId}`), e.currentTarget.checked)}
                />
              ) : (
                ''
              )
            }
          </Cell>
        </Column>
        <Column width={300}>
          <HeaderCell>Role</HeaderCell>
          <Cell className="admin-click-cell">
            {(rowData) => (
              <div id={rowData.roleId} onClick={() => editRole(parseInt(`${rowData.roleId}`))}>
                {rowData.roleName}
              </div>
            )}
          </Cell>
        </Column>
      </Table>
      <Button onClick={addRole}>Add</Button>{' '}
      <Button hidden={selectedRoles.length === 0} onClick={deleteSelectedRoles}>
        Delete
      </Button>{' '}
      <AdminListHomeButton />
    </div>
  );
}

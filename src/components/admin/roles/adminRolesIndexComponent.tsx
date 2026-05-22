'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Checkbox, Table } from 'rsuite';

import PageHeader from '@/components/common/PageHeaderComponent';
import { useDeleteRoles } from '@/hooks/admin/useDeleteRoles';
import { useGetAllRoles } from '@/hooks/admin/useGetAllRoles';
import { setReloadRoles, setRoles, setSelectedRole } from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { GetRolesResponse, UpdateRoleResponse } from '@/types/responses';
import { Role } from '@/types/user';

export default function AdminRolesIndex() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getAllRoles } = useGetAllRoles();
  const { deleteRoles } = useDeleteRoles();
  const { Column, HeaderCell, Cell } = Table;
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!currentAdminSelection.roles || currentAdminSelection.reloadRoles) {
        setTableLoading(true);
        dispatch(setIsLoading(true));
        setSelectedRoles([]);
        void getAllRoles().then((response: GetRolesResponse) => {
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
    void deleteRoles(selectedRoles).then((response: UpdateRoleResponse) => {
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
    <>
      <PageHeader pageTitle="Roles Admin" />
      <div className="admin-container">
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
              {(rowData: Role) =>
                rowData.roleId > 4 ? (
                  <Checkbox
                    id={rowData.roleId.toString()}
                    checked={selectedRoles.includes(rowData.roleId)}
                    onChange={(_, checked) =>
                      updateSelectedRoles(parseInt(`${rowData.roleId}`), checked)
                    }
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
              {(rowData: Role) => (
                <div
                  id={rowData.roleId.toString()}
                  onClick={() => editRole(parseInt(`${rowData.roleId}`))}
                >
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
      </div>
    </>
  );
}

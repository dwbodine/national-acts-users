import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import AdminListHomeButton from '../adminListHomeButton';
import { useGetAllRoles } from '@/hooks/admin/useGetAllRoles';
import { GetRolesResponse, Role, User } from '@/types/user';
import { Table } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { setReloadRoles, setRoles, setSelectedRole } from '@/lib/adminSelectionSlice';
import router from 'next/router';
import { Button, Col, Container, FormCheck, Row } from 'react-bootstrap';
import { useDeleteRoles } from '@/hooks/admin/useDeleteRoles';
import { CirclesWithBar } from 'react-loader-spinner';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';

export default function AdminRolesIndex() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getAllRoles } = useGetAllRoles();
  const { deleteRoles } = useDeleteRoles();
  const { Column, HeaderCell, Cell } = Table;
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [tableLoading, setTableLoading] = useState(true);

  useEffect(() => {
    if (!currentAdminSelection.roles || currentAdminSelection.reloadRoles) {
      setTableLoading(true);
      dispatch(setIsLoading(true));
      setSelectedRoles([]);
      getAllRoles().then((response: GetRolesResponse) => {
        if (!response.roleError && response.roles) {
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
  }, [getAllRoles, dispatch, currentAdminSelection, tableLoading]);

  const editRole = (roleId: number) => {
    if (!roleId || isNaN(roleId)) {
      return;
    }
    let role = currentAdminSelection.roles?.find((x) => x.roleId == roleId);
    if (role) {
      dispatch(setSelectedRole(role));
      setTableLoading(true);
      router.push('/admin/roles/edit');
    }
  };

  const addRole = () => {
    const role: Role = {
      roleId: 0,
      roleName: '',
      permissions: [],
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
      let rIds = [...selectedRoles];
      rIds.push(roleId);
      setSelectedRoles(rIds);
    } else if (!isChecked && selectedRoles.includes(roleId)) {
      let rIds = [...selectedRoles];
      rIds = rIds.filter((x) => x != roleId);
      setSelectedRoles(rIds);
    }    
  };

  const deleteSelectedRoles = () => {
    if (selectedRoles.length == 0) {
      return;
    }
    deleteRoles(selectedRoles).then((response) => {
      if (response.success) {
        setSelectedRoles([]);
        toast.success('Roles deleted successfully');
        dispatch(setReloadRoles(true));
      } else {
        toast.error(response.roleError);
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
      <Button hidden={selectedRoles.length == 0} onClick={deleteSelectedRoles}>
        Delete
      </Button>{' '}
      <AdminListHomeButton />
    </div>
  );
}

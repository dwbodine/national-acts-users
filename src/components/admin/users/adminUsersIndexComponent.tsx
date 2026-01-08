'use client';

import debouce from 'lodash.debounce';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Table } from 'rsuite';

import PageHeader from '@/components/common/PageHeaderComponent';
import { useGetAllRoles } from '@/hooks/admin/useGetAllRoles';
import { useGetAllUsers } from '@/hooks/admin/useGetAllUsers';
import { setSelectedUser, setUsers } from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { GetRolesResponse, GetUsersResponse } from '@/types/responses';
import { Role, User } from '@/types/user';

export default function AdminUsersIndex() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getAllUsers } = useGetAllUsers();
  const { getAllRoles } = useGetAllRoles();
  const [allRoles, setAllRoles] = useState<Role[] | undefined>(undefined);
  const { Column, HeaderCell, Cell } = Table;
  const [searchTerm, setSearchTerm] = useState('');
  const [tableLoading, setTableLoading] = useState(true);
  const router = useRouter();

  const debouncedResults = useMemo(() => debouce(setSearchTerm, 300), []);

  useEffect(() => {
    if (allRoles === undefined) {
      setTableLoading(true);
      dispatch(setIsLoading(true));
      void getAllRoles().then((resp: GetRolesResponse) => {
        const { roles } = resp;
        setAllRoles(roles);
        dispatch(setIsLoading(false));
        setTableLoading(false);
      });
    } else if (!currentAdminSelection.users || currentAdminSelection.reloadUsers) {
      setTableLoading(true);
      dispatch(setIsLoading(true));
      void getAllUsers().then((response: GetUsersResponse) => {
        if (!response.error && response.users) {
          dispatch(setUsers(response.users));
        }
        dispatch(setIsLoading(false));
        setTableLoading(false);
      });
    } else if (tableLoading) {
      setTimeout(() => {
        setTableLoading(false);
      }, 300);
    }
    return () => {
      debouncedResults.cancel();
    };
  }, [
    getAllUsers,
    dispatch,
    currentAdminSelection,
    debouncedResults,
    tableLoading,
    allRoles,
    getAllRoles,
  ]);

  const editUser = (userId: number) => {
    if (!userId || isNaN(userId)) {
      return;
    }
    const user = currentAdminSelection.users?.find((x) => x.userId === userId);
    if (user) {
      dispatch(setSelectedUser(user));
      setTableLoading(true);
      router.push('/admin/users/edit');
    }
  };

  const filterUsers = (users: User[] | undefined) => {
    let filteredUsers: User[] | undefined = users;
    if (searchTerm && searchTerm.length >= 2 && users && users.length > 0) {
      const srch = searchTerm.toLowerCase();
      filteredUsers = users.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(srch) ||
          user.lastName?.toLowerCase().includes(srch) ||
          user.username.toLowerCase().includes(srch) ||
          (!user.isAdmin &&
            user.sellers?.find((x) => x.sellerName.toLowerCase().includes(srch)) !== undefined),
      );
    }
    return filteredUsers;
  };

  const getRoleName = (roleId: number) => {
    const role = allRoles?.find((x) => x.roleId === roleId);
    if (role) {
      return role.roleName;
    }
    return '';
  };

  const filteredUsers = filterUsers(currentAdminSelection.users);

  return (
    <>
      <PageHeader pageTitle="Users Admin" />
      <div className="admin-container">
        <Input
          value={searchTerm ?? ''}
          onChange={setSearchTerm}
          className="form-control search-text-input no-print"
          placeholder="Search for users by name, username or client name..."
          hidden={currentAdminSelection.users === undefined}
        />
        <Table
          height={500}
          data={filteredUsers}
          bordered
          cellBordered
          loading={tableLoading}
          wordWrap={true}
        >
          <Column flexGrow={1}>
            <HeaderCell>First Name</HeaderCell>
            <Cell className="admin-click-cell">
              {(rowData: User) => {
                const name = `${rowData.firstName}`;
                const className = rowData.isActive ? '' : 'admin-inactive';
                return (
                  <div
                    className={className}
                    id={rowData.userId.toString()}
                    onClick={() => editUser(parseInt(`${rowData.userId}`))}
                  >
                    {name}
                  </div>
                );
              }}
            </Cell>
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Last Name</HeaderCell>
            <Cell className="admin-click-cell">
              {(rowData: User) => {
                const name = `${rowData.lastName}`;
                const className = rowData.isActive ? '' : 'admin-inactive';
                return (
                  <div
                    className={className}
                    id={rowData.userId.toString()}
                    onClick={() => editUser(parseInt(`${rowData.userId}`))}
                  >
                    {name}
                  </div>
                );
              }}
            </Cell>
          </Column>
          <Column flexGrow={2}>
            <HeaderCell>Email</HeaderCell>
            <Cell className="admin-click-cell">
              {(rowData: User) => {
                const name = `${rowData.username}`;
                const className = rowData.isActive ? '' : 'admin-inactive';
                return (
                  <div
                    className={className}
                    id={rowData.userId.toString()}
                    onClick={() => editUser(parseInt(`${rowData.userId}`))}
                  >
                    {name}
                  </div>
                );
              }}
            </Cell>
          </Column>
          <Column flexGrow={4}>
            <HeaderCell>Seller(s)</HeaderCell>
            <Cell className="admin-click-cell">
              {(rowData: User) => {
                let seller = '';
                if (rowData.isAdmin) {
                  seller = 'System Admin';
                } else if (rowData.sellers && rowData.sellers.length > 1) {
                  const { length } = rowData.sellers;
                  seller = rowData.sellers.reduce((accumulator, currentValue, index) => {
                    let name = currentValue.sellerName;
                    if (currentValue.roleId && currentValue.roleId > 0) {
                      name += ` (${getRoleName(currentValue.roleId)})`;
                    }
                    if (index === length - 1) {
                      return accumulator + name;
                    }
                    return `${accumulator}${name},  `;
                  }, '');
                } else if (rowData.sellers && rowData.sellers.length > 0 && rowData.sellers[0]) {
                  seller = `${rowData.sellers[0].sellerName} (${getRoleName(rowData.sellers[0].roleId ?? 0)})`;
                }
                const className = rowData.isActive ? '' : 'admin-inactive';
                return (
                  <div
                    className={className}
                    id={rowData.userId.toString()}
                    onClick={() => editUser(parseInt(`${rowData.userId}`))}
                  >
                    {seller}
                  </div>
                );
              }}
            </Cell>
          </Column>
        </Table>
      </div>
    </>
  );
}

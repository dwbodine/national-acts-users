import { useEffect, useMemo, useState } from 'react';
import AdminListHomeButton from '../adminListHomeButton';
import { GetRolesResponse, GetUsersResponse, Role, User } from '@/types/user';
import { Table } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { setSelectedUser, setUsers } from '@/lib/adminSelectionSlice';
import router from 'next/router';
import { useGetAllUsers } from '@/hooks/admin/useGetAllUsers';
import debouce from 'lodash.debounce';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { useGetAllRoles } from '@/hooks/admin/useGetAllRoles';
import React from 'react';

export default function AdminUsersIndex() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getAllUsers } = useGetAllUsers();
  const { getAllRoles } = useGetAllRoles();
  const [allRoles, setAllRoles] = useState<Role[] | undefined>(undefined);
  const { Column, HeaderCell, Cell } = Table;
  const [searchTerm, setSearchTerm] = useState('');
  const [tableLoading, setTableLoading] = useState(true);

  const debouncedResults = useMemo(() => {
    return debouce(setSearchTerm, 300);
  }, []);

  useEffect(() => {
    if (
      allRoles == undefined
    ) {
      setTableLoading(true);
      dispatch(setIsLoading(true));
      getAllRoles().then((resp: GetRolesResponse) => {
        const roles = resp.roles;
        setAllRoles(roles);
        dispatch(setIsLoading(false));
        setTableLoading(false);
      }); 
    } else if (!currentAdminSelection.users || currentAdminSelection.reloadUsers) {
      setTableLoading(true);
      dispatch(setIsLoading(true));
      getAllUsers().then((response: GetUsersResponse) => {
        if (!response.userError && response.users) {
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
  }, [getAllUsers, dispatch, currentAdminSelection, debouncedResults, tableLoading, allRoles, getAllRoles]);

  const editUser = (userId: number) => {
    if (!userId || isNaN(userId)) {
      return;
    }
    let user = currentAdminSelection.users?.find((x) => x.userId == userId);
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
      filteredUsers = users.filter((user) => {
        return (
          user.firstName?.toLowerCase().includes(srch) ||
          user.lastName?.toLowerCase().includes(srch) ||
          user.username.toLowerCase().includes(srch) ||
          (!user.isAdmin && user.sellers?.find(x => x.sellerName.toLowerCase().includes(srch)) != undefined)
        );
      });
    }
    return filteredUsers;
  };

  const getRoleName = (roleId: number) => {
    let roleName = '';
    const role = allRoles?.find(x => x.roleId == roleId);
    if (role) {
      roleName = role.roleName;
    }
    return roleName;
  };

  const filteredUsers = filterUsers(currentAdminSelection.users);

  return (
    <div className="admin-container">
      <h3>Users Admin</h3>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control search-text-input no-print"
        placeholder="Search for users by name, username or client name..."
        hidden={currentAdminSelection.users == undefined}
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
            {(rowData) => {
              const name = `${rowData.firstName}`;
              const className = rowData.isActive ? '' : 'admin-inactive';
              return (
                <div className={className} id={rowData.userId} onClick={() => editUser(parseInt(`${rowData.userId}`))}>
                  {name}
                </div>
              );
            }}
          </Cell>
        </Column>
        <Column flexGrow={1}>
          <HeaderCell>Last Name</HeaderCell>
          <Cell className="admin-click-cell">
            {(rowData) => {
              const name = `${rowData.lastName}`;
              const className = rowData.isActive ? '' : 'admin-inactive';
              return (
                <div className={className} id={rowData.userId} onClick={() => editUser(parseInt(`${rowData.userId}`))}>
                  {name}
                </div>
              );
            }}
          </Cell>
        </Column>        
        <Column flexGrow={2}>
          <HeaderCell>Email</HeaderCell>
          <Cell className="admin-click-cell">
            {(rowData) => {
              const name = `${rowData.username}`;
              const className = rowData.isActive ? '' : 'admin-inactive';
              return (
                <div className={className} id={rowData.userId} onClick={() => editUser(parseInt(`${rowData.userId}`))}>
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
                const length = rowData.sellers.length;
                seller = rowData.sellers.reduce((accumulator, currentValue, index) => {
                  let name = currentValue.sellerName;
                  if (currentValue.roleId && currentValue.roleId > 0) {
                    name += ` (${getRoleName(currentValue.roleId)})`;
                  }
                  if (index === length - 1) {
                    return accumulator + name;
                  } else {
                    return accumulator + name + ',  ';
                  }
                }, '');
              } else if (rowData.sellers && rowData.sellers.length > 0) {
                seller = `${rowData.sellers[0].sellerName} (${getRoleName(rowData.sellers[0].roleId ?? 0)})`;
              }
              const className = rowData.isActive ? '' : 'admin-inactive';
              return (
                <div className={className} id={rowData.userId.toString()} onClick={() => editUser(parseInt(`${rowData.userId}`))}>
                  {seller}
                </div>
              );
            }}
          </Cell>
        </Column>
      </Table>
      <AdminListHomeButton />
    </div>
  );
}

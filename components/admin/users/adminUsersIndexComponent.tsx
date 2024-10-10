import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import AdminListHomeButton from "../adminListHomeButton";
import { GetUsersResponse, User } from "@/types/user";
import { Table } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setSelectedUser, setUsers } from "@/lib/adminSelectionSlice";
import router from 'next/router';
import { useGetAllUsers } from "@/hooks/admin/useGetAllUsers";
import debouce from "lodash.debounce";
import { Col, Container, Row } from "react-bootstrap";
import { CirclesWithBar } from "react-loader-spinner";
import { setIsLoading } from "@/lib/globalSelectionSlice";

export default function AdminUsersIndex() {

    const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
    const dispatch = useDispatch();
    const { getAllUsers } = useGetAllUsers();
    const { Column, HeaderCell, Cell } = Table;
    const [searchTerm, setSearchTerm] = useState('');
    const [tableLoading, setTableLoading] = useState(true);

    const debouncedResults = useMemo(() => {
        return debouce(setSearchTerm, 300);
    }, []);

    useEffect(() => {
        if (!currentAdminSelection.users || currentAdminSelection.reloadUsers) {
            setTableLoading(true);
            dispatch(
                setIsLoading(true)
            );
            getAllUsers().then((response: GetUsersResponse) => {
                if (!response.userError && response.users) {
                    dispatch(
                        setUsers(response.users)
                    );
                }
                dispatch(
                    setIsLoading(false)
                );
                setTableLoading(false);
            });
        } else if (tableLoading) {
            setTimeout(() => {
                setTableLoading(false);
            }, 300)
        }
        return () => {
            debouncedResults.cancel();
        }       
    },[getAllUsers, dispatch, currentAdminSelection, debouncedResults]);

    const editUser = (e: SyntheticEvent) => {
        const userId = parseInt(e.currentTarget.id);
        let user = currentAdminSelection.users?.find(x => x.userId == userId);
        if (user) {
            dispatch(
                setSelectedUser(user)
            );
            setTableLoading(true);
            router.push('/admin/users/edit');
        }        
    };

    const filterUsers = (users: User[] | undefined) => {
        let filteredUsers: User[] | undefined = users;
        if (searchTerm && searchTerm.length >= 2 && users && users.length > 0) {
            const srch = searchTerm.toLowerCase();
            filteredUsers = users.filter((user) => {
                return user.firstName?.toLowerCase().includes(srch) || 
                    user.lastName?.toLowerCase().includes(srch) || 
                    user.username.toLowerCase().includes(srch) || 
                    user.category?.toLowerCase().includes(srch);
            })
        }
        return filteredUsers;
    };

    const filteredUsers =  filterUsers(currentAdminSelection.users);
    
    return (
        <div className="admin-container">
            <h3>Users Admin</h3>
            <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control search-text-input no-print"
                placeholder="Search for users..." 
                hidden={currentAdminSelection.users == undefined}
            />
            <Table height={420} data={filteredUsers} bordered cellBordered loading={tableLoading}>
                <Column flexGrow={4} >
                    <HeaderCell>User</HeaderCell>
                    <Cell className="admin-click-cell">
                        {
                            rowData => {
                                const name = `${rowData.firstName} ${rowData.lastName} (${rowData.username})`;
                                const className = rowData.isActive ? '' : 'admin-inactive';
                                return <div className={className} id={rowData.userId} onClick={editUser}>{name}</div>
                            }                             
                        }
                    </Cell>
                </Column>
                <Column flexGrow={4}>
                    <HeaderCell>Seller(s)</HeaderCell>
                    <Cell className="admin-click-cell">
                        {
                            rowData => {
                                let seller = '';
                                if (rowData.isAdmin) {
                                    seller = 'Admin';
                                } else if (rowData.sellers.length > 1) {
                                    seller = 'Multiple';
                                } else if (rowData.sellers.length > 0) {
                                    seller = rowData.sellers[0].sellerName;
                                }
                                const className = rowData.isActive ? '' : 'admin-inactive';
                                return <div className={className} id={rowData.userId} onClick={editUser}>{seller}</div>
                            }
                        }
                    </Cell>
                </Column>
            </Table>
            <AdminListHomeButton />
        </div>
    );
}
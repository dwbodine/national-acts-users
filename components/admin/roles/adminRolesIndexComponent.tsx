import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import AdminListHomeButton from "../adminListHomeButton";
import { useGetAllRoles } from "@/hooks/admin/useGetAllRoles";
import { GetRolesResponse, Role, User } from "@/types/user";
import { Table } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setReloadRoles, setRoles, setSelectedRole } from "@/lib/adminSelectionSlice";
import router from 'next/router';
import { Button, Col, Container, FormCheck, Row } from "react-bootstrap";
import { useDeleteRoles } from "@/hooks/admin/useDeleteRoles";
import { CirclesWithBar } from "react-loader-spinner";
import { setIsLoading } from "@/lib/globalSelectionSlice";

export default function AdminRolesIndex() {
    const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
    const dispatch = useDispatch();
    const { getAllRoles } = useGetAllRoles();
    const { deleteRoles } = useDeleteRoles();
    const { Column, HeaderCell, Cell } = Table;
    const [ selectedRoles, setSelectedRoles ] = useState<number[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [tableLoading, setTableLoading] = useState(true);

    useEffect(() => {
        if (!currentAdminSelection.roles || currentAdminSelection.reloadRoles) {
            setTableLoading(true);
            dispatch(
                setIsLoading(true)
            );
            setSelectedRoles([]);
            getAllRoles().then((response: GetRolesResponse) => {
                if (!response.roleError && response.roles) {
                    dispatch(
                        setRoles(response.roles)
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
            }, 300);
        }      
    },[getAllRoles, dispatch, currentAdminSelection, tableLoading]);    

    const editRole = (e: SyntheticEvent) => {
        const roleId = parseInt(e.currentTarget.id);
        let role = currentAdminSelection.roles?.find(x => x.roleId == roleId);
        if (role) {
            dispatch(
                setSelectedRole(role)
            );
            setTableLoading(true);
            router.push('/admin/roles/edit');
        }        
    };
    
    const addRole = () => {
        const role: Role = {
            roleId: 0,
            roleName: '',
            permissions: []
        };
        dispatch(
            setSelectedRole(role)
        );
        setTableLoading(true);
        router.push('/admin/roles/edit');
    }

    const updateSelectedRoles = (e: any) => {
        const roleId = parseInt(e.currentTarget.id);
        const checked = e.currentTarget.checked;
        if (!isNaN(roleId) && roleId > 0) {
            if (checked && !selectedRoles.includes(roleId)) {
                let rIds = [...selectedRoles];
                rIds.push(roleId);
                setSelectedRoles(rIds);
            } else if (!checked && selectedRoles.includes(roleId)) {
                let rIds = [...selectedRoles];
                rIds = rIds.filter(x => x != roleId);
                setSelectedRoles(rIds);
            }            
        }
    }

    const deleteSelectedRoles = () => {
        setErrorMessage(undefined);
        if (selectedRoles.length == 0) {
            return;
        }
        deleteRoles(selectedRoles).then((response) => {
            if (response.success) {
                setSelectedRoles([]);
                dispatch (
                    setReloadRoles(true)
                );
            } else {
                setErrorMessage(response.roleError);
            }
        })
    };

    return (
        <div className="admin-container">
            <h3>Roles Admin</h3>
            <Table height={420} data={currentAdminSelection.roles} bordered cellBordered loading={tableLoading}>
                <Column width={50} align="center">
                    <HeaderCell> </HeaderCell>
                    <Cell>{rowData => rowData.roleId > 4 ? <FormCheck id={rowData.roleId} checked={selectedRoles.includes(rowData.roleId)} onChange={updateSelectedRoles} /> : ''}</Cell>
                </Column>
                <Column flexGrow={4}>
                    <HeaderCell>Role</HeaderCell>
                    <Cell className="admin-click-cell">{rowData => <div id={rowData.roleId} onClick={editRole}>{rowData.roleName}</div> }</Cell>
                </Column>
            </Table>
            <Button onClick={addRole}>Add</Button> <Button hidden={selectedRoles.length == 0} onClick={deleteSelectedRoles}>Delete</Button> <AdminListHomeButton />
            { errorMessage ? 
            <div className="danger">{errorMessage}</div>
            : ''}
        </div>
    );
}
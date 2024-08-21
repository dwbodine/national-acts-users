import { MouseEventHandler, SyntheticEvent, useEffect, useState } from "react";
import AdminListHomeButton from "./adminListHomeButton";
import { useGetAllRoles } from "@/hooks/useGetAllRoles";
import { GetRolesResponse, Role } from "@/types/user";
import { Table } from "rsuite";
import { Button } from "react-bootstrap";

export default function AdminRoles() {

    const { getAllRoles } = useGetAllRoles();
    const [ roles, setRoles ] = useState<Role[]>([]);
    const [ roleId, setRoleId ] = useState(0);
    const [ showEdit, setShowEdit ] = useState(false);
    const { Column, HeaderCell, Cell } = Table;

    useEffect(() => {
        getAllRoles().then((response: GetRolesResponse) => {
            if (!response.roleError && response.roles) {
                setRoles(response.roles);
            }
        })
    },[getAllRoles, roles]);

    const editRole = (e: SyntheticEvent): MouseEventHandler<HTMLDivElement> | undefined => {
        e.preventDefault();
        const roleId = parseInt(e.currentTarget.id);
        if (roleId > 0) {
            setRoleId(roleId);
            setShowEdit(true);
        }
        return undefined;
    };

    const goBack = () : MouseEventHandler<HTMLLIElement> | undefined => {
        setRoleId(0);
        setShowEdit(false);
        return undefined;
    };

    const role: Role | undefined = roles.find(x => x.roleId == roleId);

    return (
        <>
            <div className="admin-container" hidden={!showEdit}>
                <h1>Roles Admin</h1>
                <Table height={420} data={roles} bordered cellBordered>
                    <Column flexGrow={4}>
                        <HeaderCell>Role</HeaderCell>
                        <Cell className="admin-click-cell">{rowData => <div id={rowData.roleId} onClick={editRole}>{rowData.roleName}</div> }</Cell>
                    </Column>
                </Table>
                <AdminListHomeButton />
            </div>
            <div className="admin-container" hidden={showEdit}>
                <h1>Edit role {role?.roleName}</h1>
                <Table height={420} data={role?.permissions} bordered cellBordered>
                    <Column flexGrow={4}>
                        <HeaderCell>Permission</HeaderCell>
                        <Cell dataKey="permissionName"></Cell>
                    </Column>
                </Table>
                <Button onClick={goBack}>Back</Button>
            </div>
        </>
    );
}
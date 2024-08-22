import { SyntheticEvent } from "react";
import router from 'next/router';

export default function AdminList() {
    const goToAdminPage = (e: SyntheticEvent) => {
        e.preventDefault();
        const id = e.currentTarget.id;
        switch (id) {
            case "manage-roles":
                router.push('/admin/roles/')
                break;
            case "manage-users":
                router.push('/admin/users/')
                break;
            default:
                break;
        }
    };

    return (
        <div className="admin-container">
            <h1>National Acts Admin Menu</h1>
            <ul>
                <li><a id="manage-roles" className="admin-link" onClick={goToAdminPage}>Manage Roles</a></li>
                <li><a id="manage-users" className="admin-link" onClick={goToAdminPage}>Manage Users</a></li>
            </ul>
        </div>
    );
}
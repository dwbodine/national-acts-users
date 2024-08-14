import { setActiveComponent } from "@/lib/adminSelectionSlice";
import { RootState } from "@/lib/store";
import { ActiveAdminComponent } from "@/types/user";
import { MouseEventHandler, SyntheticEvent } from "react";
import { useSelector, useDispatch } from "react-redux";


export default function AdminList() {
    const dispatch = useDispatch();

    const switchActiveComponent = (e: SyntheticEvent) => {
        e.preventDefault();
        const id = e.currentTarget.id;
        let activeComponent = ActiveAdminComponent.Index;
        switch (id) {
            case "manage-roles":
                activeComponent = ActiveAdminComponent.Roles;
                break;
            case "manage-users":
                activeComponent = ActiveAdminComponent.Users;
                break;
            default:
                activeComponent = ActiveAdminComponent.Index;
                break;
        }
        dispatch(
            setActiveComponent(activeComponent)
        );
    };

    return (
        <div className="admin-container">
            <h1>National Acts Admin Menu</h1>
            <ul>
                <li><a id="manage-roles" className="admin-link" onClick={switchActiveComponent}>Manage Roles</a></li>
                <li><a id="manage-users" className="admin-link" onClick={switchActiveComponent}>Manage Users</a></li>
            </ul>
        </div>
    );
}
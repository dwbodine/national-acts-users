import { useEffect } from "react";
import AdminListHomeButton from "./adminListHomeButton";
import { useGetAllRoles } from "@/hooks/useGetAllRoles";

export default function AdminRoles() {

    const { getAllRoles } = useGetAllRoles();

    useEffect(() => {
        
    },[]);

    return (
        <div className="admin-container">
            <h1>Roles Admin</h1>
            <div>
                content goes here
            </div>
            <AdminListHomeButton />
        </div>
    );
}
import { setActiveComponent } from "@/lib/adminSelectionSlice";
import { ActiveAdminComponent } from "@/types/user";
import { MouseEventHandler } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";

export default function AdminListHomeButton() {
    const dispatch = useDispatch();

    const goHome = () : MouseEventHandler<HTMLLIElement> | undefined => {
        dispatch (
            setActiveComponent(ActiveAdminComponent.Index)
        );
        return undefined;
    };
    return (
        <Button onClick={goHome}>Back</Button>
    )
}
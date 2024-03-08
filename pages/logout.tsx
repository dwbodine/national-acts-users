import { useLogout } from "@/hooks/useLogout";
import { useDispatch, useSelector } from "react-redux";
import { resetAll } from "@/lib/reportSelectionSlice";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Logout() {
    const { logout } = useLogout();
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useCurrentUser();

    useEffect(() => {
        dispatch(
            resetAll()
        );

        logout()
            .then((success) => {
                router.push('/login');
            });
    }, [user, dispatch, logout, router]);

    return (<></>);
}
import { useLogout } from "@/hooks/useLogout";
import { useDispatch } from "react-redux";
import { resetAll } from "@/lib/reportSelectionSlice";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useLogActivityData } from "@/hooks/useLogActivityData";
import { UserActivityType } from "@/types/user";

export default function Logout() {
    const { logout } = useLogout();
    const dispatch = useDispatch();
    const router = useRouter();
    const { logActivityData } = useLogActivityData();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            logActivityData(UserActivityType.Logout).then(() => {
                dispatch(
                    resetAll()
                );
                logout()
                    .then((success) => {
                        router.push('/login');
                    });
            });    
        }, 200);
        return () => {
            clearTimeout(timeoutId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])        

    return ("");
}
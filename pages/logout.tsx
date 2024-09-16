import { useLogout } from "@/hooks/user/useLogout";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useLogActivityData } from "@/hooks/common/useLogActivityData";
import { UserActivityType } from "@/types/user";
import { useResetStores } from "@/hooks/common/useResetStores";

export default function Logout() {
    const { logout } = useLogout();
    const router = useRouter();
    const { logActivityData } = useLogActivityData();
    const { resetStores } = useResetStores();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            logActivityData(UserActivityType.Logout).then(() => {
                resetStores();
                logout()
                    .then((success) => {
                        router.push('/login/');
                    });
            });    
        }, 200);
        return () => {
            clearTimeout(timeoutId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])        

    return ('');
}
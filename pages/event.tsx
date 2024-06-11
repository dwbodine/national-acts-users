import EventDetail from "../components/eventDetailComponent";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function EventPage() {
    const [detailHidden, setDetailHidden] = useState(true);
    const [id, setId] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const authTokenCookie = Cookies.get("authToken");
        if (!authTokenCookie) {
            router.push('/login');
        }
        setDetailHidden(true);
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams) {
            const idRoute = searchParams.get('id');
            if (idRoute) {
                const idVal = parseInt(idRoute.toString());
                if (!isNaN(idVal)) {
                    setId(idVal);
                    setDetailHidden(false);
                }            
            }
        }            

    }, [detailHidden, setDetailHidden, id, setId, router]);    

    return (
        <>
            <EventDetail hidden={detailHidden} Id={id} />
        </>        
    );
}


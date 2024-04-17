import { useRouter } from "next/router";
import CheckAuth from "../components/checkAuthComponent";
import EventDetail from "../components/eventDetailComponent";
import { useEffect, useState } from "react";

export default function EventPage() {
    const [detailHidden, setDetailHidden] = useState(true);
    const [id, setId] = useState(0);
    const router = useRouter();

    useEffect(() => {
        setDetailHidden(true);

        if (router && router.query) {
            const idRoute = router.query.id;
            if (idRoute) {
                const idVal = parseInt(idRoute.toString());
                if (!isNaN(idVal)) {
                    setId(idVal);
                    setDetailHidden(false);
                }            
            }
        }            

    }, [router, detailHidden, setDetailHidden, id, setId]);    

    return (
        <>
            <CheckAuth />
            <EventDetail hidden={detailHidden} Id={id} />
        </>        
    );
}


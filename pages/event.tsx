import { constants } from "os";
import CheckAuth from "../components/checkAuthComponent";
import EventDetail from "../components/eventDetailComponent";
import { useEffect, useState } from "react";

export default function EventPage() {
    const [detailHidden, setDetailHidden] = useState(true);
    const [id, setId] = useState(0);

    useEffect(() => {
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

    }, [detailHidden, setDetailHidden, id, setId]);    

    return (
        <>
            <CheckAuth />
            <EventDetail hidden={detailHidden} Id={id} />
        </>        
    );
}


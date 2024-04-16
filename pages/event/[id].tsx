import EventDetail from "../../components/eventDetailComponent";
import { useEffect, useState } from "react";

export default function DetailPage() {
    const [detailHidden, setDetailHidden] = useState(true);
    const [id, setId] = useState(0);

    useEffect(() => {
        setDetailHidden(true);

        const urlParts = window.location.href.split("/");
        if (urlParts && urlParts.length > 1) {
            const idPart = parseInt(urlParts[urlParts.length - 1]);
            if (idPart && !isNaN(idPart)) {
                setId(idPart);
                setDetailHidden(false);
            }
        }

    }, [detailHidden, setDetailHidden, id, setId]);    

    return (
        <EventDetail hidden={detailHidden} Id={id} />
    );
}


import { setIsLoading } from "@/lib/globalSelectionSlice";
import { useEffect } from "react"
import { useDispatch } from "react-redux";


export default function AllEventsAgenda() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            setIsLoading(false)
        );
    }, [dispatch]);

    return (
        <div>Agenda</div>
    )
}
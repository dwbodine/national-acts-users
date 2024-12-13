import { setIsLoading } from "@/lib/globalSelectionSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


export default function AllEventsMonth() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            setIsLoading(false)
        );
    }, [dispatch]);
    
    return (
        <div>Month view</div>
    )
}
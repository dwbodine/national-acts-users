import { Button } from "react-bootstrap";
import AdminListHomeButton from "../adminListHomeButton";
import AdminSellerSelect from "../common/adminSellerSelectComponent";
import { useEffect, useState } from "react";
import { useGetSellers } from "@/hooks/common/useGetSellers";
import { GetSellersResponse, Seller } from "@/types/event";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "@/lib/globalSelectionSlice";
import ReportDatePicker from "../../common/reportDatePIcker";
import { RootState } from "@/lib/store";
import { setAdminDates, setAdminSellerId } from "@/lib/adminSelectionSlice";

export default function RefreshTicketSocketData() { 
    const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
    const { getSellers } = useGetSellers();
    const dispatch = useDispatch();
    const [allSellers, setAllSellers] = useState<Seller[] | undefined>(undefined);

    useEffect(() => {
        if (allSellers == undefined) {
            dispatch(
                setIsLoading(true)
            );
            getSellers().then((response: GetSellersResponse) => {
                setAllSellers(response.sellers);
                dispatch(
                    setIsLoading(false)
                );
            });
        }
    },[allSellers, dispatch, getSellers]);    

    const updateSeller = (e: any) => {
        const sellerId = parseInt(e.currentTarget.value);
        dispatch (
            setAdminSellerId(sellerId)
        );
    };

    const onDateChange = (newStart: number, newEnd: number) => {
        let adminSelection = { ...currentAdminSelection };
        adminSelection.start = newStart;
        adminSelection.end = newEnd;
        dispatch(
            setAdminDates(adminSelection)
        );
    };

    const resetData = () => {
        
    };

    return(
        <div className="admin-container">
            <h3>Refresh TicketSocket Data</h3>
            <AdminSellerSelect id="refresh" Sellers={allSellers} OnSellerChange={updateSeller} />
            <ReportDatePicker onChange={onDateChange} start={currentAdminSelection.start} end={currentAdminSelection.end} />   
            <Button onClick={resetData}>Reset</Button> <AdminListHomeButton />
        </div>
    );
}
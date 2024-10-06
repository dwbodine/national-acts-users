import { useEffect, useState } from "react";
import AdminListHomeButton from "../adminListHomeButton";
import { Table } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setAdminDates, setAdminSellerId, setReloadRoles, setRoles, setSelectedRole } from "@/lib/adminSelectionSlice";
import { Button, Col, Container, FormCheck, Row } from "react-bootstrap";
import { setIsLoading } from "@/lib/globalSelectionSlice";
import AdminSellerSelect from "../common/adminSellerSelectComponent";
import ReportDatePicker from "../../common/reportDatePIcker";
import { GetSellersResponse, Seller, VipEvent } from "@/types/event";
import { useGetSellers } from "@/hooks/common/useGetSellers";

export default function AdminEventsIndex() {

    const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
    const { getSellers } = useGetSellers();
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [allSellers, setAllSellers] = useState<Seller[] | undefined>(undefined);
    const [events, setEvents] = useState<VipEvent[] | undefined>(undefined);

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
        } else if (events == undefined) {
              
        }
    },[allSellers, dispatch, getSellers, events]);    

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

    const onSubmit = () => {
       
    };

    return(
        <div className="admin-container">
            <Row className="refresh-results-header">
                <Col xl={4} lg={12} className="refresh-results-header-col">
                    <h3>Refresh TicketSocket Data</h3>
                    <AdminSellerSelect id="refresh" Sellers={allSellers} SellerId={currentAdminSelection.sellerId} OnSellerChange={updateSeller} />
                    <ReportDatePicker onChange={onDateChange} start={currentAdminSelection.start} end={currentAdminSelection.end} />   
                    <Button onClick={onSubmit}>Submit</Button> <AdminListHomeButton />
                    { errorMessage ? 
                    <div className="danger">{errorMessage}</div>
                    : ''}
                </Col>
            </Row>
            <Row>
                <Col>

                </Col>
            </Row>
        </div>
    );
}
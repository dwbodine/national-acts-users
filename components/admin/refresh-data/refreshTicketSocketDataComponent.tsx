import { Button, Col, Row } from "react-bootstrap";
import AdminListHomeButton from "../adminListHomeButton";
import AdminSellerSelect from "../common/adminSellerSelectComponent";
import { useEffect, useState } from "react";
import { useGetSellers } from "@/hooks/common/useGetSellers";
import { GetRefreshHistoryResponse, GetSellersResponse, RefreshHistoryResponse, Seller, TicketSocketRefreshHistory } from "@/types/event";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "@/lib/globalSelectionSlice";
import ReportDatePicker from "../../common/reportDatePIcker";
import { RootState } from "@/lib/store";
import { setAdminDates, setAdminSellerId } from "@/lib/adminSelectionSlice";
import RefreshTicketSocketDataResults from "./refreshTicketSocketDataResults";
import RefreshTicketSocketHistoryTable from "./refreshTicketSocketHistoryTable";
import { useGetRefreshHistory } from "@/hooks/admin/useGetRefreshHistory";
import { useRefreshEventsFromTicketSocket } from "@/hooks/admin/useRefreshEventsFromTicketSocket";

export default function RefreshTicketSocketData() { 
    const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
    const { getSellers } = useGetSellers();
    const { getRefreshHistory } = useGetRefreshHistory();
    const { refreshEventsFromTicketSocket } = useRefreshEventsFromTicketSocket();
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [allSellers, setAllSellers] = useState<Seller[] | undefined>(undefined);
    const [updateResults, setUpdateResults] = useState<TicketSocketRefreshHistory | undefined>(undefined);
    const [history, setHistory] = useState<TicketSocketRefreshHistory[] | undefined>(undefined);

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
        } else if (history == undefined) {
            dispatch(
                setIsLoading(true)
            );
            getRefreshHistory().then((response: GetRefreshHistoryResponse) => {
                setHistory(response.history);
                dispatch(
                    setIsLoading(false)
                );
            });   
        }
    },[allSellers, dispatch, getSellers, getRefreshHistory, updateResults, history]);    

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

    const submitReset = () => {
        setErrorMessage(undefined);
        let adminSelection = { ...currentAdminSelection };
        if (!adminSelection.sellerId) {
            setErrorMessage("Must select a seller");
            return;
        }
        dispatch(
            setIsLoading(true)
        );
        refreshEventsFromTicketSocket(adminSelection.sellerId, adminSelection.start, adminSelection.end)
            .then((response: RefreshHistoryResponse) => {
                setUpdateResults(response.results);
                setHistory(undefined);
                dispatch(
                    setIsLoading(false)
                );
            });
    };

    return(
        <div className="admin-container">
            <Row className="refresh-results-header">
                <Col xl={4} lg={12} className="refresh-results-header-col">
                    <h3>Refresh TicketSocket Data</h3>
                    <AdminSellerSelect id="refresh" Sellers={allSellers} SellerId={currentAdminSelection.sellerId} OnSellerChange={updateSeller} />
                    <ReportDatePicker onChange={onDateChange} start={currentAdminSelection.start} end={currentAdminSelection.end} />   
                    <Button onClick={submitReset}>Reset</Button> <AdminListHomeButton />
                    { errorMessage ? 
                    <div className="danger">{errorMessage}</div>
                    : ''}
                </Col>
                <Col xl={8} lg={12}>
                    <RefreshTicketSocketDataResults updateResults={updateResults} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <RefreshTicketSocketHistoryTable history={history} />
                </Col>
            </Row>
        </div>
    );
}
import { useEffect, useState } from "react";
import AdminListHomeButton from "../adminListHomeButton";
import { Table } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setAdminDates, setAdminEvent, setAdminEvents, setAdminSellerId, setAllSellers, setReloadEvents } from "@/lib/adminSelectionSlice";
import { Button, Col, Row } from "react-bootstrap";
import { setIsLoading } from "@/lib/globalSelectionSlice";
import AdminSellerSelect from "../common/adminSellerSelectComponent";
import ReportDatePicker from "../../common/reportDatePIcker";
import { GetEventsResponse, GetSellersResponse, Seller, VipEvent } from "@/types/event";
import { useGetSellers } from "@/hooks/common/useGetSellers";
import { useGetAdminEvents } from "@/hooks/admin/useGetAdminEvents";
import moment from "moment";
import { useGetLocation } from "@/hooks/common/useGetLocation";
import router from "next/router";

export default function AdminEventsIndex() {
    const { Column, HeaderCell, Cell } = Table;
    const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
    const { getSellers } = useGetSellers();
    const { getAdminEvents } = useGetAdminEvents();
    const { getLocation } = useGetLocation();
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [tableLoading, setTableLoading] = useState(true);
    
    useEffect(() => {
        if (currentAdminSelection.allSellers == undefined) {      
            setTableLoading(true);      
            dispatch(
                setIsLoading(true)
            );
            dispatch(
                setAdminSellerId(undefined)
            ); 
            dispatch(
                setReloadEvents(true)
            );
            getSellers().then((response: GetSellersResponse) => {
                dispatch (
                    setAllSellers(response.sellers)
                );
                dispatch(
                    setIsLoading(false)
                );
                setTableLoading(false);    
            });
        } else if (currentAdminSelection.events != undefined && tableLoading) {
            setTimeout(() => {
                setTableLoading(false);
            }, 300);            
        }
    },[dispatch, getSellers, currentAdminSelection.allSellers, currentAdminSelection.events, tableLoading]);    

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

    const viewOrders = (e: any) => {
        const ticketSocketEventId = parseInt(e.currentTarget.id);
        if (!ticketSocketEventId || !currentAdminSelection.events || currentAdminSelection.events.length == 0) {
            return;
        }
        const vipEvent = currentAdminSelection.events.find(x => x.ticketSocketEventId == ticketSocketEventId);
        if (!vipEvent) {
            return;
        }
        dispatch (
            setAdminEvent(vipEvent)
        );
        setTableLoading(true);
        router.push('/admin/events/orders/');
    };

    const onSubmit = () => {
        setErrorMessage(undefined);
        let adminSelection = { ...currentAdminSelection };
        if (!adminSelection.sellerId) {
            setErrorMessage("Must select a seller");
            return;
        }
        setTableLoading(true);
        dispatch(
            setIsLoading(true)
        );
        getAdminEvents(adminSelection)
            .then((response: GetEventsResponse) => {
                if (response.events && !response.eventError) {
                    dispatch (
                        setAdminEvents(response.events)
                    );
                }
                dispatch(
                    setIsLoading(false)
                );
                setTableLoading(false);
            });
    };

    return(
        <div className="admin-container">
            <Row className="refresh-results-header">
                <Col>
                    <h3>Event Admin</h3>
                    <AdminSellerSelect id="refresh" Sellers={currentAdminSelection.allSellers} SellerId={currentAdminSelection.sellerId} OnSellerChange={updateSeller} />
                    <ReportDatePicker onChange={onDateChange} start={currentAdminSelection.start} end={currentAdminSelection.end} />   
                    <Button onClick={onSubmit}>Submit</Button> <AdminListHomeButton />
                    { errorMessage ? 
                    <div className="danger">{errorMessage}</div>
                    : ''}
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table autoHeight={true} data={currentAdminSelection.events} bordered cellBordered loading={tableLoading}>
                        <Column flexGrow={1} minWidth={100}>
                            <HeaderCell>Date</HeaderCell>
                            <Cell>{rowData => moment(rowData.eventDate).format('MM/DD/YYYY')}</Cell>
                        </Column>
                        <Column flexGrow={3}>
                            <HeaderCell>Title</HeaderCell>
                            <Cell>{rowData => rowData.title}</Cell>
                        </Column>
                        <Column flexGrow={2}>
                            <HeaderCell>Venue</HeaderCell>
                            <Cell>{rowData => rowData.venue ? rowData.venue.name : ''}</Cell>
                        </Column>
                        <Column flexGrow={3}>
                            <HeaderCell>Location</HeaderCell>
                            <Cell>{rowData => rowData.venue ? getLocation(rowData.venue) : ''}</Cell>
                        </Column>
                        <Column flexGrow={1}>
                            <HeaderCell>&nbsp;</HeaderCell>
                            <Cell>Edit</Cell>
                        </Column>
                        <Column flexGrow={1}>
                            <HeaderCell>&nbsp;</HeaderCell>
                            <Cell>{rowData => rowData.ticketSocketEventId ? <a href="#" id={rowData.ticketSocketEventId} onClick={viewOrders}>Manage Orders</a> : ''}</Cell>
                        </Column>
                    </Table>
                </Col>
            </Row>
        </div>
    );
}
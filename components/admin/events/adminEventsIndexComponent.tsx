import { useEffect, useState } from "react";
import AdminListHomeButton from "../adminListHomeButton";
import { Table } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setAdminDates, setAdminEvent, setAdminEvents, setAdminSellerId, setAllSellers, setReloadEvents } from "@/lib/adminSelectionSlice";
import { Col, Row } from "react-bootstrap";
import { setIsLoading } from "@/lib/globalSelectionSlice";
import AdminSellerSelect from "../common/adminSellerSelectComponent";
import ReportDatePicker from "../../common/reportDatePIcker";
import { GetEventsResponse, GetSellersResponse, Seller, VipEvent } from "@/types/event";
import { useGetSellers } from "@/hooks/common/useGetSellers";
import { useGetAdminEvents } from "@/hooks/admin/useGetAdminEvents";
import moment from "moment";
import { useGetLocation } from "@/hooks/common/useGetLocation";
import router from "next/router";
import { useGetEventStatus } from "@/hooks/common/useGetEventStatus";

export default function AdminEventsIndex() {
    const { Column, HeaderCell, Cell } = Table;
    const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
    const { getSellers } = useGetSellers();
    const { getAdminEvents } = useGetAdminEvents();
    const { getLocation } = useGetLocation();
    const { getEventStatusSlug, getEventStatusText } = useGetEventStatus();
    const dispatch = useDispatch();
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
        } else if (currentAdminSelection.reloadEvents) {
            let adminSelection = { ...currentAdminSelection };
            if (!adminSelection.sellerId) {
                setTableLoading(false);
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
        } else if (currentAdminSelection.events != undefined && tableLoading) {
            setTimeout(() => {
                setTableLoading(false);
            }, 300);            
        }
    },[dispatch, getSellers, currentAdminSelection, getAdminEvents, tableLoading]);    

    const updateSeller = (e: any) => {
        const sellerId = parseInt(e.currentTarget.value);
        dispatch (
            setAdminSellerId(sellerId)
        );
        dispatch(
            setReloadEvents(true)
        );
    };

    const onDateChange = (newStart: number | undefined, newEnd: number | undefined) => {
        let adminSelection = { ...currentAdminSelection };
        adminSelection.start = newStart;
        adminSelection.end = newEnd;
        dispatch(
            setAdminDates(adminSelection)
        );
        dispatch(
            setReloadEvents(true)
        );
    };

    const onStartClear = () => {
        onDateChange(undefined, currentAdminSelection.end);
    };

    const onEndClear = () => {
        onDateChange(currentAdminSelection.start, undefined);
    };

    const editEvent = (e: any) => {
        const ticketSocketEventId = parseInt(e.currentTarget.id.replace('_event', ''));
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
        router.push('/admin/events/edit/');
    };

    const viewOrders = (e: any) => {
        const ticketSocketEventId = parseInt(e.currentTarget.id.replace('_orders', ''));
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

    return(
        <div className="admin-container">
            <Row className="refresh-results-header">
                <Col>
                    <AdminListHomeButton />
                </Col>
            </Row>  
            <Row className="refresh-results-header">
                <Col>
                    <h3>Event Admin</h3>
                    <ReportDatePicker onChange={onDateChange} onStartClear={onStartClear} onEndClear={onEndClear} start={currentAdminSelection.start} end={currentAdminSelection.end} />   
                    <AdminSellerSelect id="refresh" Sellers={currentAdminSelection.allSellers} SellerId={currentAdminSelection.sellerId} OnSellerChange={updateSeller} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table autoHeight={true} data={currentAdminSelection.events} bordered cellBordered loading={tableLoading}
                        rowClassName={ (rowData: VipEvent) => { return getEventStatusSlug(rowData)} }>
                        <Column flexGrow={1} minWidth={100}>
                            <HeaderCell>Date</HeaderCell>
                            <Cell>{(rowData: VipEvent) => moment(rowData.eventDate).format('MM/DD/YYYY')}</Cell>
                        </Column>
                        <Column flexGrow={3}>
                            <HeaderCell>Title</HeaderCell>
                            <Cell>{(rowData: VipEvent) => rowData.title}</Cell>
                        </Column>
                        <Column flexGrow={2}>
                            <HeaderCell>Venue</HeaderCell>
                            <Cell>{(rowData: VipEvent) => rowData.venue ? rowData.venue.name : ''}</Cell>
                        </Column>
                        <Column flexGrow={3}>
                            <HeaderCell>Location</HeaderCell>
                            <Cell>{(rowData: VipEvent) => rowData.venue ? getLocation(rowData.venue) : ''}</Cell>
                        </Column>
                        <Column flexGrow={1}>
                            <HeaderCell>Tickets sold</HeaderCell>
                            <Cell>{(rowData: VipEvent) => rowData.totalTickets}</Cell>
                        </Column>
                        <Column flexGrow={2}>
                            <HeaderCell>Event Status</HeaderCell>
                            <Cell>{(rowData: VipEvent) => getEventStatusText(rowData as VipEvent)}</Cell>
                        </Column>
                        <Column flexGrow={1}>
                            <HeaderCell>&nbsp;</HeaderCell>
                            <Cell>{(rowData: VipEvent) => rowData.ticketSocketEventId ? <a href="#" id={`${rowData.ticketSocketEventId}_event`} onClick={editEvent}>Edit</a> : ''}</Cell>
                        </Column>
                        <Column flexGrow={1}>
                            <HeaderCell>&nbsp;</HeaderCell>
                            <Cell>{(rowData: VipEvent) => rowData.ticketSocketEventId && rowData.totalTickets > 0 ? <a href="#" id={`${rowData.ticketSocketEventId}_orders`} onClick={viewOrders}>Manage Orders</a> : ''}</Cell>
                        </Column>
                    </Table>
                </Col>
            </Row>
        </div>
    );
}
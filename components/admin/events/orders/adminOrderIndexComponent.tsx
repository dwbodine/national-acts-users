import { useEffect, useState } from "react";
import AdminListHomeButton from "../../adminListHomeButton";
import { Table } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setAdminDates, setAdminEvent, setAdminEvents, setAdminOrder, setAdminSellerId, setReloadEvents, setReloadRoles, setRoles, setSelectedRole } from "@/lib/adminSelectionSlice";
import { Button, Col, Container, FormCheck, Row } from "react-bootstrap";
import { setIsLoading } from "@/lib/globalSelectionSlice";
import AdminSellerSelect from "../../common/adminSellerSelectComponent";
import ReportDatePicker from "../../../common/reportDatePIcker";
import { GetEventsResponse, GetSellersResponse, Order, Seller, VipEvent } from "@/types/event";
import { useGetSellers } from "@/hooks/common/useGetSellers";
import router from "next/router";
import moment from "moment";
import { current } from "@reduxjs/toolkit";
import { useGetOrderStatus } from "@/hooks/common/useGetOrderStatus";
import { useGetEventStatus } from "@/hooks/common/useGetEventStatus";
import { useGetLocation } from "@/hooks/common/useGetLocation";
import { useGetAdminEvents } from "@/hooks/admin/useGetAdminEvents";

export default function AdminOrdersIndex() {
    const { Column, HeaderCell, Cell } = Table;
    const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
    const [tableLoading, setTableLoading] = useState(true);
    const dispatch = useDispatch();
    const { getLocation } = useGetLocation();
    const { getOrderStatusSlug, getOrderStatusText } = useGetOrderStatus();
    const { getEventStatusText } = useGetEventStatus();
    const { getAdminEvents } = useGetAdminEvents();

    useEffect(() => {
        if (currentAdminSelection.reloadEvents) {
            let adminSelection = { ...currentAdminSelection };
            let selectedEventId = adminSelection.selectedEvent?.ticketSocketEventId;
            let selectedOrderId = adminSelection.selectedOrder?.ticketSocketOrderId;
            dispatch (
                setReloadEvents(false)
            );
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
                        const currentEvent = response.events.find(x => x.ticketSocketEventId == selectedEventId);
                        if (currentEvent && currentEvent.orders) {
                            dispatch (
                                setAdminEvent(currentEvent)
                            );
                            const currentOrder = currentEvent.orders.find(x => x.ticketSocketOrderId == selectedOrderId);    
                            dispatch(
                                setAdminOrder(currentOrder)
                            );
                        }                        
                    }
                    dispatch(
                        setIsLoading(false)
                    );
                });
        } else if (tableLoading) {
            setTimeout(() => {
                setTableLoading(false);
            }, 300);
        }
    },[currentAdminSelection, tableLoading]);   
    
    const viewOrder = (e: any) => {
        const ticketSocketOrderId = parseInt(e.currentTarget.id);
        if (!ticketSocketOrderId || !currentAdminSelection.selectedEvent || !currentAdminSelection.selectedEvent.orders) {
            return;
        }
        const order = currentAdminSelection.selectedEvent.orders.find(x => x.ticketSocketOrderId == ticketSocketOrderId);
        if (!order) {
            return;
        }
        dispatch (
            setAdminOrder(order)
        );
        setTableLoading(true);
        router.push('/admin/events/orders/edit');
    };

    const goBack = () => {
        dispatch(
            setAdminEvent(undefined)
        );
        router.push('/admin/events/');
    }

    const location = (currentAdminSelection.selectedEvent?.venue != undefined) ? getLocation(currentAdminSelection.selectedEvent.venue) : '';

    return(
        <div className="admin-container">
            <Row className="admin-event-info">
                <Col><Button onClick={goBack}>Back</Button> </Col>
            </Row>
            <Row className="form-group">
                <Col className="form-header">
                    <h3> {currentAdminSelection.selectedEvent?.title}</h3>
                    <span className="title">Date:</span> {moment(currentAdminSelection.selectedEvent?.eventDate).format('MM/DD/YYYY')}<br />
                    <span className="title">Venue:</span> {currentAdminSelection.selectedEvent?.venue?.name}<br />
                    <span className="title">Location:</span> {location}<br />
                    <span className="title">Status:</span> {getEventStatusText(currentAdminSelection.selectedEvent)}<br />
                </Col>
            </Row>
            <Row>
                <Col><h5>Orders</h5></Col>
            </Row>            
            <Row>
                <Col>
                    <Table height={420} data={currentAdminSelection.selectedEvent?.orders} bordered cellBordered loading={tableLoading} 
                        rowClassName={ (rowData: Order) => { return getOrderStatusSlug(rowData)} }>
                        <Column flexGrow={1}>
                            <HeaderCell>Purchase Date</HeaderCell>
                            <Cell>{(rowData: Order) => moment(rowData.purchaseDate).format('MM/DD/YYYY')}</Cell>
                        </Column>
                        <Column flexGrow={3}>
                            <HeaderCell>Purchaser Name</HeaderCell>
                            <Cell>{(rowData: Order) => `${rowData.purchaserLastName}, ${rowData.purchaserFirstName}`}</Cell>
                        </Column>
                        <Column flexGrow={3}>
                            <HeaderCell># of Tickets</HeaderCell>
                            <Cell>{(rowData: Order) => rowData.numTickets ? rowData.numTickets : ''}</Cell>
                        </Column>
                        <Column flexGrow={3}>
                            <HeaderCell>Order Status</HeaderCell>
                            <Cell>{(rowData: Order) => getOrderStatusText(rowData as Order)}</Cell>
                        </Column>
                        <Column flexGrow={1}>
                            <HeaderCell>&nbsp;</HeaderCell>
                            <Cell>{(rowData: Order) => rowData.ticketSocketOrderId ? <a href="#" id={rowData.ticketSocketOrderId.toString()} onClick={viewOrder}>Edit</a> : 'Edit'}</Cell>
                        </Column>
                    </Table>
                </Col>
            </Row>
        </div>
    );
}
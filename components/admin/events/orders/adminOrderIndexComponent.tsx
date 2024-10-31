import { useEffect, useState } from "react";
import AdminListHomeButton from "../../adminListHomeButton";
import { Table } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setAdminDates, setAdminEvent, setAdminOrder, setAdminSellerId, setReloadRoles, setRoles, setSelectedRole } from "@/lib/adminSelectionSlice";
import { Button, Col, Container, FormCheck, Row } from "react-bootstrap";
import { setIsLoading } from "@/lib/globalSelectionSlice";
import AdminSellerSelect from "../../common/adminSellerSelectComponent";
import ReportDatePicker from "../../../common/reportDatePIcker";
import { GetSellersResponse, Order, Seller, VipEvent } from "@/types/event";
import { useGetSellers } from "@/hooks/common/useGetSellers";
import router from "next/router";
import moment from "moment";
import { current } from "@reduxjs/toolkit";
import { useGetOrderStatus } from "@/hooks/common/useGetOrderStatus";
import { useGetEventStatus } from "@/hooks/common/useGetEventStatus";
import { useGetLocation } from "@/hooks/common/useGetLocation";

export default function AdminOrdersIndex() {
    const { Column, HeaderCell, Cell } = Table;
    const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
    const currentEvent = currentAdminSelection.selectedEvent;
    const [tableLoading, setTableLoading] = useState(true);
    const dispatch = useDispatch();
    const { getLocation } = useGetLocation();
    const { getOrderStatusSlug, getOrderStatusText } = useGetOrderStatus();
    const { getEventStatusText } = useGetEventStatus();

    useEffect(() => {
        if (currentEvent == undefined) {
            router.push('/admin/events/');
        } else if (tableLoading) {
            setTimeout(() => {
                setTableLoading(false);
            }, 300);
        }
    },[currentAdminSelection, currentEvent, tableLoading]);   
    
    const viewOrder = (e: any) => {
        const ticketSocketOrderId = parseInt(e.currentTarget.id);
        if (!ticketSocketOrderId || !currentEvent || !currentEvent.orders) {
            return;
        }
        const order = currentEvent.orders.find(x => x.ticketSocketOrderId == ticketSocketOrderId);
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

    const location = (currentEvent?.venue != undefined) ? getLocation(currentEvent.venue) : '';

    return(
        <div className="admin-container">
            <Row className="admin-event-info">
                <Col><Button onClick={goBack}>Back</Button> </Col>
            </Row>
            <Row className="form-group">
                <Col className="form-header">
                    <h3> {currentEvent?.title}</h3>
                    <span className="title">Date:</span> {moment(currentEvent?.eventDate).format('MM/DD/YYYY')}<br />
                    <span className="title">Venue:</span> {currentEvent?.venue?.name}<br />
                    <span className="title">Location:</span> {location}<br />
                    <span className="title">Status:</span> {getEventStatusText(currentEvent)}<br />
                </Col>
            </Row>
            <Row>
                <Col><h5>Orders</h5></Col>
            </Row>            
            <Row>
                <Col>
                    <Table height={420} data={currentEvent?.orders} bordered cellBordered loading={tableLoading} 
                        rowClassName={ (rowData) => { return getOrderStatusSlug(rowData)} }>
                        <Column flexGrow={1}>
                            <HeaderCell>Purchase Date</HeaderCell>
                            <Cell>{rowData => moment(rowData.purchaseDate).format('MM/DD/YYYY')}</Cell>
                        </Column>
                        <Column flexGrow={3}>
                            <HeaderCell>Purchaser Name</HeaderCell>
                            <Cell>{rowData => `${rowData.purchaserLastName}, ${rowData.purchaserFirstName}`}</Cell>
                        </Column>
                        <Column flexGrow={3}>
                            <HeaderCell># of Tickets</HeaderCell>
                            <Cell>{rowData => rowData.numTickets ? rowData.numTickets : ''}</Cell>
                        </Column>
                        <Column flexGrow={3}>
                            <HeaderCell>Order Status</HeaderCell>
                            <Cell>{rowData => getOrderStatusText(rowData as Order)}</Cell>
                        </Column>
                        <Column flexGrow={1}>
                            <HeaderCell>&nbsp;</HeaderCell>
                            <Cell>{rowData => rowData.ticketSocketOrderId ? <a href="#" id={rowData.ticketSocketOrderId} onClick={viewOrder}>Edit</a> : 'Edit'}</Cell>
                        </Column>
                    </Table>
                </Col>
            </Row>
        </div>
    );
}
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
import { GetSellersResponse, Seller, VipEvent } from "@/types/event";
import { useGetSellers } from "@/hooks/common/useGetSellers";
import router from "next/router";
import moment from "moment";
import { current } from "@reduxjs/toolkit";

export default function AdminOrdersIndex() {
    const { Column, HeaderCell, Cell } = Table;
    const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
    const currentEvent = currentAdminSelection.selectedEvent;
    const [tableLoading, setTableLoading] = useState(true);

    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

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

    return(
        <div className="admin-container">
            <Row className="admin-event-info">
                <Col><Button onClick={goBack}>Back</Button> </Col>
            </Row>
            <Row className="admin-event-info">
                <Col>
                    <h3>{currentEvent?.title}</h3>
                </Col>
            </Row>
            <Row className="admin-event-info">
                <Col>Date: {moment(currentEvent?.eventDate).format('MM/DD/YYYY')}</Col>
            </Row>
            <Row className="admin-event-info">
                <Col>Venue: {currentEvent?.venue?.name}</Col>
            </Row>
            <Row className="admin-event-info">
                <Col><h5>Orders</h5></Col>
            </Row>            
            <Row>
                <Col>
                    <Table height={420} data={currentEvent?.orders} bordered cellBordered loading={tableLoading}>
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
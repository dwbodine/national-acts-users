import { useSetOrderDeleted } from '@/hooks/useSetOrderDeleted';
import { useSetOrderInactive } from '@/hooks/useSetOrderInadtive';
import { setReloadEvents } from '@/lib/reportSelectionSlice';
import { Order } from '@/types/event';
import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';
import router from 'next/router';
import { Button, Col, Container, Row } from 'react-bootstrap';
import AttendeeRow from './attendeeRowComponent';
import { useSetOrderHidden } from '@/hooks/useSetOrderHidden';

export default function OrderMobileRow(props: any) {
    const dispatch = useDispatch();
    const eventDate = props.EventDate as string;
    const eventName = props.EventName as string;
    const order = props.Order as Order;
    const changeOrderStatus = props.ChangeOrderStatus as boolean;
    const hasPhoneData = props.HasPhoneData as boolean;
    const hasShirtData = props.HasShirtData as boolean;
    const hideRev = props.HideRevenue as boolean;
    const hideServiceFees = props.HideServiceFees as boolean;
    const canCheckInTickets = props.CanCheckInTickets as boolean;

    const { setOrderInactive } = useSetOrderInactive();
    const { setOrderDeleted } = useSetOrderDeleted();
    const { setOrderHidden } = useSetOrderHidden();
        
    let statusClass = '';
    if (order.isDeleted) {
        statusClass += 'deleted';
    }  else if (!order.isActive) {
        statusClass += 'inactive';
    } else if (order.isRefunded) {
        statusClass += 'refunded';
    } else if (order.isHidden) {
        statusClass += 'hidden';
    }

    const id = `order_${order.ticketSocketOrderId}`;
    const purchaserName = `${order.purchaserLastName}, ${order.purchaserFirstName}`;
    const purchaseDate = moment(order.purchaseTimestamp).format('MM/DD/YYYY LT');
    const revenue = `$${new Number(order.revenueUsd).toFixed(2)}`;
    const serviceFees = `$${new Number(order.serviceFeesUsd).toFixed(2)}`;

    const ticketTypeRows: any[] = [];
    if (order.tickets && order.tickets.length > 0) {
        const ticketMap = new Map<string, number>();
        order.tickets?.forEach((ticket) => {
            const item = ticketMap.get(ticket.ticketType);
            let num: number = 1;
            if (item && item > 0) {
                num = item + 1;
            } 
            ticketMap.set(ticket.ticketType, num);
            
        });
        let i = 0;
        ticketMap.forEach((tickets: Number, ticketType: string) => {
            const key = `ttr${i}`;
            ticketTypeRows.push(<div key={key}>{ticketType} ({tickets.toString()})</div>)
            i++;
        });
    }
    
    const shirtSizeRows: any[] = [];
    if (hasShirtData) {
        const shirtMap = new Map<string, number>();
        order.shirts?.forEach((shirt) => {
            const item = shirtMap.get(shirt);
            let num: number = 1;
            if (item && item > 0) {
                num = item + 1;
            } 
            shirtMap.set(shirt, num);
        });
        let i = 0;
        shirtMap.forEach((numShirts: Number, shirtSize: string) => {
            const key = `sm${i}`;
            shirtSizeRows.push(<div key={key}>{shirtSize} ({numShirts.toString()})</div>)
            i++;
        });
    }

    const attendeeNameRows: any[] = [];
    if (order.tickets && order.tickets.length > 0) {
        let i = 0;
        order.tickets.forEach((ticket) => {
            const key = `anr${i}`;
            attendeeNameRows.push(<AttendeeRow key={key} Ticket={ticket} CanCheckInTickets={canCheckInTickets} />);
            i++;
        });
    }

    const activateDeactivateOrder = () => {
        const orderId = order.ticketSocketOrderId;
        const isActive = order.isActive;
        setOrderInactive(orderId, isActive)
            .then((response) => {
                if (!response.success) {
                    if (response.statusCode == 401 || response.statusCode == 422) {
                        router.push('/logout/');
                    } else {
                        console.log(response.orderError);
                    }
                    return;
                } else {
                    dispatch(
                        setReloadEvents(true)
                    );
                    window.opener.location.reload(true);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const deleteUndeleteOrder = () => {
        const orderId = order.ticketSocketOrderId;
        const isDeleted = order.isDeleted;
        setOrderDeleted(orderId, isDeleted)
            .then((response) => {
                if (!response.success) {
                    if (response.statusCode == 401 || response.statusCode == 422) {
                        router.push('/logout/');
                    } else {
                        console.log(response.orderError);
                    }
                    return;
                } else {
                    dispatch(
                        setReloadEvents(true)
                    );
                    window.opener.location.reload(true);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const hideUnhideOrder = () => {
        if (!order.isActive || order.isDeleted) {
            return false;
        }
        const orderId = order.ticketSocketOrderId;
        const isHidden = order.isHidden ?? false;
        setOrderHidden(orderId, isHidden)
            .then((response) => {
                if (!response.success) {
                    if (response.statusCode == 401 || response.statusCode == 422) {
                        router.push('/logout/');
                    } else {
                        console.log(response.orderError);
                    }
                    return;
                } else {
                    dispatch(
                        setReloadEvents(true)
                    );
                    window.opener.location.reload(true);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };


    const inactiveLabel = order.isActive ? "Deactivate" : "Activate";
    const deletedLabel = order.isDeleted ? "Undelete" : "Delete";
    const hiddenLabel = order.isHidden ? "Unhide" : "Hide";

    return (
        <tr className={'mobile-event-card-container ' + statusClass}>
            <td>
               <Container className="mobile-event-card" id={id}>
                    <Row>
                        <Col className="mobile-bold">Purchaser Name:</Col>
                        <Col>{purchaserName}</Col>
                    </Row>
                    <Row>
                        <Col className="mobile-bold">Attendee Names:</Col>
                        <Col>{attendeeNameRows}</Col>
                    </Row>
                    <Row className="no-print">
                        <Col className="mobile-bold">Purchase Date:</Col>
                        <Col>{purchaseDate}</Col>
                    </Row>
                    <Row>
                        <Col className="mobile-bold">Event Date:</Col>
                        <Col>{moment(eventDate).format('MM/DD/YYYY')}</Col>
                    </Row>
                    <Row>
                        <Col className="mobile-bold">Event Name:</Col>
                        <Col>{eventName}</Col>
                    </Row>
                    <Row>
                        <Col className="mobile-bold">Ticket types sold:</Col>
                        <Col>
                            {ticketTypeRows}
                        </Col>
                    </Row>
                    <Row hidden={hideRev}>
                        <Col className="mobile-bold">Revenue:</Col>
                        <Col>{revenue}</Col>
                    </Row>
                    <Row hidden={hideServiceFees} className="no-print">
                        <Col className="mobile-bold">Service Fees:</Col>
                        <Col>{serviceFees}</Col>
                    </Row>
                    <Row>
                        <Col className="mobile-bold">Email:</Col>
                        <Col>{order.email}</Col>
                    </Row>
                    <Row hidden={!hasPhoneData}>
                        <Col className="mobile-bold">Phone:</Col>
                        <Col>{order.phone}</Col>
                    </Row>
                    <Row hidden={!hasShirtData}>
                        <Col className="mobile-bold">Shirts:</Col>
                        <Col>{shirtSizeRows}</Col>
                    </Row>
                    <Row className="no-print" hidden={!changeOrderStatus}>
                        <Col>
                            <Button onClick={activateDeactivateOrder}>{inactiveLabel}</Button>
                            <Button onClick={deleteUndeleteOrder}>{deletedLabel}</Button>
                            <Button onClick={hideUnhideOrder}>{hiddenLabel}</Button>
                        </Col>
                    </Row>
               </Container>
            </td>
        </tr>
    );
}
import { useSetOrderDeleted } from '@/hooks/useSetOrderDeleted';
import { useSetOrderInactive } from '@/hooks/useSetOrderInadtive';
import { setEvents, setReloadEvents } from '@/lib/reportSelectionSlice';
import { Order } from '@/types/event';
import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';
import router from 'next/router';
import { Button, Col, Container, Row } from 'react-bootstrap';

export default function OrderMobileRow(props: any) {
    const dispatch = useDispatch();
    const eventDate = props.EventDate as string;
    const eventName = props.EventName as string;
    const order = props.Order as Order;
    const isAdmin = props.IsAdmin as boolean;
    const hasPhoneData = props.HasPhoneData as boolean;
    const hasShirtData = props.HasShirtData as boolean;
    const hideRev = props.HideRevenue as boolean;
    const hideServiceFees = props.HideServiceFees as boolean;

    const { setOrderInactive } = useSetOrderInactive();
    const { setOrderDeleted } = useSetOrderDeleted();
        
    let statusClass = '';
    if (order.isDeleted) {
        statusClass += 'deleted';
    }  else if (!order.isActive) {
        statusClass += 'inactive';
    } else if (order.isRefunded) {
        statusClass += 'refunded';
    }

   
    const purchaserName = `${order.purchaserLastName}, ${order.purchaserFirstName}`;
    const purchaseDate = moment(order.purchaseTimestamp).format('MM/DD/YYYY LT');
    const revenue = new Number(order.revenueUsd).toFixed(2);
    const serviceFees = new Number(order.serviceFeesUsd).toFixed(2);

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
    if (order.attendeeNames && order.attendeeNames.length > 0) {
        let i = 0;
        order.attendeeNames.forEach((name) => {
            const key = `anr${i}`;
            attendeeNameRows.push(<div key={key}>{name}</div>);
            i++;
        });
    }

    const activateDeactivateOrder = () => {
        const orderId = order.ticketSocketOrderId;
        const isActive = order.isActive;
        setOrderInactive(orderId, isActive)
            .then((response) => {
                if (!response.success) {
                    if (response.statusCode == 401) {
                        router.push('/logout');
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
                    if (response.statusCode == 401) {
                        router.push('/logout');
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

    return (
        <tr className={'mobile-event-card-container ' + statusClass}>
            <td>
               <Container className="mobile-event-card">
                    <Row>
                        <Col className="mobile-bold">Purchaser Name:</Col>
                        <Col>{purchaserName}</Col>
                    </Row>
                    <Row>
                        <Col className="mobile-bold">Attendee Names:</Col>
                        <Col className="attendee">{attendeeNameRows}</Col>
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
                        <Col className="mobile-bold">Revenue (USD):</Col>
                        <Col>${revenue}</Col>
                    </Row>
                    <Row hidden={hideServiceFees || !isAdmin} className="no-print">
                        <Col className="mobile-bold">Service Fees:</Col>
                        <Col>${serviceFees}</Col>
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
                    <Row className="no-print" hidden={!isAdmin}>
                        <Col>
                            <Button onClick={activateDeactivateOrder}>{inactiveLabel}</Button>
                            <Button onClick={deleteUndeleteOrder}>{deletedLabel}</Button>
                        </Col>
                    </Row>
               </Container>
            </td>
        </tr>
    );
}
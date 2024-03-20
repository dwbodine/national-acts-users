import { useSetOrderDeleted } from '@/hooks/useSetOrderDeleted';
import { useSetOrderInactive } from '@/hooks/useSetOrderInadtive';
import { setEvents } from '@/lib/reportSelectionSlice';
import { Order } from '@/types/event';
import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';

export default function OrderRow(props: any) {
    const dispatch = useDispatch();
    const eventDate = props.EventDate as string;
    const eventName = props.EventName as string;
    const order = props.Order as Order;
    const isAdmin = props.IsAdmin as boolean;
    const hasPhoneData = props.HasPhoneData as boolean;
    const hasShirtData = props.HasShirtData as boolean;

    const { setOrderInactive } = useSetOrderInactive();
    const { setOrderDeleted } = useSetOrderDeleted();
        
    let statusClass = '';
    if (order.isDeleted) {
        statusClass += 'deleted';
    } else if (!order.isActive) {
        statusClass += 'inactive';
    }

   
    const purchaserName = `${order.purchaserLastName}, ${order.purchaserFirstName}`;
    const purchaseDate = moment(order.purchaseTimestamp).format('MM/DD/YYYY LT');
    const revenue = new Number(order.revenueUsd).toFixed(2);

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
        ticketMap.forEach((value: Number, key: string) => {
            ticketTypeRows.push(<div>{key} ({value.toString()})</div>)
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
        shirtMap.forEach((value: Number, key: string) => {
            shirtSizeRows.push(<div>{key} ({value.toString()})</div>)
        });
    }

    const attendeeNameRows: any[] = [];
    if (order.attendeeNames && order.attendeeNames.length > 0) {
        order.attendeeNames.forEach((name) => {
            attendeeNameRows.push(<div>{name}</div>);
        });
    }

    const activateDeactivateOrder = () => {
        const orderId = order.ticketSocketOrderId;
        const isActive = order.isActive;
        setOrderInactive(orderId, isActive)
            .then((response) => {
                if (!response.success) {
                    console.log(response.orderError);
                    return;
                } else {
                    dispatch(
                        setEvents()
                    )
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
                    console.log(response.orderError);
                    return;
                } else {
                    dispatch(
                        setEvents()
                    )
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };


    const inactiveLabel = order.isActive ? "Deactivate" : "Activate";
    const deletedLabel = order.isDeleted ? "Undelete" : "Delete";

    return (
        <tr className={statusClass}>
            <td>{purchaserName}</td>
            <td>{attendeeNameRows}</td>
            <td>{purchaseDate}</td>
            <td>{moment(eventDate).format('MM/DD/YYYY')}</td>
            <td>{eventName}</td>
            <td>{ticketTypeRows}</td>
            <td>{order.numTickets}</td>
            <td className="pull-right">{revenue}</td>
            <td>{order.email}</td>
            { hasPhoneData ? <td>{order.phone}</td> : ''}
            { hasShirtData ? <td>{shirtSizeRows}</td> : ''}
            { isAdmin ? <td><a onClick={activateDeactivateOrder}>{inactiveLabel}</a></td> : ''}
            { isAdmin ? <td><a onClick={deleteUndeleteOrder}>{deletedLabel}</a></td> : ''}
        </tr>
    );
}
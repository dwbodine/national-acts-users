import { useSetOrderDeleted } from '@/hooks/useSetOrderDeleted';
import { useSetOrderInactive } from '@/hooks/useSetOrderInadtive';
import { setReloadEvents } from '@/lib/reportSelectionSlice';
import { Order } from '@/types/event';
import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';
import router from 'next/router';
import AttendeeRow from './attendeeRowComponent';

export default function OrderRow(props: any) {
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
    const ordinal = props.Ordinal as number;

    const { setOrderInactive } = useSetOrderInactive();
    const { setOrderDeleted } = useSetOrderDeleted();
        
    let statusClass = (ordinal % 2 != 0) ? 'order-row ' : '';
    if (order.isDeleted) {
        statusClass += 'deleted';
    }  else if (!order.isActive) {
        statusClass += 'inactive';
    } else if (order.isRefunded) {
        statusClass += 'refunded';
    }

    const id = `order_${order.ticketSocketOrderId}`;
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
    const rowSpan = attendeeNameRows?.length ?? 0;

    return (
        attendeeNameRows.map((row, i) => {
            const key = `arr${i}`;
            if (i == 0) {
                return (<tr className={statusClass} key={key}>
                    <td rowSpan={rowSpan}>{purchaserName}</td>
                    {row}
                    <td rowSpan={rowSpan} className="no-print">{purchaseDate}</td>
                    <td rowSpan={rowSpan}>{moment(eventDate).format('MM/DD/YYYY')}</td>
                    <td rowSpan={rowSpan}>{eventName}</td>
                    <td rowSpan={rowSpan}>{ticketTypeRows}</td>
                    <td rowSpan={rowSpan}>{order.numTickets}</td>
                    <td rowSpan={rowSpan} className="pull-right" hidden={hideRev}>{revenue}</td>
                    <td rowSpan={rowSpan} className="pull-right no-print" hidden={hideServiceFees}>{serviceFees}</td>            
                    <td rowSpan={rowSpan} className="email">{order.email}</td>
                    { hasPhoneData ? <td rowSpan={rowSpan}>{order.phone}</td> : ''}
                    { hasShirtData ? <td rowSpan={rowSpan}>{shirtSizeRows}</td> : ''}
                    { changeOrderStatus ? <td rowSpan={rowSpan} className="no-print"><a onClick={activateDeactivateOrder}>{inactiveLabel}</a></td> : ''}
                    { changeOrderStatus ? <td rowSpan={rowSpan} className="no-print"><a onClick={deleteUndeleteOrder}>{deletedLabel}</a></td> : ''}
                </tr>);
            } else {
                return (
                    <tr className={statusClass} key={key}>
                        {row}
                    </tr>
                );
                
            }
        }));
}
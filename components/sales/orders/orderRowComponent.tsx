import { useSetOrderDeleted } from '@/hooks/order/useSetOrderDeleted';
import { useSetOrderInactive } from '@/hooks/order/useSetOrderInactive';
import { setReloadEvents } from '@/lib/reportSelectionSlice';
import { Order } from '@/types/event';
import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';
import router from 'next/router';
import AttendeeRow from './attendeeRowComponent';
import { useSetOrderHidden } from '@/hooks/order/useSetOrderHidden';

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
        <tr className={statusClass}>
            <td>{purchaserName}</td>
            <td>{attendeeNameRows}</td>
            <td className="purchase-date no-print">{purchaseDate}</td>
            <td>{moment(eventDate).format('MM/DD/YYYY')}</td>
            <td>{eventName}</td>
            <td>{ticketTypeRows}</td>
            <td>{order.numTickets}</td>
            <td className="pull-right" hidden={hideRev}>{revenue}</td>
            <td className="pull-right no-print" hidden={hideServiceFees}>{serviceFees}</td>            
            <td className="email">{order.email}</td>
            { hasPhoneData ? <td>{order.phone}</td> : ''}
            { hasShirtData ? <td>{shirtSizeRows}</td> : ''}
            { changeOrderStatus ? <td className="command-column no-print"><a onClick={activateDeactivateOrder}>{inactiveLabel}</a></td> : ''}
            { changeOrderStatus ? <td className="command-column no-print"><a onClick={deleteUndeleteOrder}>{deletedLabel}</a></td> : ''}
            { changeOrderStatus ? <td className="command-column no-print"><a onClick={hideUnhideOrder}>{hiddenLabel}</a></td> : ''}
        </tr>
    );
}
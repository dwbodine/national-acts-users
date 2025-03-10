import { Order, TicketType } from '@/types/event';
import moment from 'moment';
import React from 'react';
import AttendeeRow from './attendeeRowComponent';

export default function OrderRow(props: any) {
  const ticketTypes = props.TicketTypes as TicketType[] | undefined;
  const eventDate = props.EventDate as string;
  const eventName = props.EventName as string;
  const order = props.Order as Order;
  const hasPhoneData = props.HasPhoneData as boolean;
  const hasShirtData = ((order.totalShirts ?? 0) > 0);
  const hideRev = props.HideRevenue as boolean;
  const hideServiceFees = props.HideServiceFees as boolean;
  const canCheckInTickets = props.CanCheckInTickets as boolean;
  const showOnlyEmails = props.ShowOnlyEmails as boolean;
  const showOnlyPhones = props.ShowOnlyPhones as boolean;

  let statusClass = '';
  if (order.isDeleted) {
    statusClass += 'deleted';
  } else if (!order.isActive) {
    statusClass += 'inactive';
  } else if (order.hasRefunds) {
    statusClass += 'refunded';
  }

  const id = `order_${order.ticketSocketOrderId}`;
  const purchaserName = `${order.purchaserLastName}, ${order.purchaserFirstName}`;
  const purchaseDate = order.purchaseTimestamp ? moment(order.purchaseTimestamp).format('MM/DD/YYYY LT') : 'n/a';
  const revenue = new Number(order.revenueUsd - (order.revenueRefundedUsd ?? 0)).toFixed(2);
  const serviceFees = new Number((order.serviceFeesUsd ?? 0) - (order.serviceFeeRevenueRefundedUsd ?? 0)).toFixed(2);

  const ticketTypeRows: any[] = [];

  if (order.tickets && order.tickets.length > 0) {
    const ticketMap = new Map<string, number>();
    order.tickets?.forEach((ticket) => {
      let ticketTypeName = ticket.ticketType;
      const ticketType = ticketTypes?.find(t => t.ticketTypeId == ticket.ticketTypeId);
      if (ticketType) {
        ticketTypeName = ticketType.ticketTypeName;
      }
      const item = ticketMap.get(ticketTypeName);
      let num: number = 1;
      if (item && item > 0) {
        num = item + 1;
      }
      ticketMap.set(ticketTypeName, num);
    });
    let i = 0;
    ticketMap.forEach((tickets: number, ticketType: string) => {
      const key = `ttr${i}`;
      ticketTypeRows.push(
        <div key={key}>
          {ticketType} ({tickets.toString()})
        </div>,
      );
      i++;
    });
  }

  const shirtSizeRows: any[] = [];
  if (hasShirtData) {
    const shirtMap = new Map<string, number>();
    order.tickets?.forEach((ticket) => {
      if (ticket.shirtSize) {
        const item = shirtMap.get(ticket.shirtSize);
        let num: number = 1;
        if (item && item > 0) {
          num = item + 1;
        }
        shirtMap.set(ticket.shirtSize, num);
      }      
    });
    let i = 0;
    
    shirtMap.forEach((numShirts: number, shirtSize: string) => {
      const key = `sm${i}`;
      shirtSizeRows.push(
        <div key={key}>
          {shirtSize} ({numShirts.toString()})
        </div>,
      );
      i++;
    });
  }

  const attendeeNameRows: any[] = [];
  if (order.tickets && order.tickets.length > 0) {
    order.tickets.forEach((ticket, i) => {
      const key = `anr${i}`;
      attendeeNameRows.push(
        <AttendeeRow key={key} Ticket={ticket} CanCheckInTickets={canCheckInTickets} />,
      );
    });
  }

  return (
    <tr className={statusClass}>
      <td hidden={showOnlyEmails || showOnlyPhones}>{purchaserName}</td>
      <td hidden={showOnlyEmails || showOnlyPhones}>{attendeeNameRows}</td>
      <td hidden={showOnlyEmails || showOnlyPhones} className="purchase-date no-print">{purchaseDate}</td>
      <td hidden={showOnlyEmails || showOnlyPhones}>{moment(eventDate).format('MM/DD/YYYY')}</td>
      <td hidden={showOnlyEmails || showOnlyPhones}>{eventName}</td>
      <td hidden={showOnlyEmails || showOnlyPhones}>{ticketTypeRows}</td>
      <td hidden={showOnlyEmails || showOnlyPhones}>{order.numTickets}</td>
      <td className="pull-right" hidden={hideRev || showOnlyEmails || showOnlyPhones}>
        {revenue}
      </td>
      <td className="pull-right no-print" hidden={hideServiceFees || showOnlyEmails || showOnlyPhones}>
        {serviceFees}
      </td>
      <td hidden={showOnlyPhones} className="email">{order.email}</td>
      {hasPhoneData && !showOnlyEmails ? <td>{order.phone}</td> : ''}
      {hasShirtData && !(showOnlyEmails || showOnlyPhones) ? <td>{shirtSizeRows}</td> : ''}
    </tr>
  );
}

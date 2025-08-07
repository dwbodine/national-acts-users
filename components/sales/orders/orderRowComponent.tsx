import React, { ReactElement } from 'react';
import AttendeeRow from './attendeeRowComponent';
import { OrderRowProps } from '@/types/props';
import { getOrderStatusText } from '@/utils/eventUtils';
import moment from 'moment';

export default function OrderRow(props: OrderRowProps) {
  const ticketTypes = props.TicketTypes;
  const eventDate = props.EventDate;
  const eventName = props.EventName;
  const order = props.Order;
  const hasPhoneData = props.HasPhoneData;
  const hasShirtData = ((order?.totalShirts ?? 0) > 0);
  const hideRev = props.HideRevenue;
  const hideServiceFees = props.HideServiceFees;
  const canCheckInTickets = props.CanCheckInTickets;
  const showOnlyEmails = props.ShowOnlyEmails;
  const showOnlyPhones = props.ShowOnlyPhones;

  let statusClass = '';
  if (order?.isDeleted) {
    statusClass += 'deleted';
  } else if (!order?.isActive) {
    statusClass += 'inactive';
  } else if (order?.hasRefunds) {
    statusClass += 'refunded';
  }

  const orderStatus = getOrderStatusText(order);
  const orderId = order?.orderId;

  const purchaserName = `${order?.purchaserLastName}, ${order?.purchaserFirstName}`;
  const purchaseDate = order?.purchaseTimestamp ? moment(order.purchaseTimestamp).format('MM/DD/YYYY LT') : 'n/a';
  const revenue = Number((order?.revenueUsd ?? 0) - (order?.revenueRefundedUsd ?? 0)).toFixed(2);
  const serviceFees = Number((order?.serviceFeesUsd ?? 0) - (order?.serviceFeeRevenueRefundedUsd ?? 0)).toFixed(2);

  const ticketTypeRows: ReactElement[] = [];

  if (order?.tickets && order.tickets.length > 0) {
    const ticketMap = new Map<string, number>();
    order.tickets?.forEach((ticket) => {
      let ticketTypeName = ticket.ticketType;
      const ticketType = ticketTypes?.find(t => t.ticketTypeId === ticket.ticketTypeId);
      if (ticketType) {
        ({ ticketTypeName } = ticketType);
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
      i += 1;
    });
  }

  const shirtSizeRows: ReactElement[] = [];
  if (hasShirtData) {
    const shirtMap = new Map<string, number>();
    order?.tickets?.forEach((ticket) => {
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
      i += 1;
    });
  }

  const attendeeNameRows: ReactElement[] = [];
  if (order?.tickets && order.tickets.length > 0) {
    order.tickets.forEach((ticket, i) => {
      const key = `anr${i}`;
      attendeeNameRows.push(
        <AttendeeRow key={key} Ticket={ticket} CanCheckInTickets={canCheckInTickets} />,
      );
    });
  }

  const phone = order?.phone?.startsWith("+1 ") ?
    order.phone.replace("+1 ", "") : order?.phone;

  return (
    <tr className={statusClass}>
      <td hidden={showOnlyEmails || showOnlyPhones}>{purchaserName}</td>
      <td hidden={showOnlyEmails || showOnlyPhones}>{attendeeNameRows}</td>
      <td hidden={showOnlyEmails || showOnlyPhones} className="purchase-date no-print">{purchaseDate}</td>
      <td hidden={showOnlyEmails || showOnlyPhones}>{orderId}</td>
      <td hidden={showOnlyEmails || showOnlyPhones}>{orderStatus}</td>
      <td hidden={showOnlyEmails || showOnlyPhones}>{moment(eventDate).format('MM/DD/YYYY')}</td>
      <td hidden={showOnlyEmails || showOnlyPhones}>{eventName}</td>
      <td hidden={showOnlyEmails || showOnlyPhones}>{ticketTypeRows}</td>
      <td hidden={showOnlyEmails || showOnlyPhones}>{order?.numTickets}</td>
      <td className="pull-right" hidden={hideRev || showOnlyEmails || showOnlyPhones}>
        {revenue}
      </td>
      <td className="pull-right no-print" hidden={hideServiceFees || showOnlyEmails || showOnlyPhones}>
        {serviceFees}
      </td>
      <td hidden={showOnlyPhones} className="email">{order?.email}</td>
      {hasPhoneData && !showOnlyEmails ? <td>{phone}</td> : ''}
      {hasShirtData && !(showOnlyEmails || showOnlyPhones) ? <td>{shirtSizeRows}</td> : ''}
    </tr>
  );
}

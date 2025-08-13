"use client";

import { Col, Container, Row } from 'react-bootstrap';
import React, { ReactElement } from 'react';
import AttendeeRow from './attendeeRowComponent';
import { OrderRowProps } from '@/types/props';
import { getOrderStatusText } from '@/utils/eventUtils';
import moment from 'moment';

export default function OrderMobileRow(props: OrderRowProps) {
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
  const isAdmin = props.IsAdmin;

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

  const id = `order_${order?.ticketSocketOrderId}`;
  const purchaserName = `${order?.purchaserLastName}, ${order?.purchaserFirstName}`;
  const purchaseDate = order?.purchaseTimestamp ? moment(order.purchaseTimestamp).format('MM/DD/YYYY LT') : 'n/a';
  const revenue = `$${Number((order?.revenueUsd ?? 0) - (order?.revenueRefundedUsd ?? 0)).toFixed(2)}`;
  const serviceFees = `$${Number((order?.serviceFeesUsd ?? 0) - (order?.serviceFeeRevenueRefundedUsd ?? 0)).toFixed(2)}`;

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
      if (tickets > 0 || isAdmin) {
        ticketTypeRows.push(
          <div key={key}>
            {ticketType} ({tickets.toString()})
          </div>,
        );
      }
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
    let i = 0;
    order.tickets.forEach((ticket) => {
      const key = `anr${i}`;
      attendeeNameRows.push(
        <AttendeeRow key={key} Ticket={ticket} CanCheckInTickets={canCheckInTickets} />,
      );
      i += 1;
    });
  }

  const phone = order?.phone?.startsWith("+1 ") ?
    order.phone.replace("+1 ", "") : order?.phone;

  return (
    <tr className={`mobile-event-card-container ${statusClass}`}>
      <td>
        <Container className="mobile-event-card" id={id}>
          <Row hidden={showOnlyEmails || showOnlyPhones}>
            <Col xs={5} className="mobile-bold">Purchaser Name:</Col>
            <Col>{purchaserName}</Col>
          </Row>
          <Row hidden={showOnlyEmails || showOnlyPhones}>
            <Col xs={5} className="mobile-bold">Attendee Names:</Col>
            <Col>{attendeeNameRows}</Col>
          </Row>
          <Row hidden={showOnlyEmails || showOnlyPhones} className="no-print">
            <Col xs={5} className="mobile-bold">Purchase Date:</Col>
            <Col>{purchaseDate}</Col>
          </Row>
          <Row hidden={showOnlyEmails || showOnlyPhones}>
            <Col xs={5} className="mobile-bold">Order Id:</Col>
            <Col>{orderId}</Col>
          </Row>
          <Row hidden={showOnlyEmails || showOnlyPhones}>
            <Col xs={5} className="mobile-bold">Order Status:</Col>
            <Col>{orderStatus}</Col>
          </Row>
          <Row hidden={showOnlyEmails || showOnlyPhones}>
            <Col xs={5} className="mobile-bold">Event Date:</Col>
            <Col>{moment(eventDate).format('MM/DD/YYYY')}</Col>
          </Row>
          <Row hidden={showOnlyEmails || showOnlyPhones}>
            <Col xs={5} className="mobile-bold">Event Name:</Col>
            <Col>{eventName}</Col>
          </Row>
          <Row hidden={ticketTypeRows.length === 0 || showOnlyEmails || showOnlyPhones}>
            <Col xs={5} className="mobile-bold">Ticket breakdown:</Col>
            <Col>{ticketTypeRows}</Col>
          </Row>
          <Row hidden={hideRev || showOnlyEmails || showOnlyPhones}>
            <Col xs={5} className="mobile-bold">Revenue:</Col>
            <Col>{revenue}</Col>
          </Row>
          <Row hidden={hideServiceFees || showOnlyEmails || showOnlyPhones} className="no-print">
            <Col xs={5} className="mobile-bold">Service Fees:</Col>
            <Col>{serviceFees}</Col>
          </Row>
          <Row hidden={showOnlyPhones}>
            <Col xs={5} className="mobile-bold">Email:</Col>
            <Col>{order?.email}</Col>
          </Row>
          <Row hidden={!hasPhoneData || showOnlyEmails}>
            <Col xs={5} className="mobile-bold">Phone:</Col>
            <Col>{phone}</Col>
          </Row>
          <Row hidden={!hasShirtData || (showOnlyEmails || showOnlyPhones)}>
            <Col xs={5} className="mobile-bold">Shirts:</Col>
            <Col>{shirtSizeRows}</Col>
          </Row>
        </Container>
      </td>
    </tr>
  );
}

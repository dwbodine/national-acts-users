import { Order, TicketType } from '@/types/event';
import moment from 'moment';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import AttendeeRow from './attendeeRowComponent';

export default function OrderMobileRow(props: any) {
  const ticketTypes = props.TicketTypes as TicketType[] | undefined;
  const eventDate = props.EventDate as string;
  const eventName = props.EventName as string;
  const order = props.Order as Order;
  const hasPhoneData = props.HasPhoneData as boolean;
  const hasShirtData = props.HasShirtData as boolean;
  const hideRev = props.HideRevenue as boolean;
  const hideServiceFees = props.HideServiceFees as boolean;
  const canCheckInTickets = props.CanCheckInTickets as boolean;

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
  const revenue = `$${new Number(order.revenueUsd - (order.revenueRefundedUsd ?? 0)).toFixed(2)}`;
  const serviceFees = `$${new Number((order.serviceFeesUsd ?? 0) - (order.serviceFeeRevenueRefundedUsd ?? 0)).toFixed(2)}`;

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
    ticketMap.forEach((tickets: Number, ticketType: string) => {
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
    shirtMap.forEach((numShirts: Number, shirtSize: string) => {
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
    let i = 0;
    order.tickets.forEach((ticket) => {
      const key = `anr${i}`;
      attendeeNameRows.push(
        <AttendeeRow key={key} Ticket={ticket} CanCheckInTickets={canCheckInTickets} />,
      );
      i++;
    });
  }

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
            <Col className="mobile-bold">Ticket type breakdown:</Col>
            <Col>{ticketTypeRows}</Col>
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
        </Container>
      </td>
    </tr>
  );
}

import { Button, Col, Container, Row } from 'react-bootstrap';
import { ITicketTypeData, SellerType, TicketType } from '@/types/event';
import React, { ReactElement } from 'react';
import { formatCurrencyAmount, getEventStatusSlug } from '@/utils/eventUtils';
import { EventRowProps } from '@/types/props';
import { RootState } from '@/lib/store';
import getTicketDataFromEvents from '@/utils/getTicketDataFromEvents';
import moment from 'moment';
import { useGetLocation } from '@/hooks/common/useGetLocation';
import { useSelector } from 'react-redux';

export default function EventMobileRow(props: EventRowProps) {
  const vipEvent = props.VipEvent;
  const hideRevItem = props.HideRevenue;
  const hideServiceFees = props.HideServiceFees;
  const canCheckInTickets = props.CanCheckInTickets;
  const showNotes = props.ShowNotes;
  const showNoteDialog = props.OnShowNoteDialog;
  const { getLocation } = useGetLocation();
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
  const currentSellerType = currentReportSelection.seller.sellerType;
  const id = `event_${vipEvent.externalEventId}`;
  const isAdmin = props.IsAdmin;

  const setDetailEvent = () => {
    const url = `/event/?id=${vipEvent.externalEventId}`;
    window.open(url, '_blank');
  };

  const statusSlug = getEventStatusSlug(vipEvent);
  let statusClass = '';
  if (statusSlug !== 'active') {
    statusClass = `event-${statusSlug}`
  }

  const venueName = vipEvent.venue?.name;
  let location = '';
  if (vipEvent.venue) {
    location = getLocation(vipEvent.venue);
  }

  const ticketBreakdownRows: ReactElement[] = [];
  const ticketData = getTicketDataFromEvents([vipEvent]);
  const ticketTypes = ticketData?.TicketTypes;
  if (ticketTypes?.length > 0) {
    let i = 0;
    ticketData.TicketData?.forEach((ticketTypeData: ITicketTypeData[]) => {
      ticketTypes.forEach((ticketType: TicketType) => {
        const key = `ttd${i}`;
        const data = ticketTypeData.find((x) => x.TicketType === ticketType.ticketTypeName);
        let number = 0;
        let total = '';
        if (data) {
          number = data.Number;
        }
        if (ticketType.totalAvailable > 0) {
          total = `/${ticketType.totalAvailable}`;
        }
        if (number > 0 || isAdmin) {
          ticketBreakdownRows.push(
            <div className="ticket-type" key={key}>
              {ticketType.ticketTypeName} ({number}
              {total})
            </div>,
          );
        }        
        i += 1;
      });
    });
  }

  const currencySymbol = vipEvent.nonUsaCurrencySymbol ?? "$";
  const exchangeRate = currencySymbol === "$" ? 1 : 0;
  const eventDate = moment(vipEvent.eventDate).format('MM/DD/YYYY');
  const revenue = Number((vipEvent.totalRevenue ?? 0) - (vipEvent.revenueRefunded ?? 0));
  const revenueUsd = Number((vipEvent.totalRevenueUsd ?? 0) - (vipEvent.revenueRefundedUsd ?? 0));
  const serviceFees = Number((vipEvent.totalServiceFees ?? 0) - (vipEvent.serviceFeeRevenueRefunded ?? 0));
  const serviceFeesUsd = Number((vipEvent.totalServiceFeesUsd ?? 0) - (vipEvent.serviceFeeRevenueRefundedUsd ?? 0));
  const buttonText = currentSellerType === SellerType.Venue ? 'Customer List' : 'VIP List';
  const noOrders = (!vipEvent.orders || vipEvent.orders.length === 0);

  const revClass = hideRevItem ? 'no-print' : '';

  return (
    <tr className={`mobile-event-card-container ${statusClass}`}>
      <td>
        <Container className="mobile-event-card" id={id}>
          <Row>
            <Col>Date:</Col>
            <Col>{eventDate}</Col>
          </Row>
          <Row>
            <Col>Title:</Col>
            <Col>{vipEvent.title}</Col>
          </Row>
          <Row>
            <Col>Venue:</Col>
            <Col>{venueName}</Col>
          </Row>
          <Row>
            <Col>Location:</Col>
            <Col>{location}</Col>
          </Row>
          <Row>
            <Col>Tickets sold:</Col>
            <Col>{vipEvent.totalTickets}</Col>
          </Row>
          <Row>
            <Col>Tickets refunded:</Col>
            <Col>{(vipEvent.numTicketsRefunded ?? 0)}</Col>
          </Row>
          <Row>
            <Col>Tickets comped:</Col>
            <Col>{vipEvent.numTicketsComped}</Col>
          </Row>
          <Row hidden={!canCheckInTickets} className="no-print">
            <Col>Checked in:</Col>
            <Col>
              {vipEvent.totalCheckedIn} / {vipEvent.totalTickets}
            </Col>
          </Row>
          <Row hidden={ticketBreakdownRows.length === 0}>
            <Col>Ticket type breakdown:</Col>
            <Col>{ticketBreakdownRows}</Col>
          </Row>
          <Row hidden={hideRevItem} className={revClass}>
            <Col>Revenue:</Col>
            <Col>{formatCurrencyAmount(revenue, revenueUsd, currencySymbol, exchangeRate, isAdmin)}</Col>
          </Row>
          <Row hidden={hideServiceFees} className="no-print">
            <Col>Service Fees:</Col>
            <Col>{formatCurrencyAmount(serviceFees, serviceFeesUsd, currencySymbol, exchangeRate, isAdmin)}</Col>
          </Row>
          <Row hidden={noOrders}>
            <Col>
              <Button onClick={setDetailEvent}>{buttonText}</Button>
            </Col>
          </Row>
          <Row hidden={!showNotes}>
            <Col>
              <Button onClick={() => showNoteDialog ? showNoteDialog(vipEvent.externalEventId): null}>Notes</Button>
            </Col>
          </Row>
        </Container>
      </td>
    </tr>
  );
}

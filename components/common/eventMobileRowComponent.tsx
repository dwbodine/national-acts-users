import { ITicketTypeData, SellerType, TicketType, VipEvent } from '@/types/event';
import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useGetLocation } from '@/hooks/common/useGetLocation';
import { RootState } from '@/lib/store';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { getTicketDataFromEvents } from '@/utils/getTicketDataFromEvents';
import { useGetEventStatus } from '@/hooks/common/useGetEventStatus';

export default function EventMobileRow(props: any) {
  const vipEvent = props.VipEvent as VipEvent;
  const hideRevItem = props.HideRevenue as boolean;
  const hideServiceFees = props.HideServiceFees as boolean;
  const canCheckInTickets = props.CanCheckInTickets as boolean;
  const showNotes = props.ShowNotes as boolean;
  const showNoteDialog = props.OnShowNoteDialog;
  const { getLocation } = useGetLocation();
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
  const currentSellerType = currentReportSelection.seller.sellerType;
  const id = `event_${vipEvent.ticketSocketEventId}`;
  const { getEventStatusText, getEventStatusSlug } = useGetEventStatus();
  const isAdmin = props.IsAdmin as boolean;

  const setDetailEvent = () => {
    const url = `/event/?id=${vipEvent.ticketSocketEventId}`;
    window.open(url, '_blank');
  };

  const statusSlug = getEventStatusSlug(vipEvent);
  let statusClass = '';
  if (statusSlug != 'active') {
    statusClass = `event-${statusSlug}`
  }

  const venueName = vipEvent.venue?.name;
  let location = '';
  if (vipEvent.venue) {
    location = getLocation(vipEvent.venue);
  }

  const ticketBreakdownRows: any[] = [];
  let hasTicketData = false;
  const ticketData = getTicketDataFromEvents([vipEvent]);
  const ticketTypes = ticketData?.TicketTypes;
  if (ticketTypes?.length > 0) {
    hasTicketData = true;
    let i = 0;
    ticketData.TicketData?.forEach((ticketTypeData: ITicketTypeData[]) => {
      ticketTypes.forEach((ticketType: TicketType) => {
        const key = `ttd${i}`;
        var data = ticketTypeData.find((x) => x.TicketType == ticketType.ticketTypeName);
        var number = 0;
        var total = '';
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
        i++;
      });
    });
  }

  const eventDate = moment(vipEvent.eventDate).format('MM/DD/YYYY');
  const revenue = `$${new Number(vipEvent.totalRevenue - (vipEvent.revenueRefunded ?? 0)).toFixed(2)}`;
  const serviceFees = `$${new Number(vipEvent.totalServiceFees - (vipEvent.serviceFeeRevenueRefunded ?? 0)).toFixed(2)}`;
  const buttonText = currentSellerType == SellerType.Venue ? 'Customer List' : 'VIP List';
  const noOrders = (!vipEvent.orders || vipEvent.orders.length == 0);

  return (
    <tr className={'mobile-event-card-container ' + statusClass}>
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
            <Col>Tickets comped:</Col>
            <Col>{vipEvent.numTicketsComped}</Col>
          </Row>
          <Row hidden={!canCheckInTickets} className="no-print">
            <Col>Checked in:</Col>
            <Col>
              {vipEvent.totalCheckedIn} / {vipEvent.totalTickets}
            </Col>
          </Row>
          <Row hidden={ticketBreakdownRows.length == 0}>
            <Col>Ticket type breakdown:</Col>
            <Col>{ticketBreakdownRows}</Col>
          </Row>
          <Row hidden={hideRevItem}>
            <Col>Revenue:</Col>
            <Col>{revenue}</Col>
          </Row>
          <Row hidden={hideServiceFees} className="no-print">
            <Col>Service Fees:</Col>
            <Col>{serviceFees}</Col>
          </Row>
          <Row hidden={noOrders}>
            <Col>
              <Button onClick={setDetailEvent}>{buttonText}</Button>
            </Col>
          </Row>
          <Row hidden={!showNotes}>
            <Col>
              <Button onClick={() => showNoteDialog(vipEvent.ticketSocketEventId)}>Notes</Button>
            </Col>
          </Row>
        </Container>
      </td>
    </tr>
  );
}

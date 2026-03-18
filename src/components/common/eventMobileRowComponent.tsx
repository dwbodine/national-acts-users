'use client';

import moment from 'moment';
import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Button, Col, Container, Row } from 'rsuite';

import { useGetLocation } from '@/hooks/common/useGetLocation';
import { RootState } from '@/lib/store';
import { ITicketTypeData, SellerType, TicketType } from '@/types/event';
import { EventRowProps } from '@/types/props';
import { formatCurrencyAmount, getEventStatusSlug } from '@/utils/eventUtils';
import getTicketDataFromEvents from '@/utils/getTicketDataFromEvents';

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

  const setDetailEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const url = `/event/?id=${vipEvent.externalEventId}`;
    window.open(url, '_blank');
  };

  const statusSlug = getEventStatusSlug(vipEvent);
  let statusClass = '';
  if (statusSlug !== 'active') {
    statusClass = `event-${statusSlug}`;
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

  const currencySymbol = vipEvent.nonUsaCurrencySymbol ?? '$';
  const exchangeRate = currencySymbol === '$' ? 1 : 0;
  const eventDate = moment(vipEvent.eventDate).format('MM/DD/YYYY');
  const revenue = Number((vipEvent.totalRevenue ?? 0) - (vipEvent.revenueRefunded ?? 0));
  const netRevenue = revenue - Number(revenue * (vipEvent.sellerRatePercent ?? 0));
  const revenueUsd = Number((vipEvent.totalRevenueUsd ?? 0) - (vipEvent.revenueRefundedUsd ?? 0));
  const netRevenueUsd = revenueUsd - Number(revenueUsd * (vipEvent.sellerRatePercent ?? 0));
  const serviceFees = Number(
    (vipEvent.totalServiceFees ?? 0) - (vipEvent.serviceFeeRevenueRefunded ?? 0),
  );
  const serviceFeesUsd = Number(
    (vipEvent.totalServiceFeesUsd ?? 0) - (vipEvent.serviceFeeRevenueRefundedUsd ?? 0),
  );
  const buttonText = currentSellerType === SellerType.Venue ? 'Customer List' : 'VIP List';
  const noOrders = !vipEvent.orders || vipEvent.orders.length === 0;

  const revClass = hideRevItem ? 'no-print' : '';

  return (
    <tr className={`mobile-event-card-container ${statusClass}`}>
      <td>
        <Container className="mobile-event-card" id={id}>
          <Row>
            <Col className="mobile-bold">Date:</Col>
            <Col className="mobile-data">{eventDate}</Col>
          </Row>
          <Row>
            <Col className="mobile-bold">Title:</Col>
            <Col className="mobile-data">{vipEvent.title}</Col>
          </Row>
          <Row>
            <Col className="mobile-bold">Venue:</Col>
            <Col className="mobile-data">{venueName}</Col>
          </Row>
          <Row>
            <Col className="mobile-bold">Location:</Col>
            <Col className="mobile-data">{location}</Col>
          </Row>
          <Row>
            <Col className="mobile-bold">Tickets sold:</Col>
            <Col className="mobile-data">{vipEvent.totalTickets}</Col>
          </Row>
          <Row>
            <Col className="mobile-bold">Tickets refunded:</Col>
            <Col className="mobile-data">{vipEvent.numTicketsRefunded ?? 0}</Col>
          </Row>
          <Row>
            <Col className="mobile-bold">Tickets comped:</Col>
            <Col className="mobile-data">{vipEvent.numTicketsComped}</Col>
          </Row>
          <Row hidden={!canCheckInTickets} className="no-print">
            <Col className="mobile-bold">Checked in:</Col>
            <Col className="mobile-data">
              {vipEvent.totalCheckedIn} / {vipEvent.totalTickets}
            </Col>
          </Row>
          <Row hidden={ticketBreakdownRows.length === 0}>
            <Col className="mobile-bold">Ticket type breakdown:</Col>
            <Col className="mobile-data">{ticketBreakdownRows}</Col>
          </Row>
          <Row hidden={hideRevItem} className={revClass}>
            <Col className="mobile-bold">Revenue:</Col>
            <Col className="mobile-data">
              {formatCurrencyAmount(revenue, revenueUsd, currencySymbol, exchangeRate, isAdmin)}
            </Col>
          </Row>
          <Row hidden={hideRevItem} className={revClass}>
            <Col className="mobile-bold">Net Revenue:</Col>
            <Col className="mobile-data">
              {formatCurrencyAmount(
                netRevenue,
                netRevenueUsd,
                currencySymbol,
                exchangeRate,
                isAdmin,
              )}
            </Col>
          </Row>
          <Row hidden={hideServiceFees} className="no-print">
            <Col className="mobile-bold">Service Fees:</Col>
            <Col className="mobile-data">
              {formatCurrencyAmount(
                serviceFees,
                serviceFeesUsd,
                currencySymbol,
                exchangeRate,
                isAdmin,
              )}
            </Col>
          </Row>
          <Row hidden={noOrders}>
            <Col>
              <Button onClick={setDetailEvent}>{buttonText}</Button>
            </Col>
          </Row>
          <Row hidden={!showNotes}>
            <Col>
              <Button
                onClick={() => (showNoteDialog ? showNoteDialog(vipEvent.externalEventId) : null)}
              >
                Notes
              </Button>
            </Col>
          </Row>
        </Container>
      </td>
    </tr>
  );
}

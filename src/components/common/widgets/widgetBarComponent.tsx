'use client';

import { Col, Row } from 'rsuite';

import { WidgetBarProps } from '@/types/props';

import RevenueWidget from './revenueWidgetComponent';
import ShirtSizesWidget from './shirtSizesWidgetComponent';
import ShowsListedWidget from './showsListedWidgetComponent';
import TicketTypesWidget from './ticketTypesWidgetComponent';

export default function WidgetBar(props: WidgetBarProps) {
  const totalShows = props.TotalShows;
  const totalTickets = props.TotalTickets;
  const totalRevenue = props.TotalRevenue;
  const totalShirts = props.TotalShirts;
  const ticketData = props.TicketData;
  const shirtData = props.ShirtData;
  const hideRevItem = props.HideRevenue;
  const hideServiceFees = props.HideServiceFees;
  const ticketsRefunded = props.TicketsRefunded;
  const totalServiceFees = props.TotalServiceFees;
  const hideTicketBreakdown = props.HideTicketBreakDown;
  const isAdmin = props.IsAdmin;

  const hideTickets = !ticketData || totalTickets === 0;
  const hideShirts = !shirtData || totalShirts === 0;

  return (
    <Row className="no-print widget-row" hidden={!totalShows}>
      <Col className="col-lg-3 col-md-6 widget-stat-block-container">
        <div className="widget-stat-block">
          <ShowsListedWidget TotalShows={totalShows} />
        </div>
      </Col>
      <Col hidden={hideTickets} className="col-lg-3 col-md-6 widget-stat-block-container">
        <div className="widget-stat-block">
          <TicketTypesWidget
            TicketData={ticketData}
            TotalTickets={totalTickets}
            TicketsRefunded={ticketsRefunded}
            HideTicketBreakDown={hideTicketBreakdown}
            IsAdmin={isAdmin}
          />
        </div>
      </Col>
      <Col hidden={hideShirts} className="col-lg-3 col-md-6 widget-stat-block-container">
        <div className="widget-stat-block">
          <ShirtSizesWidget ShirtData={shirtData} TotalShirts={totalShirts} />
        </div>
      </Col>
      <Col hidden={hideRevItem} className="col-lg-3 col-md-6 widget-stat-block-container">
        <div className="widget-stat-block">
          <RevenueWidget
            TotalRevenue={totalRevenue}
            TotalServiceFees={totalServiceFees}
            HideServiceFees={hideServiceFees}
          />
        </div>
      </Col>
    </Row>
  );
}

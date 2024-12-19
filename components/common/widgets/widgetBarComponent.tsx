import { Row, Col } from 'react-bootstrap';
import RevenueWidget from './revenueWidgetComponent';
import ShirtSizesWidget from './shirtSizesWidgetComponent';
import ShowsListedWidget from './showsListedWidgetComponent';
import TicketTypesWidget from './ticketTypesWidgetComponent';
import { IShirtData, ITicketData } from '@/types/event';

export default function WidgetBar(props: any) {
  const totalShows: number = props.TotalShows as number;
  const totalTickets: number = props.TotalTickets as number;
  const totalRevenue: number = props.TotalRevenue as number;
  const totalShirts: number = props.TotalShirts as number;
  const ticketData: ITicketData | undefined = props.TicketData as ITicketData | undefined;
  const shirtData: IShirtData | undefined = props.ShirtData as IShirtData | undefined;
  const hideRevItem = props.HideRevenue as boolean;
  const hideServiceFees = props.HideServiceFees as boolean;
  const ticketsRefunded: number = props.TicketsRefunded as number;
  const totalServiceFees: number = props.TotalServiceFees as number;
  const hideTicketBreakdown: boolean = props.HideTicketBreakDown as boolean;

  const hideTickets = !ticketData || totalTickets == 0;
  const hideShirts = !shirtData || totalShirts == 0;

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

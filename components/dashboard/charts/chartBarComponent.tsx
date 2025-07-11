import { Row, Col } from 'react-bootstrap';
import RevenueChart from './revenueChartComponent';
import OrderChart from './orderChartComponent';
import TicketTypesChart from './ticketTypesChartComponent';
import ShirtSizesChart from './shirtSizesChartComponent';
import { ChartBarProps } from '@/types/props';

export default function ChartBar(props: ChartBarProps) {
  const totalTickets = props.TotalTickets;
  const totalRevenue = props.TotalRevenue;
  const totalShirts = props.TotalShirts;
  const totalOrders = props.TotalOrders;
  const revenueData = props.RevenueData;
  const orderData = props.OrderData;
  const ticketData = props.TicketData;
  const shirtData = props.ShirtData;
  const chartsHidden = props.ChartHidden;

  return (
    <Row>
      <Col xl={6} xxl={3} className="chartColumn" hidden={!revenueData}>
        <RevenueChart
          ChartHidden={chartsHidden || !revenueData}
          RevenueData={revenueData}
          TotalRevenue={totalRevenue}
        />
      </Col>
      <Col xl={6} xxl={3} className="chartColumn" hidden={!orderData}>
        <OrderChart
          ChartHidden={chartsHidden || !orderData}
          OrderData={orderData}
          TotalOrders={totalOrders}
        />
      </Col>
      <Col xl={6} xxl={3} className="chartColumn" hidden={!ticketData}>
        <TicketTypesChart
          ChartHidden={chartsHidden || !ticketData}
          TicketData={ticketData}
          TotalTickets={totalTickets}
        />
      </Col>
      <Col xl={6} xxl={3} className="chartColumn" hidden={!shirtData}>
        <ShirtSizesChart
          ChartHidden={chartsHidden || !shirtData}
          ShirtData={shirtData}
          TotalShirts={totalShirts}
        />
      </Col>
    </Row>
  );
}

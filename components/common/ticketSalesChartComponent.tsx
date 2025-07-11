import React, { useEffect, useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  AreaChart,
  Area,
} from 'recharts';
import { Row, Col } from 'react-bootstrap';
import { LabelPosition } from 'recharts/types/component/Label';
import { TicketSalesChartProps } from '@/types/props';

export default function TicketSalesChart(props: TicketSalesChartProps) {
  const ticketSalesData = props.TicketSalesData;
  const [chartsHidden, setChartsHidden] = useState(true);
  const hideCharts = props.ChartsHidden;
  const hideRev = props.HideRevenue;
  const hideMobile = props.HideMobile;

  useEffect(() => {
    if (hideCharts) {
      setChartsHidden(true);
    } else {
      setTimeout(() => {
        setChartsHidden(false);
      }, 500);
    }
  }, [setChartsHidden, hideCharts]);

  const CustomTooltip = (params: any) => {
    const { active, payload, label } = params;
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Purchase Date: ${label}`}</p>
          <p className="label">{`Ticket Sales: ${payload[0].value}`}</p>
          {!hideRev ? (
            <p className="label">{`Ticket Revenue: $${parseFloat(payload[1].value).toFixed(2)}`}</p>
          ) : (
            ''
          )}
        </div>
      );
    }

    return null;
  };

  const yLabel: string = hideRev ? 'Tickets' : 'Tickets / Revenue ($)';
  const yPosition: LabelPosition = hideRev ? 'insideLeft' : 'insideBottomLeft';

  return (
    <Row className="no-print ticket-sales-chart" hidden={hideMobile || !ticketSalesData}>
      <Col>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={ticketSalesData ? [...ticketSalesData] : []}
            margin={{
              top: 10,
              right: 15,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="PurchaseDate">
              <Label value="Purchase Date" offset={-4} position="insideBottom" />
            </XAxis>
            <YAxis>
              <Label value={yLabel} position={yPosition} angle={-90} offset={15} />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            {!chartsHidden ? (
              <Area type="monotone" dataKey="Tickets" stroke="#000000" fill="#d88884" />
            ) : (
              ''
            )}
            {!chartsHidden && !hideRev ? (
              <Area type="monotone" dataKey="Revenue" stroke="#FF0000" fill="#8884d8" />
            ) : (
              ''
            )}
          </AreaChart>
        </ResponsiveContainer>
      </Col>
    </Row>
  );
}

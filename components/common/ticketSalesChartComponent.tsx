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
  TooltipProps,
} from 'recharts';
import { Row, Col } from 'react-bootstrap';
import { LabelPosition } from 'recharts/types/component/Label';
import { CustomToolTipParams, CustomToolTipParamsPayload, TicketSalesChartProps } from '@/types/props';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

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

  const CustomTooltip = (props: TooltipProps<ValueType, NameType>) => {
    const params = props as CustomToolTipParams;
    const { active, label } = params;
    const payload = params.payload as CustomToolTipParamsPayload[];
    if (active && payload && payload.length > 0) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Purchase Date: ${label}`}</p>
          <p className="label">{`Ticket Sales: ${payload[0].value}`}</p>
          {!hideRev ? (
            <p className="label">{`Ticket Revenue: $${parseFloat(payload[1]?.value?.toString() ?? '0').toFixed(2)}`}</p>
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

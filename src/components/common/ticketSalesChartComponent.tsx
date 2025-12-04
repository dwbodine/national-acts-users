'use client';

import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { LabelPosition } from 'recharts/types/component/Label';
import { Col, Row } from 'rsuite';

import {
  CustomToolTipParams,
  CustomToolTipParamsPayload,
  TicketSalesChartProps,
} from '@/types/props';

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

  const CustomTooltip = (tooltipProps: TooltipProps<ValueType, NameType>) => {
    const params = tooltipProps as CustomToolTipParams;
    const { active, label } = params;
    const payload = params.payload as CustomToolTipParamsPayload[];
    if (active && payload && payload.length > 0) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Purchase Date: ${label}`}</p>
          <p className="label">{`Ticket Sales: ${payload[0]?.value}`}</p>
          {hideRev ? (
            ''
          ) : (
            <p className="label">{`Ticket Revenue: $${parseFloat(payload[1]?.value?.toString() ?? '0').toFixed(2)}`}</p>
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
      <Col style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={ticketSalesData ? [...ticketSalesData] : []}
            margin={{
              bottom: 5,
              left: 0,
              right: 15,
              top: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="PurchaseDate">
              <Label value="Purchase Date" offset={-5} position="insideBottom" />
            </XAxis>
            <YAxis>
              <Label value={yLabel} position={yPosition} angle={-90} offset={10} />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            {chartsHidden ? (
              ''
            ) : (
              <Area type="monotone" dataKey="Tickets" stroke="#000000" fill="#d88884" />
            )}
            {!chartsHidden && !hideRev ? (
              <Area type="monotone" dataKey="RevenueUsd" stroke="#FF0000" fill="#8884d8" />
            ) : (
              ''
            )}
          </AreaChart>
        </ResponsiveContainer>
      </Col>
    </Row>
  );
}

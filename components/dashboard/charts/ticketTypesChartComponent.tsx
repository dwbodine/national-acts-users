import React from 'react';
import { ITicketTypeData, TicketType } from '@/types/event';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TicketTypesChartProps } from '@/types/props';

export default function TicketTypesChart(props: TicketTypesChartProps) {
  const ticketPropData = props.TicketData;
  const chartsHidden = props.ChartHidden;
  const totalTickets = props.TotalTickets;

  const chartColors = ['#8884d8', '#82ca9d', '#ffc658'];
  const ticketTypes = ticketPropData?.TicketTypes;

  const ticketData: Map<string, string>[] = [];
  const legendData = [];
  if (ticketTypes?.length ?? 0 > 0) {
    ticketPropData?.TicketData?.forEach(
      (ticketTypeData: ITicketTypeData[], key: string) => {
        const arr = new Map<string, string>();
        let total = 0;
        arr.set('EventDate', key);
        ticketTypes?.forEach((ticketType: TicketType) => {
          const data = ticketTypeData.find(
            (x) => x.TicketType == ticketType.ticketTypeName,
          );
          let number = 0;
          if (data) {
            number = data.Number;
          }
          arr.set(ticketType.ticketTypeName, number.toString());
          total += number;
        });
        ticketData.push(arr);
        arr.set('Total', total.toString());
        legendData.push(arr);
      },
    );

    const areas = [];
    if (ticketTypes) {
      let i = 0;
      for (const ticketType of ticketTypes) {
        const key = `tt${i}`;
        const color = chartColors[i % 3];
        areas.push(
          <Area
            key={key}
            type="monotone"
            dataKey={ticketType.ticketTypeName}
            stroke={color}
            fill={color}
          />,
        );
        i++;
      }
    }

    return (
      <>
        <AreaChart
          width={425}
          height={200}
          data={[...ticketData]}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="EventDate" hide={true} />
          <YAxis label={{ value: 'Tickets', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          {!chartsHidden ? areas : ''}
        </AreaChart>
        <div className="chart-total">Total Tickets: {totalTickets}</div>
      </>
    );
  } else {
    return <></>;
  }
}

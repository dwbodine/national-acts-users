import React from 'react';
import { IShirtSizeData } from '@/types/event';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ShirtSizesChartProps } from '@/types/props';

export default function ShirtSizesChart(props: any) { // ShirtSizesChartProps) {
  const shirtPropData = props.ShirtData;
  const chartsHidden = props.ChartHidden;
  const totalShirts = props.TotalShirts ?? 0;

  const chartColors = ['#8884d8', '#82ca9d', '#ffc658'];
  const shirtSizes = shirtPropData?.ShirtSizes;

  const shirtData: Map<string, string>[] = [];
  const legendData = [];
  if (shirtSizes?.length ?? 0 > 0) {
    shirtPropData?.ShirtData?.forEach((shirSizeData: IShirtSizeData[], key: string) => {
      const arr = new Map<string, string>();
      let total = 0;
      arr.set('EventDate', key);
      shirtSizes?.forEach((shirtSize: string) => {
        const data = shirSizeData.find((x) => x.ShirtSize == shirtSize);
        let number = 0;
        if (data) {
          number = data.Number;
        }
        arr.set(shirtSize, number.toString());
        total += number;
      });
      shirtData.push(arr);
      arr.set('Total', total.toString());
      legendData.push(arr);
    });

    const areas = [];
    if (shirtSizes) {
      let i = 0;
      for (const shirtSize of shirtSizes) {
        const key = `ss${i}`;
        const color = chartColors[i % 3];
        areas.push(
          <Area
            key={key}
            type="monotone"
            dataKey={shirtSize}
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
          data={[...shirtData]}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="EventDate" hide={true} />
          <YAxis label={{ value: 'Shirts', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          {!chartsHidden ? areas : ''}
        </AreaChart>
        <div className="chart-total">Total Shirts: {totalShirts}</div>
      </>
    );
  } else {
    return <></>;
  }
}

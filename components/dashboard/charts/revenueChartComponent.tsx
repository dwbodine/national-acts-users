import { IRevenueKeys } from '@/types/event';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function RevenueChart(props: any) {
  const revenueData: IRevenueKeys[] = props.RevenueData as IRevenueKeys[];
  const chartsHidden: boolean = props.ChartHidden as boolean;
  const totalRevenue: number = props.TotalRevenue as number;

  return (
    <>
      <AreaChart
        width={425}
        height={200}
        data={revenueData ? [...revenueData] : []}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="EventDate" hide={true} />
        <YAxis label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        {!chartsHidden ? (
          <Area type="monotone" dataKey="Revenue" stroke="#8884d8" fill="#8884d8" />
        ) : (
          ''
        )}
      </AreaChart>
      <div className="chart-total">Total Revenue: ${totalRevenue.toFixed(2)}</div>
    </>
  );
}

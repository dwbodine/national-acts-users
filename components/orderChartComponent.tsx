import { IOrderKeys, IRevenueKeys } from '@/types/event';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function OrderChart(props: any) {

    const orderData: IOrderKeys[] = props.OrderData as IOrderKeys[];
    const chartsHidden: boolean = props.ChartHidden as boolean;
    const totalOrders: number = props.TotalOrders as number;

    return (
        <>
            <AreaChart
                width={425}
                height={200}
                data={orderData ? [...orderData] : []}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="EventDate" hide={true} />
                <YAxis label={{ value: 'Orders', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                {!chartsHidden ? 
                <Area type="monotone" dataKey="Orders" stroke="#8884d8" fill="#8884d8" />
                : ''}
            </AreaChart>
            <div className="chart-total">Total Orders: {totalOrders}</div>
        </>
    );
}
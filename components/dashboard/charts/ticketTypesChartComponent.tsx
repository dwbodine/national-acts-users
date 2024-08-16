import React from 'react';
import { ITicketData, ITicketTypeData, TicketType } from '@/types/event';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function TicketTypesChart(props: any) {

    const ticketPropData: ITicketData = props.TicketData as ITicketData;
    const chartsHidden: boolean = props.ChartHidden as boolean;
    const totalTickets: number = props.TotalTickets as number;

    const chartColors = ['#8884d8', '#82ca9d', '#ffc658'];
    const ticketTypes = ticketPropData?.TicketTypes;
    
    let ticketData: any = [];
    let legendData: any = [];
    if (ticketTypes?.length > 0) {
        ticketPropData.TicketData?.forEach((ticketTypeData: ITicketTypeData[], key: string) => {
            let arr: any = [];
            let total = 0;
            arr['EventDate'] = key;
            ticketTypes.forEach((ticketType: TicketType) => {
                var data = ticketTypeData.find(x => x.TicketType == ticketType.ticketTypeName);
                var number = 0;
                if (data) {
                    number = data.Number;
                }
                arr[ticketType.ticketTypeName] = number;
                total += number;
            });
            let obj: any = {};
            Object.assign(obj, arr);
            ticketData.push(obj);
            arr['Total'] = total;
            let legendObj: any = {};
            Object.assign(legendObj, arr);
            legendData.push(legendObj);
        });
   

        var areas = [];
        let i = 0;
        for (const ticketType of ticketTypes) {
            const key = `tt${i}`;
            const color = chartColors[i % 3];
            areas.push(<Area key={key} type="monotone" dataKey={ticketType.ticketTypeName} stroke={color} fill={color} />);
            i++;
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
                    {!chartsHidden ? 
                    areas
                    : ''}
                </AreaChart>
                <div className="chart-total">Total Tickets: {totalTickets}</div>
            </>
        );
    } else {
        return(<></>);
    }
}
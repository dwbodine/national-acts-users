import React, { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES } from 'react';
import { IShirtData, IShirtSizeData } from '@/types/event';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function ShirtSizesChart(props: any) {

    const shirtPropData: IShirtData = props.ShirtData as IShirtData;
    const chartsHidden: boolean = props.ChartHidden as boolean;
    const totalShirts: number = props.TotalShirts as number;

    const chartColors = ['#8884d8', '#82ca9d', '#ffc658'];
    const shirtSizes = shirtPropData?.ShirtSizes;
    
    let shirtData: any = [];
    let legendData: any = [];
    if (shirtSizes?.length > 0) {
        shirtPropData.ShirtData?.forEach((shirSizeData: IShirtSizeData[], key: string) => {
            let arr: any = [];
            let total = 0;
            arr['EventDate'] = key;
            shirtSizes.forEach((shirtSize: string) => {
                var data = shirSizeData.find(x => x.ShirtSize == shirtSize);
                var number = 0;
                if (data) {
                    number = data.Number;
                }
                arr[shirtSize] = number;
                total += number;
            });
            let obj: any = {};
            Object.assign(obj, arr);
            shirtData.push(obj);
            arr['Total'] = total;
            let legendObj: any = {};
            Object.assign(legendObj, arr);
            legendData.push(legendObj);
        });
    

        var areas = [];
        let i = 0;
        for (const shirtSize of shirtSizes) {
            const key = `ss${i}`;
            const color = chartColors[i % 3];
            areas.push(<Area key={key} type="monotone" dataKey={shirtSize} stroke={color} fill={color} />);
            i++;
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
                    {!chartsHidden ? 
                    areas
                    : ''}
                </AreaChart>
                <div className="chart-total">Total Shirts: {totalShirts}</div>
            </>
        );
    } else {
        return (<></>);
    }
}
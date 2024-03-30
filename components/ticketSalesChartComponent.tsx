import React, { useEffect, useState } from 'react';
import { ITicketSalesData } from '@/types/event';
import { XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Row, Col } from 'react-bootstrap';

export default function TicketSalesChart(props: any) {

    const ticketSalesData: ITicketSalesData[] = props.TicketSalesData as ITicketSalesData[];
    const [chartsHidden, setChartsHidden] = useState(true);
    const hideCharts: boolean = props.ChartHidden as boolean;
    const hideRow: boolean = props.HideRow as boolean;

    useEffect(() => {
        setTimeout(() => {
            setChartsHidden(hideCharts);
        }, 500);
    },[setChartsHidden, hideCharts]);    

    return (
        <Row hidden={!ticketSalesData}>
            <Col>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart
                        data={ticketSalesData ? [...ticketSalesData] : []}
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
                        <Line type="monotone" dataKey="Tickets" stroke="#8884d8" fill="#8884d8" />
                        : ''}
                    </LineChart>
                </ResponsiveContainer>
            </Col>
        </Row>
    );
}
import React from 'react';
import { ITicketSalesData } from '@/types/event';
import { XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { Row, Col } from 'react-bootstrap';

export default function TicketSalesChart(props: any) {

    const ticketSalesData: ITicketSalesData[] = props.TicketData as ITicketSalesData[];
    const chartsHidden: boolean = props.ChartHidden as boolean;

    return (
        <Row>
            <Col>
                <LineChart
                    width={425}
                    height={200}
                    data={[...ticketSalesData]}
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
            </Col>
        </Row>
    );
}
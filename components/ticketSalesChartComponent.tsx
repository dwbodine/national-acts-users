import React, { useEffect, useState } from 'react';
import { ITicketSalesData } from '@/types/event';
import { XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer, Legend, Label, AreaChart, Area } from 'recharts';
import { Row, Col } from 'react-bootstrap';

export default function TicketSalesChart(props: any) {

    const ticketSalesData: ITicketSalesData[] = props.TicketSalesData as ITicketSalesData[];
    const [chartsHidden, setChartsHidden] = useState(true);
    const hideCharts: boolean = props.ChartsHidden as boolean;
    
    useEffect(() => {
        if (hideCharts) {
            setChartsHidden(true);
        } else {
            setTimeout(() => {
                setChartsHidden(false);
            }, 500);
        }        
    },[setChartsHidden, hideCharts]);   

    const CustomTooltip = (params: any) => {
        const { active, payload, label } = params;
        if (active && payload && payload.length) {
            return (
            <div className="custom-tooltip">
                <p className="label">{`Purchase Date: ${label}`}</p>
                <p className="label">{`Ticket Sales: ${payload[0].value}`}</p>
            </div>
            );
        }
        
        return null;
    };
    
    return (
        <Row hidden={!ticketSalesData}>
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
                            <Label value="Tickets" position="insideLeft" angle={-90} />
                        </YAxis>
                        <Tooltip content={<CustomTooltip />}/>
                        {!chartsHidden ? 
                        <Area type="monotone" dataKey="Tickets" stroke="#FF0000" fill="#d88884" dot={{ stroke: 'red', strokeWidth: 1, r: 3 }} />
                        : ''}
                    </AreaChart>
                </ResponsiveContainer>
            </Col>
        </Row>
    );
}
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../src/lib/store';
import { useGetEvents } from '@/hooks/useGetEvents';
import { setEvents, setDateRange } from '@/lib/reportSelectionSlice';
import { VipEvent } from "@/types/event";
import { useEffect, useState } from "react";
import EventComponent from "./eventComponent";
import moment from "moment";
import { UserReportSelection } from "@/types/user";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { CirclesWithBar } from 'react-loader-spinner';
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface IRevenueKeys { EventDate: string; Revenue: number }
interface ITicketKeys { EventDate: string; Tickets: number }
interface IOrderKeys { EventDate: string; Orders: number }

export default function CurrentEvents() {
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
    const { user } = useCurrentUser();
    const { getEvents } = useGetEvents();
    const dispatch = useDispatch(); 
    let vipEvents: VipEvent[] | undefined = currentReportSelection.currentEvents;
    const [isLoading, setIsLoading] = useState(false);
    const [chartsHidden, setChartsHidden] = useState(true);
    let revenueData: IRevenueKeys[] = [];
    let ticketData: ITicketKeys[] = [];
    let orderData: IOrderKeys[] = [];
    
    const getRevenueData = (): IRevenueKeys[] => {
        if (!vipEvents || vipEvents.length == 0) {
            return [];
        }
        return vipEvents.map<IRevenueKeys>((vipEvent) => ({
            EventDate: moment(vipEvent.eventDate).format('MM/DD/YYYY'),
            Revenue: parseFloat(vipEvent.totalRevenue.toFixed(2))
        }));
    };

    const getOrderData = (): IOrderKeys[] => {
        if (!vipEvents || vipEvents.length == 0) {
            return [];
        }
        return vipEvents.map<IOrderKeys>((vipEvent) => ({
            EventDate: moment(vipEvent.eventDate).format('MM/DD/YYYY'),
            Orders: vipEvent.orders?.length || 0
        }));
    };

    const getTicketData = (): ITicketKeys[] => {
        if (!vipEvents || vipEvents.length == 0) {
            return [];
        }
        return vipEvents.map<ITicketKeys>((vipEvent) => ({
            EventDate: moment(vipEvent.eventDate).format('MM/DD/YYYY'),
            Tickets: vipEvent.totalTickets
        }));
    };

    useEffect(() => {
        if (currentReportSelection.reloadEvents && currentReportSelection.seller.sellerId > 0) {
            setIsLoading(true);
            setChartsHidden(true);
            getEvents(currentReportSelection).then((response) => {
                if (!response.eventError && response.events) {
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    vipEvents = response.events;
                    if (vipEvents?.length > 0) {
                        const start = moment(vipEvents[0].eventDate).unix();
                        const end = moment(vipEvents[vipEvents.length-1].eventDate).unix();
                        const selection: UserReportSelection = {
                            ...currentReportSelection,
                            start: start,
                            end: end
                        };
                        dispatch(
                            setDateRange(selection)
                        );
                    }
                    dispatch(
                        setEvents(response.events)
                    );
                } else {
                    vipEvents = [];
                }
                setIsLoading(false);
            });
        }
    }, [currentReportSelection]);     
    
    const rows = [];
    let totalTickets = 0;
    let totalRevenue = 0.0;

    if (vipEvents && vipEvents.length > 0) {
        revenueData = getRevenueData();
        ticketData = getTicketData();
        orderData = getOrderData();

        let i = 0;
        for (const vipEvent of vipEvents) {
            const key = `ev${i}`;
            rows.push(<EventComponent key={key} VipEvent={vipEvent} IsAdmin={user.isAdmin} />);
            if (vipEvent.isActive && !vipEvent.isDeleted) {
                totalTickets += vipEvent.totalTickets;
                totalRevenue += vipEvent.totalRevenue;
            }
            i++;
        }

        setTimeout(() => {
            setChartsHidden(false);
        }, 500);
    }

    return (
        <>
             {(vipEvents && vipEvents.length > 0) ?
            <Row hidden={isLoading}>
                <Col xs={3} className="chartColumn">
                        <AreaChart
                            width={425}
                            height={200}
                            data={[...revenueData]}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="EventDate" hide={true} />
                            <YAxis label={{ value: 'Revenue (USD)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            {!chartsHidden ? 
                            <Area type="monotone" dataKey="Revenue" stroke="#8884d8" fill="#8884d8" />
                            : ''}
                        </AreaChart>
                </Col>
                <Col xs={3}>
                        <AreaChart
                            width={425}
                            height={200}
                            data={[...orderData]}
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
                </Col>
                <Col xs={3}>
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
                            <Area type="monotone" dataKey="Tickets" stroke="#8884d8" fill="#8884d8" />
                            : ''}
                        </AreaChart>
                </Col>
            </Row> : '' }
            <Row>
                <Col className="spinner-container" hidden={!isLoading}>
                    <CirclesWithBar height="100" width="100" color="#d12610" visible={isLoading} />
                </Col>
                <Col hidden={isLoading}>
                    {(vipEvents && vipEvents.length > 0) ?
                        <table className="resultsTable">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Title</th>
                                    <th>Venue</th>
                                    <th>Location</th>
                                    <th>Tickets Sold</th>
                                    <th>Revenue</th>
                                    { user.isAdmin ? <th colSpan={2} className="center">Admin Commands</th> : ''}            
                                </tr>
                            </thead>
                            <tbody>
                                { rows }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={4}>Total</td> 
                                    <td className="pull-right">{totalTickets}</td>
                                    <td className="pull-right">{totalRevenue.toFixed(2)}</td>
                                    { user.isAdmin ? <td colSpan={2}></td> : ''}            
                                </tr>
                            </tfoot>
                        </table>
                    : ''}
                </Col>
            </Row>
        </>
    );        
 
}

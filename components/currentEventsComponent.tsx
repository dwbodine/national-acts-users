import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../src/lib/store';
import { useGetEvents } from '@/hooks/useGetEvents';
import { setEvents, setDateRange } from '@/lib/reportSelectionSlice';
import { IOrderKeys, IRevenueKeys, IShirtData, ITicketData, ITicketTypeData, VipEvent } from "@/types/event";
import { useEffect, useState } from "react";
import EventComponent from "./eventComponent";
import moment from "moment";
import { UserReportSelection } from "@/types/user";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { CirclesWithBar } from 'react-loader-spinner';
import { useCurrentUser } from "@/hooks/useCurrentUser";
import RevenueChart from "./revenueChartComponent";
import OrderChart from "./orderChartComponent";
import TicketTypesChart from "./ticketTypesChartComponent";
import EventDetail from "./eventDetailComponent";
import { getTicketDataFromEvents } from "@/utils/getTicketData";
import { getShirtDataFromEvents } from "@/utils/getShirtData";
import ShirtSizesChart from "./shirtSizesChartComponent";

export default function CurrentEvents() {
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
    const { user } = useCurrentUser();
    const { getEvents } = useGetEvents();
    const dispatch = useDispatch(); 
    const [isLoading, setIsLoading] = useState(false);
    const [chartsHidden, setChartsHidden] = useState(true);

    let revenueData: IRevenueKeys[] | undefined = undefined;
    let ticketData: ITicketData | undefined = undefined;
    let orderData: IOrderKeys[] | undefined = undefined;
    let shirtData: IShirtData | undefined = undefined;
    const showEventDetail = (currentReportSelection?.selectedEvent != undefined);
    let vipEvents: VipEvent[] | undefined = currentReportSelection.currentEvents;    
    
    const getRevenueData = (): IRevenueKeys[] | undefined => {
        if (!vipEvents || vipEvents.length == 0) {
            return undefined;
        }
        return vipEvents.map<IRevenueKeys>((vipEvent) => ({
            EventDate: moment(vipEvent.eventDate).format('MM/DD/YYYY'),
            Revenue: parseFloat(vipEvent.totalRevenue.toFixed(2))
        }));
    };

    const getOrderData = (): IOrderKeys[] | undefined => {
        if (!vipEvents || vipEvents.length == 0) {
            return undefined;
        }
        return vipEvents.map<IOrderKeys>((vipEvent) => ({
            EventDate: moment(vipEvent.eventDate).format('MM/DD/YYYY'),
            Orders: vipEvent.orders?.length || 0
        }));
    };

    const getTicketData = (): ITicketData | undefined => {
        if (!vipEvents || vipEvents.length == 0) {
            return undefined;
        }

        return getTicketDataFromEvents(vipEvents);
    };

    const getShirtData = (): IShirtData | undefined => {
        if (!vipEvents || vipEvents.length == 0) {
            return undefined;
        }

        return getShirtDataFromEvents(vipEvents);
    }

    useEffect(() => {
        if (currentReportSelection.reloadEvents && currentReportSelection.seller.sellerId > 0) {
            setIsLoading(true);
            setChartsHidden(true);
            getEvents(currentReportSelection).then((response) => {
                if (!response.eventError && response.events) {
                    if (response.events.length > 0) {
                        const start = moment(response.events[0].eventDate).unix();
                        const end = moment(response.events[response.events.length-1].eventDate).unix();
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
                    dispatch(
                        setEvents([])
                    );
                }
                setIsLoading(false);
            });
        }
    }, [currentReportSelection, dispatch, getEvents]);     
    
    const rows = [];
    let totalTickets = 0;
    let totalRevenue = 0.0;
    let totalShirts = 0;
    let totalOrders = 0;

    if (vipEvents && vipEvents.length > 0) {
        revenueData = getRevenueData();
        ticketData = getTicketData();
        orderData = getOrderData();
        shirtData = getShirtData();

        let i = 0;
        for (const evt of vipEvents) {
            const key = `ev${i}`;
            rows.push(<EventComponent key={key} VipEvent={evt} IsAdmin={user.isAdmin} />);
            totalTickets += evt.totalTickets;
            totalRevenue += evt.totalRevenue;
            totalOrders += evt.orders?.length ?? 0;
            if (evt.shirtSales && evt.shirtSales.length > 0) {
                evt.shirtSales.forEach((sale) => {
                    totalShirts += sale.total ?? 0;
                });
            }
            i++;
        }

        setTimeout(() => {
            setChartsHidden(false);
        }, 500);
    }

    return (
        <>
             {(!showEventDetail && (vipEvents && vipEvents.length > 0)) ?
            <Row hidden={isLoading || chartsHidden}>
                <Col xs={3} className="chartColumn" hidden={!revenueData}>
                    <RevenueChart ChartHidden={chartsHidden || !revenueData} RevenueData={revenueData} TotalRevenue={totalRevenue} />
                </Col>
                <Col xs={3} className="chartColumn" hidden={!orderData}>
                    <OrderChart ChartHidden={chartsHidden || !orderData} OrderData={orderData} TotalOrders={totalOrders} />
                </Col>
                <Col xs={3} className="chartColumn" hidden={!ticketData}>
                    <TicketTypesChart ChartHidden={chartsHidden || !ticketData} TicketData={ticketData} TotalTickets={totalTickets} />
                </Col>
                <Col xs={3} className="chartColumn" hidden={!shirtData}>
                    <ShirtSizesChart ChartHidden={chartsHidden || !shirtData} ShirtData={shirtData} TotalShirts={totalShirts} />
                </Col>
            </Row> : '' }
            <Row>
                <Col className="spinner-container" hidden={!isLoading}>
                    <CirclesWithBar height="100" width="100" color="#d12610" visible={isLoading} />
                </Col>
                <Col hidden={isLoading || showEventDetail}>
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
                    {((!vipEvents || vipEvents.length == 0) && currentReportSelection.seller.sellerId > 0) ? 
                    <Col className="no-events">
                        No events found
                    </Col>
                    : ''}
                </Col>
                <EventDetail hidden={!showEventDetail} IsAdmin={user.isAdmin} />
            </Row>
        </>
    );        
 
}

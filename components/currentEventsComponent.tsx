import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../src/lib/store';
import { useGetEvents } from '@/hooks/useGetEvents';
import { setEvents, setDateRange } from '@/lib/reportSelectionSlice';
import { IOrderKeys, IShirtData, ITicketData, ITicketSalesData, VipEvent } from "@/types/event";
import { useEffect, useState } from "react";
import moment from "moment";
import { UserReportSelection, UserRole } from "@/types/user";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { CirclesWithBar } from 'react-loader-spinner';
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getTicketDataFromEvents } from "@/utils/getTicketData";
import { getShirtDataFromEvents } from "@/utils/getShirtData";
import EventRow from "./eventRowComponent";
import router from "next/router";
import WidgetBar from "./widgetBarComponent";
import TicketSalesChart from "./ticketSalesChartComponent";
import { getPurchaseDataFromEvents } from "@/utils/getPurchaseData";
import { useWindowSize } from "@/hooks/useWindowSize";
import isMobileWidth from "@/utils/mobileUtil";
import EventMobileRow from "./eventMobileRowComponent";
import { Container } from "react-bootstrap";

export default function CurrentEvents() {
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
    const { user } = useCurrentUser();
    const isAdmin = (user.role == UserRole.SystemAdmin);
    const { getEvents } = useGetEvents();
    const dispatch = useDispatch(); 
    const [isLoading, setIsLoading] = useState(false);
    const [chartsHidden, setChartsHidden] = useState(true);
    const [hideRevItem, setHideRevItem] = useState(true);
    const [hideServiceFees, setHideServiceFees] = useState(true);
    const windowSize = useWindowSize();
    const isMobile = isMobileWidth(windowSize);
    const hideTicketChart = windowSize.width < 1200;

    const alwaysShowRevenue = (user.role == UserRole.AccountAdmin || user.role == UserRole.AccountManager);

    let ticketData: ITicketData | undefined = undefined;
    let shirtData: IShirtData | undefined = undefined;
    let vipEvents: VipEvent[] | undefined = currentReportSelection.currentEvents;    
    let ticketSalesData: ITicketSalesData[] | undefined = undefined;
    
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

    const getTicketSalesData = (): ITicketSalesData[] | undefined => {
        if (!vipEvents || vipEvents.length == 0) {
            return undefined;
        }

        return getPurchaseDataFromEvents(vipEvents);
    };

    const getShirtData = (): IShirtData | undefined => {
        if (!vipEvents || vipEvents.length == 0) {
            return undefined;
        }

        return getShirtDataFromEvents(vipEvents);
    }

    useEffect(() => {
        if (currentReportSelection.seller.sellerId > 0) {
            if (alwaysShowRevenue) {
                setHideRevItem(false);
            } else if (user.role == UserRole.MerchPerson) {
                setHideRevItem(true);
            } else {
                setHideRevItem(currentReportSelection.hideRevenue ?? true);
            }
            
            setHideServiceFees(currentReportSelection.hideServiceFees ?? true);

            if (currentReportSelection.reloadEvents) {
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
                            setChartsHidden(false);
                            
                            dispatch(
                                setDateRange(selection)
                            );
                        }
                        dispatch(
                            setEvents(response.events)
                        );
                    } else if (response.statusCode == 401) {
                        router.push('/logout');
                    } else {
                        dispatch(
                            setEvents([])
                        );
                    }
                    setIsLoading(false);
                });
            }
        }        
        
    }, [currentReportSelection, dispatch, getEvents, isMobile, alwaysShowRevenue, user.role]);     
    
    const rows = [];
    let totalEvents = 0;
    let totalTickets = 0;
    let totalRevenue = 0.0;
    let totalShirts = 0;
    let totalOrders = 0;
    let ticketsRefunded = 0;
    let totalServiceFees = 0;

    if (vipEvents && vipEvents.length > 0) {
        totalEvents = vipEvents.length;
        ticketData = getTicketData();
        shirtData = getShirtData();
        ticketSalesData = getTicketSalesData();

        let i = 0;
        for (const evt of vipEvents) {
            const key = `ev${i}`;
            if (isMobile) {
                rows.push(<EventMobileRow key={key} VipEvent={evt} IsAdmin={isAdmin} HideRevenue={hideRevItem} HideServiceFees={hideServiceFees} />);    
            } else {
                rows.push(<EventRow key={key} VipEvent={evt} IsAdmin={isAdmin} HideRevenue={hideRevItem} HideServiceFees={hideServiceFees} />);    
            }

            if (!evt.isDeleted) {
                totalTickets += evt.totalTickets;
                totalRevenue += evt.totalRevenue;
                ticketsRefunded += evt.numTicketsRefunded ?? 0;
                totalOrders += evt.orders?.length ?? 0;
                totalShirts += evt.totalShirts;
                totalServiceFees += evt.totalServiceFees;
            }
            i++;
        }
    }

    return (
        <>
            <WidgetBar TotalShows={totalEvents} TicketData={ticketData} TotalTickets={totalTickets} 
                ShirtData={shirtData} TotalShirts={totalShirts} TotalRevenue={totalRevenue} HideRevenue={hideRevItem} 
                TicketsRefunded={ticketsRefunded} TotalServiceFees={totalServiceFees} HideServiceFees={hideServiceFees || !isAdmin} />
            <TicketSalesChart TicketSalesData={ticketSalesData} ChartsHidden={chartsHidden} HideRevenue={hideRevItem} HideMobile={hideTicketChart} />
            <Row className="results-container">
                <Col className="spinner-container" hidden={!isLoading}>
                    <CirclesWithBar height="100" width="100" color="#d12610" visible={isLoading} />
                </Col>
                <Col hidden={isLoading} className="results-col">
                    {(vipEvents && vipEvents.length > 0) ?
                        <table className="resultsTable">
                            <thead hidden={isMobile}>
                                <tr>
                                    <th>Date</th>
                                    <th>Title</th>
                                    <th>Venue</th>
                                    <th>Location</th>
                                    <th>Tickets Sold</th>
                                    <th hidden={hideRevItem}>Revenue (USD)</th>
                                    <th className="no-print" hidden={hideServiceFees || !isAdmin}>Service Fees</th>
                                    { isAdmin ? <th colSpan={2} className="center no-print">Admin Commands</th> : ''}            
                                </tr>
                            </thead>
                            <tbody>
                                { rows }
                            </tbody>
                            <tfoot hidden={isMobile}>
                                <tr>
                                    <td colSpan={4}>Total</td> 
                                    <td className="pull-right">{totalTickets}</td>
                                    <td className="pull-right" hidden={hideRevItem}>{totalRevenue.toFixed(2)}</td>
                                    <td className="pull-right" hidden={hideServiceFees || !isAdmin}>{totalServiceFees.toFixed(2)}</td>
                                    { isAdmin ? <td colSpan={2} className="no-print"></td> : ''}            
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
            </Row>
        </>
    );        
 
}

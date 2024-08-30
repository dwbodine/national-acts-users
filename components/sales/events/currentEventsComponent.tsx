import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../../../src/lib/store';
import { useGetEvents } from '@/hooks/useGetEvents';
import { setEvents, setDateRange, setReloadEvents } from '@/lib/reportSelectionSlice';
import { IShirtData, ITicketData, ITicketSalesData, VipEvent } from "@/types/event";
import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { EnumPermission, UserReportSelection } from "@/types/user";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { CirclesWithBar } from 'react-loader-spinner';
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getTicketDataFromEvents } from "@/utils/getTicketData";
import { getShirtDataFromEvents } from "@/utils/getShirtData";
import EventRow from "./eventRowComponent";
import router from "next/router";
import WidgetBar from "../widgets/widgetBarComponent";
import TicketSalesChart from "../charts/ticketSalesChartComponent";
import { getPurchaseDataFromEvents } from "@/utils/getPurchaseData";
import { useWindowSize } from "@/hooks/useWindowSize";
import EventMobileRow from "./eventMobileRowComponent";
import { useHasPermission } from "@/hooks/useHasPermission";
import debouce from "lodash.debounce";
import { FULL_PAGE_CHART_BREAKPOINT } from "@/constants";

export default function CurrentEvents() {
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
    const { user } = useCurrentUser();
    const { userHasPermission } = useHasPermission();
    const { getEvents } = useGetEvents();
    const dispatch = useDispatch(); 

    const [isLoading, setIsLoading] = useState(false);
    const [chartsHidden, setChartsHidden] = useState(true);
    const [hideRevItem, setHideRevItem] = useState(true);
    const [hideServiceFees, setHideServiceFees] = useState(true);
    const windowSize = useWindowSize();
    const windowSizeJson = JSON.stringify(windowSize);
    const hideTicketChart = windowSize.width < FULL_PAGE_CHART_BREAKPOINT;
    const [searchTerm, setSearchTerm] = useState('');

    const viewRevenueControls = userHasPermission(user, EnumPermission.ViewRevenueControls);
    const viewRevenueData = userHasPermission(user, EnumPermission.ViewRevenueData);
    const viewServiceFees = userHasPermission(user, EnumPermission.ViewServiceFees);
    const changeEventStatus = userHasPermission(user, EnumPermission.ChangeEventStatus);
    const canCheckInTickets = userHasPermission(user, EnumPermission.CheckInUsers);
    const alwaysShowRevenue = (viewRevenueData && !viewRevenueControls);    

    let ticketData: ITicketData | undefined = undefined;
    let shirtData: IShirtData | undefined = undefined;
    let vipEvents: VipEvent[] | undefined = currentReportSelection.currentEvents;    
    let ticketSalesData: ITicketSalesData[] | undefined = undefined;
    let searchBarHidden = true;

    const debouncedResults = useMemo(() => {
        return debouce(setSearchTerm, 300);
    }, []);

    
    const getTicketData = (events: VipEvent[]): ITicketData | undefined => {
        if (!events || events.length == 0) {
            return undefined;
        }

        return getTicketDataFromEvents(events);
    };

    const getTicketSalesData = (events: VipEvent[]): ITicketSalesData[] | undefined => {
        if (!events || events.length == 0) {
            return undefined;
        }

        return getPurchaseDataFromEvents(events);
    };

    const getShirtData = (events: VipEvent[]): IShirtData | undefined => {
        if (!events || events.length == 0) {
            return undefined;
        }

        return getShirtDataFromEvents(events);
    }

    useEffect(() => {
        if (currentReportSelection.seller.sellerId > 0) {
            if (alwaysShowRevenue) {
                setHideRevItem(false);
            } else if (!viewRevenueData) {
                setHideRevItem(true);
            } else {
                setHideRevItem(currentReportSelection.hideRevenue ?? true);
            }
            
            if (viewServiceFees) {
                setHideServiceFees(currentReportSelection.hideServiceFees ?? true);
            } else {
                setHideServiceFees(true);
            }            

            if (currentReportSelection.reloadEvents) {
                setIsLoading(true);
                setChartsHidden(true);
                dispatch(
                    setReloadEvents(false)
                );
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
                    } else if (response.statusCode == 401 || response.statusCode == 422) {
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
        return () => {
            debouncedResults.cancel();
        }
    }, [
        currentReportSelection, 
        dispatch, 
        getEvents, 
        alwaysShowRevenue, 
        viewRevenueData, 
        viewServiceFees, 
        user, 
        debouncedResults, 
        windowSizeJson
    ]);    
    
    const filterEvents = (events: VipEvent[]) => {
        let filteredEvents: VipEvent[] = events;
        if (searchTerm && searchTerm.length >= 2 && events && events.length > 0) {
            const srch = searchTerm.toLowerCase();
            filteredEvents = events.filter((event) => {
                return event.title.toLowerCase().includes(srch) || 
                    event.venue?.name?.toLowerCase().includes(srch) || 
                    event.venue?.city?.toLowerCase().includes(srch) || 
                    event.venue?.state?.toLowerCase().includes(srch) || 
                    event.venue?.country?.toLowerCase().includes(srch);
            })
        }
        return filteredEvents;
    };
    
    const rows = [];
    let totalEvents = 0;
    let totalTickets = 0;
    let totalRevenue = 0.0;
    let totalShirts = 0;
    let totalOrders = 0; 
    let ticketsRefunded = 0;
    let totalServiceFees = 0;

    if (vipEvents && vipEvents.length > 0) {
        if (windowSize.isMobile || vipEvents.length > 10) {
            searchBarHidden = false;
        }
        const filteredEvents = filterEvents(vipEvents);

        totalEvents = filteredEvents.length;
        ticketData = getTicketData(filteredEvents);
        shirtData = getShirtData(filteredEvents);
        ticketSalesData = getTicketSalesData(filteredEvents);

        let i = 0;
        for (const evt of filteredEvents) {
            const key = `ev${i}`;
            if (windowSize.isMobile) {
                rows.push(<EventMobileRow key={key} VipEvent={evt} ChangeEventStatus={changeEventStatus} HideRevenue={hideRevItem} HideServiceFees={hideServiceFees} CanCheckInTickets={canCheckInTickets} />);    
            } else {
                rows.push(<EventRow key={key} VipEvent={evt} ChangeEventStatus={changeEventStatus} HideRevenue={hideRevItem} HideServiceFees={hideServiceFees} />);    
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
            <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control search-text-input no-print"
                placeholder="Search for events..." 
                hidden={(searchBarHidden || isLoading || !vipEvents || vipEvents.length == 0)}
            />
            <WidgetBar TotalShows={totalEvents} TicketData={ticketData} TotalTickets={totalTickets} 
                ShirtData={shirtData} TotalShirts={totalShirts} TotalRevenue={totalRevenue} HideRevenue={hideRevItem} 
                TicketsRefunded={ticketsRefunded} TotalServiceFees={totalServiceFees} HideServiceFees={hideServiceFees} />
            <TicketSalesChart TicketSalesData={ticketSalesData} ChartsHidden={chartsHidden} HideRevenue={hideRevItem} HideMobile={hideTicketChart} />
            <Row className="results-container">
                <Col className="spinner-container" hidden={!isLoading}>
                    <CirclesWithBar height="100" width="100" color="#d12610" visible={isLoading} />
                </Col>
                <Col hidden={isLoading} className="results-col">
                    {(vipEvents && vipEvents.length > 0) ?
                        <table className="resultsTable">
                            <thead hidden={windowSize.isMobile}>
                                <tr>
                                    <th>Date</th>
                                    <th>Title</th>
                                    <th>Venue</th>
                                    <th>Location</th>
                                    <th>Tickets Sold</th>
                                    <th hidden={hideRevItem}>Revenue (USD)</th>
                                    <th className="no-print" hidden={hideServiceFees}>Service Fees</th>
                                    { changeEventStatus ? <th colSpan={3} className="center command-column no-print">Commands</th> : ''}            
                                </tr>
                            </thead>
                            <tbody>
                                { rows }
                            </tbody>
                            <tfoot hidden={windowSize.isMobile}>
                                <tr>
                                    <td colSpan={4}>Total</td> 
                                    <td className="pull-right">{totalTickets}</td>
                                    <td className="pull-right" hidden={hideRevItem}>{totalRevenue.toFixed(2)}</td>
                                    <td className="pull-right" hidden={hideServiceFees}>{totalServiceFees.toFixed(2)}</td>
                                    { changeEventStatus ? <td colSpan={2} className="command-column no-print"></td> : ''}            
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

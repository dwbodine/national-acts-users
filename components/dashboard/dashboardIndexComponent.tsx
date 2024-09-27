import { Col, Container, Row } from "react-bootstrap";
import DashboardBar from "./dashboardBarComponent"
import TicketSalesChart from "../common/ticketSalesChartComponent";
import { GetDashboardOrdersResponse, GetOrdersResponse, ITicketSalesData } from "@/types/event";
import { useEffect, useState } from "react";
import { useWindowSize } from "@/hooks/common/useWindowSize";
import { FULL_PAGE_CHART_BREAKPOINT } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setReloadDashboardOrders, setCurrentDashboardData } from "@/lib/dashboardSelectionSlice";
import { Table } from "rsuite";
import { getDashboardDataFromOrders } from "@/utils/getDashboardDataFromOrders";
import { FaDollarSign, FaMoneyBillAlt, FaTicketAlt } from "react-icons/fa";
import { useGetDashboardData } from "@/hooks/dashboard/useGetDashboardData";
import YearToDateWidget from "./widgets/yearToDateWidgetComponent";
import RevenueGoalsWidget from "./widgets/revenueGoalsWidgetComponent";
import MonthToDateWidget from "./widgets/monthToDateWidgetComponent";
import SalesPerMonthWidget from "./widgets/salesPerMonthWidgetComponent";
import SalesPerDayOfWeekWidget from "./widgets/salesPerDayOfWeekWidgetComponent";
import { eventService } from "@/services";
import SalesByAccountWidget from "./widgets/salesByAccountWidgetComponent";
import TopSellersWidget from "./widgets/topSellersWidgetComponent";
import TopSellingLocationsWidget from "./widgets/topSellingLocationsWidgetComponent";
import moment from "moment";
import { setIsLoading } from "@/lib/globalSelectionSlice";

export default function DashboardIndex() {
    const globalSelection = useSelector((state: RootState) => state.globalSelection);
    const currentDashboardSelection = useSelector((state: RootState) => state.dashboardSelecton);
    const [chartsHidden, setChartsHidden] = useState(true);
    const { Column, HeaderCell, Cell } = Table;

    const dispatch = useDispatch();
    const windowSize = useWindowSize();
    const { getDashboardData } = useGetDashboardData();
    const windowSizeJson = JSON.stringify(windowSize);
    const hideTicketChart = windowSize.width < FULL_PAGE_CHART_BREAKPOINT;

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentDashboardSelection.reloadOrders) {
                dispatch (
                    setReloadDashboardOrders(false)
                );
                dispatch(
                    setIsLoading(true)
                );
                setChartsHidden(true);
                getDashboardData(currentDashboardSelection)
                    .then((response: GetDashboardOrdersResponse) => {
                        if (response.totals && !response.dashError) {
                            const dashData = getDashboardDataFromOrders(currentDashboardSelection, response.totals);
                            dispatch (
                                setCurrentDashboardData(dashData)
                            );
                        }                        
                        dispatch(
                            setIsLoading(false)
                        );
                        setChartsHidden(false);
                    });
            } else {
                if (chartsHidden) {
                    setChartsHidden(false);
                }
            }
        }, 200);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [currentDashboardSelection, dispatch, getDashboardData, windowSizeJson, chartsHidden]);

    const totalTickets = currentDashboardSelection.currentDashboardData?.tickets ?? 0;
    const totalTicketsRefunded = currentDashboardSelection.currentDashboardData?.ticketsRefunded ?? 0;
    const totalTicketRevenue = currentDashboardSelection.currentDashboardData?.revenue ?? 0;
    const totalRevenue = currentDashboardSelection.currentDashboardData?.totalRevenue ?? 0;
    const totalServiceFees = currentDashboardSelection.currentDashboardData?.serviceFees ?? 0;
    const totalPurchases = currentDashboardSelection.currentDashboardData?.purchases ?? 0;
    const ticketSalesData = currentDashboardSelection.currentDashboardData?.ticketSalesData ?? undefined;
    const topSellers = currentDashboardSelection.currentDashboardData?.topSellers ?? undefined;
    const topLocations = currentDashboardSelection.currentDashboardData?.topLocations ?? undefined;
    const topVenues = currentDashboardSelection.currentDashboardData?.topVenues ?? undefined;
    const dateRange = `${moment.unix(currentDashboardSelection.start).format('MM/DD/YYYY')} - ${moment.unix(currentDashboardSelection.end).format('MM/DD/YYYY')}`;

    let chartSalesData: ITicketSalesData[] = [];
    if (ticketSalesData) {
        let j = 0;
        for (let i = ticketSalesData.length-1; i >= 0; i--) {
            chartSalesData[j] = ticketSalesData[i];
            j++;
        }
    }

    let accountTotalWidgets: any[] = [];
    const accountTotals = currentDashboardSelection.currentDashboardData?.totalsByAccount;
    if (accountTotals && accountTotals.length > 0) {
        accountTotals.forEach((accountTotal, i) => {
            const accountTotals = accountTotal.totals;
            const accountName = eventService.getAccountNameFromTicketSocketId(accountTotal.ticketSocketId);
            const key = `accountTotal${i}`;
            accountTotalWidgets.push(
                <Col key={key} xxl={2} xl={3} lg={4} md={6} className="stat-block-container">
                    <SalesByAccountWidget accountName={accountName} accountTotals={accountTotals} />
                </Col>
            );
        })
    }

    return (
        <>
            <DashboardBar />
            <Container fluid hidden={globalSelection.isLoading}>
                <Row>
                    <Col><h5>Current Period</h5></Col>
                </Row>
                <Row className="dashboard-widget-table">
                    <Col className="col-lg-4 col-md-6 stat-block-container">
                        <div className="stat-block">
                            <FaDollarSign size="2em" />
                            <div>Transactions:</div>
                            <span>{totalPurchases}</span>
                            <div className="second">
                                <div>Total revenue:</div>
                                <span>${totalRevenue.toFixed(2)}</span>
                            </div>
                        </div>
                    </Col>
                    <Col className="col-lg-4 col-md-6 stat-block-container">
                        <div className="stat-block">
                            <FaTicketAlt size="2em" />
                            <div>Tickets:</div>
                            <span>{totalTickets}</span>
                            <div className="second">
                                <div>Refunds:</div>
                                <span>{totalTicketsRefunded}</span>
                            </div>
                        </div>
                    </Col>
                    <Col className="col-lg-4 col-md-6 stat-block-container">
                        <div className="stat-block">
                            <FaMoneyBillAlt size="2em" />
                            <div>Revenue:</div>
                            <span>${totalTicketRevenue.toFixed(2)}</span>
                            <div className="second">
                                <div>Service Fees:</div>
                                <span>${totalServiceFees.toFixed(2)}</span>
                            </div>
                        </div>
                    </Col>
                </Row>        
                <Row>
                    <Col><h5>Sales Stats</h5></Col>
                </Row>  
                <Row className="dashboard-sales-table">
                    <Col xxl={2} xl={3} lg={4} md={6} className="stat-block-container">
                        <TopSellersWidget topSellers={topSellers} dateRange={dateRange} />
                    </Col>
                    <Col xxl={2} xl={3} lg={4} md={6} className="stat-block-container">
                        <TopSellingLocationsWidget topSellers={topLocations} title="Locations" dateRange={dateRange} />
                    </Col>
                    <Col xxl={2} xl={3} lg={4} md={6} className="stat-block-container">
                        <TopSellingLocationsWidget topSellers={topVenues} title="Venues" dateRange={dateRange} />
                    </Col>
                    <Col xxl={2} xl={3} lg={4} md={6} className="stat-block-container">
                        <MonthToDateWidget DashBoardData={currentDashboardSelection.currentDashboardData} />
                    </Col>
                    <Col xxl={2} xl={3} lg={4} md={6} className="stat-block-container">
                        <RevenueGoalsWidget percentTitle="Monthly Goal" amount={currentDashboardSelection.currentDashboardData?.monthToDateTotalRevenue} 
                            totalGoal={currentDashboardSelection.currentDashboardData?.totals?.monthlyRevenueGoal}
                            percentGoal={currentDashboardSelection.currentDashboardData?.percentMonthlyGoal} />
                    </Col>
                    <Col xxl={2} xl={3} lg={4} md={6} className="stat-block-container">
                        <YearToDateWidget totals={currentDashboardSelection.currentDashboardData?.totals} 
                            projectedYearTotalRevenue={currentDashboardSelection.currentDashboardData?.projectedYearTotalRevenue} />
                    </Col>
                    <Col xxl={2} xl={3} lg={4} md={6} className="stat-block-container">
                        <RevenueGoalsWidget percentTitle="Yearly Goal" amount={currentDashboardSelection.currentDashboardData?.totals?.totalRevenueUsd} 
                            totalGoal={currentDashboardSelection.currentDashboardData?.totals?.yearlyRevenueGoal}
                            percentGoal={currentDashboardSelection.currentDashboardData?.percentYearlyGoal} />
                    </Col>
                    <Col xxl={2} xl={3} lg={4} md={6} className="stat-block-container">
                        <SalesPerMonthWidget salesPerMonth={currentDashboardSelection.currentDashboardData?.salesPerMonth} />
                    </Col>                    
                    <Col xxl={2} xl={3} lg={4} md={6} className="stat-block-container">
                        <SalesPerDayOfWeekWidget salesPerDayMonth={currentDashboardSelection.currentDashboardData?.salesPerDayMonth} 
                            salesPerDayYear={currentDashboardSelection.currentDashboardData?.salesPerDayYear} />
                    </Col>
                    {accountTotalWidgets}
                </Row>
                <Row>
                    <Col>
                        <TicketSalesChart TicketSalesData={chartSalesData} ChartsHidden={chartsHidden} HideRevenue={false} HideMobile={hideTicketChart} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table height={550} bordered cellBordered isTree rowKey="PurchaseDate" data={ticketSalesData} shouldUpdateScroll={false}>
                            <Column flexGrow={2}>
                                <HeaderCell>Date</HeaderCell>
                                <Cell dataKey="PurchaseDate"></Cell>
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>Transactions</HeaderCell>
                                <Cell dataKey="Purchases"></Cell>
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>Tickets Sold</HeaderCell>
                                <Cell dataKey="Tickets"></Cell>
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>Ticket Revenue (USD)</HeaderCell>
                                <Cell>{ rowData => `$${parseFloat(rowData.Revenue).toFixed(2)}` }</Cell>
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>Service Fees (USD)</HeaderCell>
                                <Cell>{ rowData => `$${parseFloat(rowData.ServiceFees).toFixed(2)}` }</Cell>
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>Total Revenue (USD)</HeaderCell>
                                <Cell>{ rowData => `$${parseFloat(rowData.TotalRevenue).toFixed(2)}` }</Cell>
                            </Column>
                        </Table>         
                    </Col>
            </Row>       
            </Container>
        </>
    );
}
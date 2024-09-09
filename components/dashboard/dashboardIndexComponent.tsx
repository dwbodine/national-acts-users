import { Col, Container, Row } from "react-bootstrap";
import DashboardBar from "./dashboardBarComponent"
import TicketSalesChart from "../common/ticketSalesChartComponent";
import { GetOrdersResponse, ITicketSalesData } from "@/types/event";
import { useEffect, useState } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import { FULL_PAGE_CHART_BREAKPOINT } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import UserActivityWidget from "./userActivityWidgetComponent";
import { setReloadDashboardOrders, setCurrentDashboardData } from "@/lib/dashboardSelectionSlice";
import { CirclesWithBar } from "react-loader-spinner";
import { Table } from "rsuite";
import { useGetOrders } from "@/hooks/useGetOrders";
import { getDashboardDataFromOrders } from "@/utils/getDashboardDataFromOrders";
import { FaDollarSign, FaMoneyBillAlt, FaTicketAlt } from "react-icons/fa";
export default function DashboardIndex() {

    const currentDashboardSelection = useSelector((state: RootState) => state.dashboardSelecton);
    const [isLoading, setIsLoading] = useState(false);
    const [chartsHidden, setChartsHidden] = useState(true);
    const { Column, HeaderCell, Cell } = Table;

    const dispatch = useDispatch();
    const windowSize = useWindowSize();
    const { getOrders } = useGetOrders();
    const windowSizeJson = JSON.stringify(windowSize);
    const hideTicketChart = windowSize.width < FULL_PAGE_CHART_BREAKPOINT;

    useEffect(() => {
        if (currentDashboardSelection.reloadOrders) {
            dispatch (
                setReloadDashboardOrders(false)
            );
            setIsLoading(true);
            setChartsHidden(true);
            getOrders(currentDashboardSelection)
                .then((response: GetOrdersResponse) => {
                    if (response.orders && response.orders.length > 0 && !response.orderError) {
                        const dashData = getDashboardDataFromOrders(response.orders);
                        dispatch (
                            setCurrentDashboardData(dashData)
                        );
                    } else {
                        dispatch (
                            setCurrentDashboardData({
                                orders: [],
                                revenue: 0,
                                purchases: 0,
                                ticketSalesData: []
                            })
                        );
                    }
                    setIsLoading(false);
                    setChartsHidden(false);
                });
        } else {
            if (chartsHidden) {
                setChartsHidden(false);
            }
        }
    }, [currentDashboardSelection, dispatch, getOrders, windowSizeJson, chartsHidden]);

    const totalTickets = currentDashboardSelection.currentDashboardData?.tickets ?? 0;
    const totalRevenue = currentDashboardSelection.currentDashboardData?.revenue ?? 0;
    const totalServiceFees = currentDashboardSelection.currentDashboardData?.serviceFees ?? 0;
    const totalPurchases = currentDashboardSelection.currentDashboardData?.purchases ?? 0;
    const ticketSalesData = currentDashboardSelection.currentDashboardData?.ticketSalesData ?? undefined;
    let chartSalesData: ITicketSalesData[] = [];
    if (ticketSalesData) {
        let j = 0;
        for (let i = ticketSalesData.length-1; i >= 0; i--) {
            chartSalesData[j] = ticketSalesData[i];
            j++;
        }
    }

    return (
        <>
            <DashboardBar />
            <Container fluid hidden={!isLoading}>
                <Row>
                    <Col className="spinner-container" hidden={!isLoading}>
                        <CirclesWithBar height="100" width="100" color="#d12610" visible={isLoading} />
                    </Col>
                </Row>
            </Container>
            <Container fluid hidden={isLoading}>
                <Row className="dashboard-widget-table">
                    <Col className="col-lg-3 col-md-6 stat-block-container">
                        <div className="stat-block">
                            <FaDollarSign size="2em" />
                            <div>Total purchases:</div>
                            <span>{totalPurchases}</span>
                        </div>
                    </Col>
                    <Col className="col-lg-3 col-md-6 stat-block-container">
                        <div className="stat-block">
                            <FaTicketAlt size="2em" />
                            <div>Total tickets sold:</div>
                            <span>{totalTickets}</span>
                        </div>
                    </Col>
                    <Col className="col-lg-3 col-md-6 stat-block-container">
                        <div className="stat-block">
                            <FaMoneyBillAlt size="2em" />
                            <div>Total revenue:</div>
                            <span>${totalRevenue.toFixed(2)}</span>
                            <div className="second">
                                <div>Service Fees:</div>
                                <span>${totalServiceFees.toFixed(2)}</span>
                            </div>
                        </div>
                    </Col>
                    <Col className="col-lg-3 col-md-6 stat-block-container">
                        <UserActivityWidget />          
                    </Col>
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
                                <HeaderCell>Purchases</HeaderCell>
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
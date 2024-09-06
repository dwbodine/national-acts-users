import { Button, Col, Container, Row } from "react-bootstrap";
import DashboardBar from "./dashboardBarComponent"
import TicketSalesChart from "../common/ticketSalesChartComponent";
import { GetOrdersResponse } from "@/types/event";
import { useEffect, useState } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import { FULL_PAGE_CHART_BREAKPOINT } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import UserActivityWidget from "./userActivityWidgetComponent";
import moment from "moment";
import { setReloadDashboardOrders, setCurrentDashboardData } from "@/lib/dashboardSelectionSlice";
import { CirclesWithBar } from "react-loader-spinner";
import { Table } from "rsuite";
import { useGetOrders } from "@/hooks/useGetOrders";
import { useGetExport } from "@/hooks/useGetExport";
import getFileNameFromDashboardReportSelection from "@/utils/getFileNameFromDashboardReportSelection";
import downloadFile from "@/utils/downloadFile";
import { getDashboardDataFromOrders } from "@/utils/getDashboardDataFromOrders";
import { FaMoneyBillAlt, FaShirtsinbulk, FaTicketAlt } from "react-icons/fa";
export default function DashboardIndex() {

    const currentDashboardSelection = useSelector((state: RootState) => state.dashboardSelecton);
    const [isLoading, setIsLoading] = useState(false);
    const [chartsHidden, setChartsHidden] = useState(true);
    const { Column, HeaderCell, Cell } = Table;

    const dispatch = useDispatch();
    const windowSize = useWindowSize();
    const { getOrders } = useGetOrders();
    const { exportDashboardOrdersToCsv } = useGetExport();
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
                                tickets: 0,
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

    const exportDashboardData = () => {
        if (!currentDashboardSelection.currentDashboardData || !currentDashboardSelection.currentDashboardData.orders || currentDashboardSelection.currentDashboardData.orders.length == 0) {
            return;
        }
        
        const csvData = exportDashboardOrdersToCsv(currentDashboardSelection);
        const fileName = getFileNameFromDashboardReportSelection('dashboard-orders', currentDashboardSelection);
        downloadFile(fileName, csvData);        
    };

    const startDate = moment.unix(currentDashboardSelection.start).format('M/D/YYYY');
    const endDate = moment.unix(currentDashboardSelection.end).format('M/D/YYYY');

    const totalTickets = currentDashboardSelection.currentDashboardData?.tickets ?? 0;
    const totalRevenue = currentDashboardSelection.currentDashboardData?.revenue ?? 0;
    const totalShirts = currentDashboardSelection.currentDashboardData?.shirts ?? 0;
    const ticketSalesData = currentDashboardSelection.currentDashboardData?.ticketSalesData ?? undefined;

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
                <Row>
                    <Col>
                        <h5>Admin dashboard - orders from {startDate} to {endDate}</h5>
                    </Col>
                    <Col className="align-right">
                        <Button onClick={exportDashboardData}>Export</Button>
                    </Col>
                </Row>
                <Row className="dashboard-widget-table">
                    <Col className="col-lg-3 col-md-6 stat-block-container">
                        <UserActivityWidget />          
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
                        </div>
                    </Col>
                    <Col className="col-lg-3 col-md-6 stat-block-container">
                        <div className="stat-block">
                            <FaShirtsinbulk size="2em" />
                            <div>Total shirts sold:</div>
                            <span>{totalShirts ? totalShirts : 'n/a'}</span>
                        </div>
                    </Col>
                </Row>                
                <Row>
                    <Col>
                        <TicketSalesChart TicketSalesData={ticketSalesData} ChartsHidden={chartsHidden} HideRevenue={false} HideMobile={hideTicketChart} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table height={550} bordered cellBordered isTree rowKey="PurchaseDate" data={ticketSalesData} shouldUpdateScroll={false}>
                            <Column flexGrow={4}>
                                <HeaderCell>Purchase Date</HeaderCell>
                                <Cell dataKey="PurchaseDate"></Cell>
                            </Column>
                            <Column flexGrow={4}>
                                <HeaderCell>Tickets Sold</HeaderCell>
                                <Cell dataKey="Tickets"></Cell>
                            </Column>
                            <Column flexGrow={4}>
                                <HeaderCell>Revenue (USD)</HeaderCell>
                                <Cell>{ rowData => `$${parseFloat(rowData.Revenue).toFixed(2)}` }</Cell>
                            </Column>
                        </Table>         
                    </Col>
            </Row>       
            </Container>
        </>
    );
}
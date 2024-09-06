import { Button, Col, Container, Row } from "react-bootstrap";
import DashboardBar from "./dashboardBarComponent"
import TicketSalesChart from "../common/ticketSalesChartComponent";
import { GetOrdersResponse, ITicketSalesData, VipEvent } from "@/types/event";
import { useEffect, useState } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import { FULL_PAGE_CHART_BREAKPOINT } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import UserActivityWidget from "./userActivityWidgetComponent";
import moment from "moment";
import { setReloadDashboardOrders, setCurrentDashboardOrders, setCurrentDashboardTicketSalesData } from "@/lib/dashboardSelectionSlice";
import { CirclesWithBar } from "react-loader-spinner";
import { Table } from "rsuite";
import { useGetOrders } from "@/hooks/useGetOrders";
import { getPurchaseDataFromOrders } from "@/utils/getPurchaseDataFromOrders";
import { useGetExport } from "@/hooks/useGetExport";
import getFileNameFromDashboardReportSelection from "@/utils/getFileNameFromDashboardReportSelection";
import downloadFile from "@/utils/downloadFile";

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
                        dispatch(
                            setCurrentDashboardOrders(response.orders)
                        );
                        const tsData = getPurchaseDataFromOrders(response.orders);
                        dispatch (
                            setCurrentDashboardTicketSalesData(tsData)
                        );
                    } else {
                        dispatch(
                            setCurrentDashboardOrders([])
                        );
                        dispatch (
                            setCurrentDashboardTicketSalesData([])
                        );
                    }
                    setIsLoading(false);
                    setChartsHidden(false);
                });
        } else if (chartsHidden) {
            setChartsHidden(false);
        }
    }, [currentDashboardSelection, dispatch, getOrders, windowSizeJson, chartsHidden]);

    const exportDashboardData = () => {
        if (!currentDashboardSelection.currentOrders || currentDashboardSelection.currentOrders.length == 0) {
            return;
        }
        
        const csvData = exportDashboardOrdersToCsv(currentDashboardSelection);
        const fileName = getFileNameFromDashboardReportSelection('dashboard-orders', currentDashboardSelection);
        downloadFile(fileName, csvData);        
    };

    const startDate = moment.unix(currentDashboardSelection.start).format('M/D/YYYY');
    const endDate = moment.unix(currentDashboardSelection.end).format('M/D/YYYY');

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
                <Row>
                    <Col className="dashboard-widget-table">
                        <UserActivityWidget />          
                    </Col>
                </Row>                
                <Row>
                    <Col>
                        <TicketSalesChart TicketSalesData={currentDashboardSelection.currentTicketSalesData} ChartsHidden={chartsHidden} HideRevenue={false} HideMobile={hideTicketChart} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table height={550} bordered cellBordered isTree rowKey="PurchaseDate" data={currentDashboardSelection.currentTicketSalesData} shouldUpdateScroll={false}>
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
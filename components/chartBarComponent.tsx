import { Row, Col } from "react-bootstrap";
import { IOrderKeys, IRevenueKeys, IShirtData, ITicketData } from "@/types/event";
import RevenueChart from "./revenueChartComponent";
import OrderChart from "./orderChartComponent";
import TicketTypesChart from "./ticketTypesChartComponent";
import ShirtSizesChart from "./shirtSizesChartComponent";


export default function ChartBar(props: any) {

    const chartsHidden: boolean = props.ChartsHidden as boolean;
    const isLoading: boolean = props.IsLoading as boolean;
    const totalTickets: number = props.TotalTickets as number;
    const totalRevenue: number = props.TotalRevenue as number;
    const totalShirts: number = props.TotalShirts as number;
    const totalOrders: number = props.TotalOrders as number;
    const revenueData: IRevenueKeys[] = props.RevenueData as IRevenueKeys[];
    const orderData: IOrderKeys[] = props.OrderData as IOrderKeys[];
    const ticketData: ITicketData | undefined = props.TicketData as ITicketData | undefined;
    const shirtData: IShirtData | undefined = props.ShirtData as IShirtData | undefined;
    
    return (
        <Row hidden={chartsHidden || isLoading}>
            <Col xl={6} xxl={3} className="chartColumn" hidden={!revenueData}>
                <RevenueChart ChartHidden={chartsHidden || !revenueData} RevenueData={revenueData} TotalRevenue={totalRevenue} />
            </Col>
            <Col xl={6} xxl={3} className="chartColumn" hidden={!orderData}>
                <OrderChart ChartHidden={chartsHidden || !orderData} OrderData={orderData} TotalOrders={totalOrders} />
            </Col>
            <Col xl={6} xxl={3} className="chartColumn" hidden={!ticketData}>
                <TicketTypesChart ChartHidden={chartsHidden || !ticketData} TicketData={ticketData} TotalTickets={totalTickets} />
            </Col>
            <Col xl={6} xxl={3} className="chartColumn" hidden={!shirtData}>
                <ShirtSizesChart ChartHidden={chartsHidden || !shirtData} ShirtData={shirtData} TotalShirts={totalShirts} />
            </Col>
        </Row>
    )
}
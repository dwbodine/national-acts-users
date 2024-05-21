import { Row, Col } from "react-bootstrap";
import RevenueWidget from "./revenueWidgetComponent";
import ShirtSizesWidget from "./shirtSizesWidgetComponent";
import ShowsListedWidget from "./showsListedWidgetComponent";
import TicketTypesWidget from "./ticketTypesWidgetComponent";
import { IShirtData, ITicketData } from "@/types/event";


export default function WidgetBar(props: any) {

    const totalShows: number = props.TotalShows as number;
    const totalTickets: number = props.TotalTickets as number;
    const totalRevenue: number = props.TotalRevenue as number;
    const totalShirts: number = props.TotalShirts as number;
    const ticketData: ITicketData | undefined = props.TicketData as ITicketData | undefined;
    const shirtData: IShirtData | undefined = props.ShirtData as IShirtData | undefined;
    const hideRevItem = props.HideRevenue as boolean;
    
    return (
        <Row className="no-print" hidden={!totalShows}>
            <Col lg={2} md={5} className="stat-block">
                <ShowsListedWidget TotalShows={totalShows} />
            </Col>
            <Col hidden={totalTickets == 0} lg={2} md={5} className="stat-block">
                <TicketTypesWidget TicketData={ticketData} TotalTickets={totalTickets} />
            </Col>
            <Col hidden={totalShirts == 0} lg={2} md={5} className="stat-block">
                <ShirtSizesWidget ShirtData={shirtData} TotalShirts={totalShirts} />
            </Col>
            <Col hidden={hideRevItem} lg={2} md={5} className="stat-block">
                <RevenueWidget TotalRevenue={totalRevenue} />
            </Col>
        </Row>
    )
}
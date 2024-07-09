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
    const ticketsRefunded: number = props.TicketsRefunded as number;
    
    return (
        <Row className="no-print widget-row" hidden={!totalShows}>
            <Col lg={3} sm={6} xs={6} className="widget-col">
                <ShowsListedWidget TotalShows={totalShows} />
            </Col>
            <Col hidden={totalTickets == 0} lg={3} sm={6} xs={6} className="widget-col">
                <TicketTypesWidget TicketData={ticketData} TotalTickets={totalTickets} TicketsRefunded={ticketsRefunded} />
            </Col>
            <Col hidden={totalShirts == 0} lg={3} sm={6} xs={6} className="widget-col">
                <ShirtSizesWidget ShirtData={shirtData} TotalShirts={totalShirts} />
            </Col>
            <Col hidden={hideRevItem} lg={3} sm={6} xs={6} className="widget-col">
                <RevenueWidget TotalRevenue={totalRevenue} />
            </Col>
        </Row>
    )
}
import { IShirtData, IShirtSizeData, ITicketData, ITicketTypeData, VipEvent } from "@/types/event";
import React from 'react';
import moment from "moment";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../src/lib/store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { setSelectedEvent } from '@/lib/reportSelectionSlice';
import { Button } from "react-bootstrap";
import { getTicketDataFromEvents } from "@/utils/getTicketData";
import TicketTypeBreakdown from "./ticketTypeBreakdownComponent";
import { getShirtDataFromEvents } from "@/utils/getShirtData";
import ShirtSizeBreakdown from "./shirtSizeBreakdownComponent";
import OrderRow from "./orderRowComponent";

export default function EventDetail(props: any) {
    const dispatch = useDispatch(); 
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

    const vipEvent: VipEvent | undefined = currentReportSelection?.selectedEvent;
    const isAdmin = props.IsAdmin as boolean;
    let ticketData: ITicketData | undefined = undefined;
    let shirtData: IShirtData | undefined = undefined;

    let location = '';    
    const hasPhoneData = vipEvent?.hasPhoneData ?? false;
    let hasTicketData: boolean = false;
    let hasShirtData: boolean = false;
    const ticketBreakdownRows: any[] = [];
    const shirtSizeBreakdownRows: any[] = [];
    const orderRows: any[] = [];

    if (vipEvent != undefined) {
        if (vipEvent.venue) {
            location = `${vipEvent.venue.city}, ${vipEvent.venue.state}`;
            if (vipEvent.venue.country && vipEvent.venue.country != "United States" && vipEvent.venue.country != "USA" && vipEvent.venue.country != vipEvent.venue.state) {
                location += ", " + vipEvent.venue.country;
            }
        }    
        
        ticketData = getTicketDataFromEvents([vipEvent]);
        const ticketTypes = ticketData?.TicketTypes;
        if (ticketTypes?.length > 0) {
            hasTicketData = true;
            ticketData.TicketData?.forEach((ticketTypeData: ITicketTypeData[]) => {
                ticketTypes.forEach((ticketType: string) => {
                    var data = ticketTypeData.find(x => x.TicketType == ticketType);
                    var number = 0;
                    if (data) {
                        number = data.Number;
                    }
                    ticketBreakdownRows.push(<TicketTypeBreakdown TicketType={ticketType} NumTickets={number} />);
                });
            });
        }
        shirtData = getShirtDataFromEvents([vipEvent]);
        const shirtSizes = shirtData?.ShirtSizes ?? [];
        if (shirtSizes.length > 0) {            
            hasShirtData = true;
            shirtData?.ShirtData?.forEach((shirtSizeData: IShirtSizeData[]) => {
                shirtSizeData.forEach((shirtSize) => {
                    shirtSizeBreakdownRows.push(<ShirtSizeBreakdown ShirtSize={shirtSize.ShirtSize} NumShirts={shirtSize.Number} />);
                });
            });
        }      
        
        vipEvent.orders?.forEach((order) => {
            orderRows.push(<OrderRow EventDate={vipEvent.eventDate} EventName={vipEvent.title} Order={order} IsAdmin={isAdmin} HasPhoneData={hasPhoneData} HasShirtData={hasShirtData} />);
        });    
    }

    const clearDetailEvent = (): void => {
        dispatch(
            setSelectedEvent(undefined)
        );
    };

    return (
        <>
            {(vipEvent != undefined) ? 
                <Col>
                    <Row>
                        <table className="vipDetailsTable">
                            <tr>
                                <td colSpan={2}>
                                    <Button onClick={clearDetailEvent}>Back</Button>
                                </td>
                            </tr>
                            <tr>
                                <td className="vipLabel">Event:</td>
                                <td className="vipTitle">{vipEvent.title}</td>
                            </tr>
                            <tr>
                                <td className="vipLabel">Venue:</td>
                                <td>{vipEvent.venue?.name} in {location}</td>
                            </tr>
                            <tr>
                                <td className="vipLabel">Date:</td>
                                <td>{moment(vipEvent.eventDate).format('MM/DD/YYYY')}</td>
                            </tr>
                            <tr>
                                <td className="vipLabel">Total Tickets:</td>
                                <td>{vipEvent.totalTickets}</td>
                            </tr>
                            <tr>
                                <td className="vipLabel">Total Revenue:</td>
                                <td>${vipEvent.totalRevenue.toFixed(2)}</td>
                            </tr>
                            <tr hidden={!hasTicketData}>
                                <td className="vipLabel">Ticket Breakdown:</td>
                                <td>{ticketBreakdownRows}</td>
                            </tr>
                            <tr hidden={!hasShirtData}>
                                <td className="vipLabel">Shirt Breakdown:</td>
                                <td>{shirtSizeBreakdownRows}</td>
                            </tr>
                        </table>
                    </Row>
                    <Row>
                        <table className="vipTable">
                            <thead>
                                <tr>
                                    <th>Purchaser Name</th>
                                    <th>Attendee Name</th>
                                    <th>Purchase Date</th>
                                    <th>Event Date</th>
                                    <th>Event Name</th>
                                    <th>Ticket Type</th>
                                    <th># of tickets</th>
                                    <th>Revenue</th>
                                    <th>Email</th>
                                    {(hasPhoneData) ? <th>Phone #</th> : ''}
                                    {(hasShirtData) ? <th>Shirt Sizes</th> : ''}
                                    {(isAdmin) ? <th colSpan={2}>Admin Commands</th> : ''}
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { orderRows }
                            </tbody>
                        </table>
                    </Row>
                </Col>
            : ''}        
        </>
    );
}
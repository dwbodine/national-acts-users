import { IShirtData, IShirtSizeData, ITicketData, ITicketTypeData, VipEvent } from "@/types/event";
import React, { ChangeEvent, useEffect, useState } from 'react';
import moment from "moment";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button, FormCheck } from "react-bootstrap";
import { getTicketDataFromEvents } from "@/utils/getTicketData";
import { getShirtDataFromEvents } from "@/utils/getShirtData";
import OrderRow from "./orderRowComponent";
import { useGetLocation } from "@/hooks/useGetLocation";
import { useGetExport } from "@/hooks/useGetExport";
import getFileNameFromReportSelection from "@/utils/getFileNameFromReportSelection";
import downloadFile from "@/utils/downloadFile";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { cacheCurrentReportSelection, restoreCurrentReportSelection } from "@/lib/cache";
import { UserReportSelection } from "@/types/user";
import { useGetEvents } from "@/hooks/useGetEvents";
import { CirclesWithBar } from "react-loader-spinner";
import PrintButton from "./printButtonComponent";

export default function EventDetail(props: any) {
    const { user } = useCurrentUser();
    const isAdmin = user.isAdmin;
    const showInactive = user.showInactiveEvents;
    const { getLocation } = useGetLocation();
    const { exportEventCustomerDataToCsv } = useGetExport();
    const [currentReportSelection, setCurrentReportSelection] = useState<UserReportSelection | undefined>(undefined);
    const [checkChanged, setCheckChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { getEvents } = useGetEvents();
    const hideRev: boolean = currentReportSelection?.hideRevenue ?? false;

    const id: number | undefined = props.Id as number;
    
    useEffect(() => {        
        const selection = restoreCurrentReportSelection();
        if (selection) {
            setCurrentReportSelection(selection);
        }
    }, [checkChanged]);    

    if (!currentReportSelection) {
        return (<></>);
    }

    let vipEvent: VipEvent | undefined = undefined;
    if (id && currentReportSelection?.currentEvents && currentReportSelection.currentEvents.length > 0) {
        vipEvent = currentReportSelection.currentEvents.find(x => x.ticketSocketEventId == id);
    }    
    
    let ticketData: ITicketData | undefined = undefined;
    let shirtData: IShirtData | undefined = undefined;

    let location = '';    
    const hasPhoneData = vipEvent?.hasPhoneData ?? false;
    let hasTicketData: boolean = false;
    let hasShirtData: boolean = false;
    const hasNonUsaOrders: boolean = vipEvent?.hasNonUSAOrders ?? false;
    const currencySymbol: string | undefined = vipEvent?.nonUsaCurrencySymbol;
    const currencyAbbrev: string | undefined = vipEvent?.nonUsaCurrencyAbbrev;
    const ticketBreakdownRows: any[] = [];
    const shirtSizeBreakdownRows: any[] = [];
    const orderRows: any[] = [];

    const exportOrdersToCsv = () => {
        if (vipEvent != undefined) {
            const csvData = exportEventCustomerDataToCsv(vipEvent, hasPhoneData, hasNonUsaOrders, currencySymbol, currencyAbbrev);
            const fileName = getFileNameFromReportSelection(currentReportSelection, 'orders');
            downloadFile(fileName, csvData);
        }
    };

    if (vipEvent != undefined) {
        if (vipEvent.venue) {
            location = getLocation(vipEvent.venue);
        }    
        
        ticketData = getTicketDataFromEvents([vipEvent]);
        const ticketTypes = ticketData?.TicketTypes;
        if (ticketTypes?.length > 0) {
            hasTicketData = true;
            let i = 0;
            ticketData.TicketData?.forEach((ticketTypeData: ITicketTypeData[]) => {
                ticketTypes.forEach((ticketType: string) => {
                    const key = `ttd${i}`;
                    var data = ticketTypeData.find(x => x.TicketType == ticketType);
                    var number = 0;
                    if (data) {
                        number = data.Number;
                    }
                    ticketBreakdownRows.push(<div key={key}>{ticketType} ({number})</div>);
                    i++;
                });
            });
        }
        shirtData = getShirtDataFromEvents([vipEvent]);
        const shirtSizes = shirtData?.ShirtSizes ?? [];
        if (shirtSizes.length > 0) {            
            hasShirtData = true;
            let i = 0;
            shirtData?.ShirtData?.forEach((shirtSizeData: IShirtSizeData[]) => {
                shirtSizeData.forEach((shirtSize) => {
                    const key = `ssd${i}`;
                    shirtSizeBreakdownRows.push(<div key={key}>{shirtSize.ShirtSize} ({shirtSize.Number})</div>);
                    i++;
                });
            });
        }      
        
        let i = 0;
        vipEvent.orders?.forEach((order) => {
            const key = `or${i}`;
            const showOrder = (!order.isDeleted && order.isActive) || (order.isDeleted && currentReportSelection?.showDeletedOrders) || (!order.isActive && currentReportSelection?.showInactiveOrders);
            if (showOrder) {
                orderRows.push(<OrderRow key={key} EventDate={vipEvent?.eventDate} EventName={vipEvent?.title} Order={order} IsAdmin={isAdmin} HasPhoneData={hasPhoneData} HasShirtData={hasShirtData} HideRevenue={hideRev} />);
            }            
            i++;
        });    
    }

    const handleShowInactive = async (event: ChangeEvent<HTMLInputElement>) => {
        if (currentReportSelection) {
            setIsLoading(true);
            let reportSelection = { ...currentReportSelection };
            const previousInactive = reportSelection.showInactiveOrders;
            const newInactive = event.target.checked;
            reportSelection.showInactiveOrders = newInactive;
            reportSelection.reloadEvents = (previousInactive != newInactive);
            if (!reportSelection.retainDateSelection) {
                reportSelection.start = 0;
                reportSelection.end = 0;
            }
            if (reportSelection.reloadEvents) {
                reportSelection.currentEvents = [];
                const response = await getEvents(reportSelection);
                if (response.events && response.events.length > 0) {
                    reportSelection.currentEvents = response.events;
                }                
            }
            cacheCurrentReportSelection(reportSelection);
            setCheckChanged(!checkChanged);
            setIsLoading(false);
        }
    };

    const handleShowDeleted = async (event: ChangeEvent<HTMLInputElement>) => {
        if (currentReportSelection) {
            setIsLoading(true);
            let reportSelection = { ...currentReportSelection };
            const previousDeleted = reportSelection.showDeletedOrders;
            const newDeleted = event.target.checked;
            reportSelection.showDeletedOrders = newDeleted;
            reportSelection.showInactiveOrders = reportSelection.showDeletedOrders;
            reportSelection.reloadEvents = (previousDeleted != newDeleted);
            if (!reportSelection.retainDateSelection) {
                reportSelection.start = 0;
                reportSelection.end = 0;
            }
            if (reportSelection.reloadEvents) {
                reportSelection.currentEvents = [];
                const response = await getEvents(reportSelection);
                if (response.events && response.events.length > 0) {
                    reportSelection.currentEvents = response.events;
                }                
            }
            cacheCurrentReportSelection(reportSelection);
            setCheckChanged(!checkChanged);
            setIsLoading(false);
        }
    };

    const handleHideRevenue = async(event: ChangeEvent<HTMLInputElement>) => {
        if (currentReportSelection) {
            let reportSelection = { ...currentReportSelection };
            reportSelection.hideRevenue = event.target.checked;
            cacheCurrentReportSelection(reportSelection);
            setCheckChanged(!checkChanged);
        }
    };    

    return (
        <>
            {(vipEvent != undefined) ? 
            <>  
                <Col>
                    <Row>
                        <table className="vipDetailsTable">
                            <tbody>
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
                                <tr hidden={hideRev}>
                                    <td className="vipLabel">Total Revenue:</td>
                                    <td>${vipEvent.totalRevenue?.toFixed(2)}</td>
                                </tr>
                                <tr hidden={!hasTicketData}>
                                    <td className="vipLabel">Ticket Breakdown:</td>
                                    <td>{ticketBreakdownRows}</td>
                                </tr>
                                <tr hidden={!hasShirtData}>
                                    <td className="vipLabel">Shirt Breakdown:</td>
                                    <td>{shirtSizeBreakdownRows}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Row>
                    <Row hidden={!isLoading}>
                        <Col className="spinner-container" hidden={!isLoading}>
                            <CirclesWithBar height="100" width="100" color="#d12610" visible={isLoading} />
                        </Col>
                    </Row>
                    <Row hidden={!isAdmin || !showInactive || isLoading} className="no-print">
                        <Col md={1} sm={1}>
                            <span className="admin-button">
                                <Button onClick={exportOrdersToCsv}>Export to Csv</Button>
                            </span>
                        </Col>
                        <Col md={1} sm={11}>
                            <PrintButton />
                        </Col>
                        <Col md={10} sm={12}>
                            <span className="inactive-check">
                                <FormCheck checked={currentReportSelection?.showInactiveOrders} onChange={handleShowInactive} disabled={currentReportSelection?.showDeletedOrders} /> Show Inactive Orders?
                            </span>
                            <span className="inactive-check">
                                <FormCheck checked={currentReportSelection?.showDeletedOrders} onChange={handleShowDeleted} /> Show Deleted Orders?
                            </span>
                            <span className="inactive-check">
                                <FormCheck checked={currentReportSelection?.hideRevenue} onChange={handleHideRevenue} /> Hide Revenue Items?
                            </span>
                        </Col>
                    </Row>
                    <Row hidden={isLoading}>
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
                                    <th hidden={hideRev}>Revenue</th>
                                    <th>Email</th>
                                    {(hasPhoneData) ? <th>Phone #</th> : ''}
                                    {(hasShirtData) ? <th>Shirt Sizes</th> : ''}
                                    {(isAdmin) ? <th colSpan={2} className="no-print">Admin Commands</th> : ''}
                                </tr>
                            </thead>
                            <tbody>
                                { orderRows }
                            </tbody>
                        </table>
                    </Row>
                </Col>
            </>
            : ''}        
        </>
    );
}
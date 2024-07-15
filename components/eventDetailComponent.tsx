import { IShirtData, IShirtSizeData, ITicketData, ITicketTypeData, TicketType, VipEvent } from "@/types/event";
import React, { ChangeEvent, useEffect, useState } from 'react';
import moment from "moment";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button, FormCheck } from "react-bootstrap";
import { getTicketDataFromEvents } from "@/utils/getTicketData";
import { getShirtDataFromEvents } from "@/utils/getShirtData";
import OrderRow from "./orderRowComponent";
import { useGetLocation } from "@/hooks/useGetLocation";
import { useGetExport } from "@/hooks/useGetExport";
import downloadFile from "@/utils/downloadFile";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CirclesWithBar } from "react-loader-spinner";
import PrintButton from "./printButtonComponent";
import { useGetEventDetails } from "@/hooks/useGetEventDetails";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setEvents, setHideRevenue, setReloadEvents, setShowDeletedOrders, setShowInactiveOrders, setHideServiceFees } from "@/lib/reportSelectionSlice";
import getFileNameFromEvent from "@/utils/getFileNameFromEvent";
import { UserReportSelection, UserRole } from "@/types/user";
import { useWindowSize } from "@/hooks/useWindowSize";
import isMobileWidth from "@/utils/mobileUtil";
import OrderMobileRow from "./orderMobileRowComponent";

export default function EventDetail(props: any) {
    const { user } = useCurrentUser();
    
    const { getLocation } = useGetLocation();
    const { exportEventCustomerDataToCsv } = useGetExport();
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
    const [checkChanged, setCheckChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { getEventDetails } = useGetEventDetails();
    const dispatch = useDispatch(); 
    const [hideRevItem, setHideRevItem] = useState(true);
    const [hideServiceFeeDisplay, setHideServiceFeeDisplay] = useState(true);
    
    const [vipEvent, setVipEvent] = useState<VipEvent | undefined>(undefined);
    const id: number | undefined = props.Id as number;
    const windowSize = useWindowSize();
    const isMobile = isMobileWidth(windowSize);
    let hasOrders = false;

    const isAdmin = (user.role == UserRole.SystemAdmin);
    const showInactiveEvents = (user.role == UserRole.SystemAdmin || user.role == UserRole.AccountAdmin);
    const showDeletedEvents = (user.role ==  UserRole.SystemAdmin);
    const showServiceFees = (user.role == UserRole.SystemAdmin);
    const showRevenueControls = (user.role == UserRole.SystemAdmin);
    const alwaysShowRevenue = (user.role == UserRole.AccountAdmin || user.role == UserRole.AccountManager);
    const showExports = (user.role == UserRole.SystemAdmin);
    const showPrint = (user.role == UserRole.SystemAdmin);

    useEffect(() => {     
        async function fetchEvent() {
            if (id && currentReportSelection) {
                if (alwaysShowRevenue) {
                    setHideRevItem(false);
                } else if (user.role == UserRole.MerchPerson) {
                    setHideRevItem(true);
                } else {
                    setHideRevItem(currentReportSelection.hideRevenue ?? true);
                }

                if (user.role == UserRole.SystemAdmin) {
                    setHideServiceFeeDisplay(currentReportSelection.hideServiceFees ?? true);
                } else {
                    setHideServiceFeeDisplay(true);
                }      
                
                if (currentReportSelection.reloadEvents) {
                    setIsLoading(true);
                    let reportSelection: UserReportSelection = { ...currentReportSelection };
                    if (!isAdmin) {
                        reportSelection.showInactiveOrders = false;
                    }
                    const results = await getEventDetails(id, reportSelection);
                    if (results && results.events && results.events.length > 0) {
                        setVipEvent(results.events[0]);
                        if (currentReportSelection.currentEvents && results.events[0] != undefined) {
                            const newEvent: VipEvent = results.events[0];
                            document.title = newEvent.title;
                            currentReportSelection.currentEvents.map((evt) => {
                                return evt.ticketSocketEventId == newEvent.ticketSocketEventId ? newEvent : evt;
                            });
                            dispatch (
                                setEvents(currentReportSelection.currentEvents)
                            );
                        } 
                        dispatch (
                            setReloadEvents(false)
                        )
                    }   
                    setIsLoading(false);   
                }                          
            }
        }   
        fetchEvent();
        
    }, [checkChanged, id, currentReportSelection, dispatch, getEventDetails, isAdmin, alwaysShowRevenue, user.role]);

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
            const csvData = exportEventCustomerDataToCsv(vipEvent, isAdmin, hasPhoneData, hasNonUsaOrders, currencySymbol, currencyAbbrev);
            const fileName = getFileNameFromEvent(vipEvent, `orders`);
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
                ticketTypes.forEach((ticketType: TicketType) => {
                    const key = `ttd${i}`;
                    var data = ticketTypeData.find(x => x.TicketType == ticketType.ticketTypeName);
                    var number = 0;
                    var total = '';
                    if (data) {
                        number = data.Number;
                    }
                    if (ticketType.totalAvailable > 0) {
                        total = `/${ticketType.totalAvailable}`;
                    }
                    ticketBreakdownRows.push(<div key={key}>{ticketType.ticketTypeName} ({number}{total})</div>);
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
            hasOrders = true;
            const key = `or${i}`;
            const showOrder = (!order.isDeleted && order.isActive) || (order.isDeleted && currentReportSelection?.showDeletedOrders) || (!order.isActive && currentReportSelection?.showInactiveOrders);
            if (showOrder) {
                if (isMobile) { 
                    orderRows.push(<OrderMobileRow key={key} EventDate={vipEvent?.eventDate} EventName={vipEvent?.title} Order={order} IsAdmin={isAdmin} HasPhoneData={hasPhoneData} HasShirtData={hasShirtData} HideRevenue={hideRevItem} HideServiceFees={hideServiceFeeDisplay} />);
                } else {
                    orderRows.push(<OrderRow key={key} EventDate={vipEvent?.eventDate} EventName={vipEvent?.title} Order={order} IsAdmin={isAdmin} HasPhoneData={hasPhoneData} HasShirtData={hasShirtData} HideRevenue={hideRevItem} HideServiceFees={hideServiceFeeDisplay} />);
                }                
            }            
            i++;
        });    
    }

    const handleShowInactive = async (event: ChangeEvent<HTMLInputElement>) => {
        if (currentReportSelection) {
            dispatch(
                setShowInactiveOrders(event.target.checked)
            );
            setVipEvent(undefined);            
        }
    };

    const handleShowDeleted = async (event: ChangeEvent<HTMLInputElement>) => {
        if (currentReportSelection) {
            dispatch(
                setShowDeletedOrders(event.target.checked)
            );
            setVipEvent(undefined);            
        }
    };

    const handleHideRevenue = async(event: ChangeEvent<HTMLInputElement>) => {
        if (currentReportSelection) {
            dispatch (
                setHideRevenue(event.target.checked)
            );
            setCheckChanged(!checkChanged);
        }
    }; 
    
    const handleHideServiceFees = async(event: ChangeEvent<HTMLInputElement>) => {
        if (currentReportSelection) {
            dispatch (
                setHideServiceFees(event.target.checked)
            );
            setCheckChanged(!checkChanged);
        }
    };  

    return (
        <>
            {(vipEvent != undefined) ? 
            <Container fluid className="vipContainer">  
                <Row>
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
                                    <tr hidden={hideRevItem}>
                                        <td className="vipLabel">Total Revenue:</td>
                                        <td>${vipEvent.totalRevenue?.toFixed(2)}</td>
                                    </tr>
                                    <tr hidden={hideServiceFeeDisplay || !showServiceFees }>
                                        <td className="vipLabel">Total Service Fees:</td>
                                        <td>${vipEvent.totalServiceFees?.toFixed(2)}</td>
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
                        <Row hidden={isLoading} className="no-print">
                            <Col md={10} sm={12} hidden={isMobile}>
                                <div className="admin-button-row">
                                    <span className="admin-button" hidden={!showExports}>
                                        <Button onClick={exportOrdersToCsv}>Export to Csv</Button>
                                    </span>
                                    <PrintButton ShowPrint={showPrint} />
                                </div>
                            </Col>
                            <Col md={10} sm={12}>
                                <span className="inactive-check" hidden={!showInactiveEvents}>
                                    <FormCheck checked={currentReportSelection?.showInactiveOrders} onChange={handleShowInactive} disabled={currentReportSelection?.showDeletedOrders} /> Show Inactive Orders?
                                </span>
                                <span className="deleted-check" hidden={!showDeletedEvents}>
                                    <FormCheck checked={currentReportSelection?.showDeletedOrders} onChange={handleShowDeleted} /> Show Deleted Orders?
                                </span>
                                <span className="revenue-check" hidden={!hasOrders || !showRevenueControls}>
                                    <FormCheck checked={currentReportSelection?.hideRevenue} onChange={handleHideRevenue} /> Hide Revenue Items?
                                </span>
                                <span className="service-fees-check" hidden={!hasOrders || !showServiceFees}>
                                    <FormCheck checked={currentReportSelection?.hideServiceFees} onChange={handleHideServiceFees} /> Hide Service Fees?
                                </span>
                            </Col>
                        </Row>
                        <Row hidden={isLoading} className="vipTable-container">
                            <table className="vipTable">
                                <thead hidden={isMobile}>
                                    <tr>
                                        <th>Purchaser Name</th>
                                        <th>Attendee Name</th>
                                        <th className="no-print">Purchase Date</th>
                                        <th>Event Date</th>
                                        <th>Event Name</th>
                                        <th>Ticket Type</th>
                                        <th># of tickets</th>
                                        <th hidden={hideRevItem}>Revenue</th>
                                        <th className="no-print" hidden={hideServiceFeeDisplay || !showServiceFees}>Service Fees</th>
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
                </Row>
            </Container>
            : ''}        
        </>
    );
}
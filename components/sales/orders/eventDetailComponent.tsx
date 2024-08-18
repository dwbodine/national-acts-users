import { IShirtData, IShirtSizeData, ITicketData, ITicketTypeData, Order, TicketType, VipEvent } from "@/types/event";
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
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
import PrintButton from "../../common/printButtonComponent";
import { useGetEventDetails } from "@/hooks/useGetEventDetails";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setEvents, setHideRevenue, setReloadEvents, setShowDeletedOrders, setShowInactiveOrders, setHideServiceFees, setFocusControl, setEventSeller } from "@/lib/reportSelectionSlice";
import getFileNameFromEvent from "@/utils/getFileNameFromEvent";
import { EnumPermission, UserReportSelection } from "@/types/user";
import { useWindowSize } from "@/hooks/useWindowSize";
import OrderMobileRow from "./orderMobileRowComponent";
import { useHasPermission } from "@/hooks/useHasPermission";
import debouce from "lodash.debounce";
import setFocusToControl from "@/utils/setFocusToControl";

export default function EventDetail(props: any) {
    const { user } = useCurrentUser();
    const { userHasPermission } = useHasPermission();
    const { getLocation } = useGetLocation();
    const { exportEventCustomerDataToCsv } = useGetExport();
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
    const [checkChanged, setCheckChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { getEventDetails } = useGetEventDetails();
    const dispatch = useDispatch(); 
    const [hideRevItem, setHideRevItem] = useState(true);
    const [hideServiceFeeDisplay, setHideServiceFeeDisplay] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [vipEvent, setVipEvent] = useState<VipEvent | undefined>(undefined);
    const id: number | undefined = props.Id as number;

    const windowSize = useWindowSize();
    const windowSizeJson = JSON.stringify(windowSize);

    const viewInactiveEvents = userHasPermission(user, EnumPermission.ViewInactiveEvents);
    const viewDeletedEvents = userHasPermission(user, EnumPermission.ViewDeletedEvents);
    const viewServiceFees = userHasPermission(user, EnumPermission.ViewServiceFees);
    const viewRevenueData = userHasPermission(user, EnumPermission.ViewRevenueData);
    const viewRevenueControls = userHasPermission(user, EnumPermission.ViewRevenueControls);    
    const canExportCustomerData = userHasPermission(user, EnumPermission.ExportCustomerData);
    const viewPrintButton = userHasPermission(user, EnumPermission.ViewPrintButton);
    const changeOrderStatus = userHasPermission(user, EnumPermission.ChangeOrderStatus);
    const canCheckInTickets = userHasPermission(user, EnumPermission.CheckInUsers);
    const alwaysShowRevenue = (viewRevenueData && !viewRevenueControls);

    const debouncedResults = useMemo(() => {
        return debouce(setSearchTerm, 300);
    }, []);

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
    let orderRows: any[] = [];
    let hasOrders = false;
    let searchBarHidden = true;

    useEffect(() => {     
        const fetchEvent = async() => {    
            if (id && currentReportSelection && currentReportSelection.seller && currentReportSelection.seller.sellerId > 0) {
                if (alwaysShowRevenue) {
                    setHideRevItem(false);
                } else if (!viewRevenueData) {
                    setHideRevItem(true);
                } else {
                    setHideRevItem(currentReportSelection.hideRevenue ?? true);
                }

                if (viewServiceFees) {
                    setHideServiceFeeDisplay(currentReportSelection.hideServiceFees ?? true);
                } else {
                    setHideServiceFeeDisplay(true);
                }      
                
                if (currentReportSelection.reloadEvents) {
                    setIsLoading(true);
                    dispatch (
                        setReloadEvents(false)
                    );
                    let reportSelection: UserReportSelection = { ...currentReportSelection };
                    if (!viewInactiveEvents) {
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
                    }   
                    setIsLoading(false);   
                    if (currentReportSelection.focusControl && currentReportSelection.focusControl != '') {
                        const focusControl: string = currentReportSelection.focusControl;
                        setTimeout(() => {
                            setFocusToControl(focusControl);
                        }, 300);                        
                        dispatch (
                            setFocusControl('')
                        );
                    }
                }                          
            } else if (user && user.userId > 0 && user.sellers && user.selectedSellerId > 0) {
                // use cached user to transfer detail to redux in new window
                let reportSelection = {...currentReportSelection};
                const seller = user.sellers.find(x => x.sellerId == user.selectedSellerId);
                if (seller) {
                    reportSelection.seller = seller;
                    reportSelection.hideRevenue = user.selectedHideRevenue;
                    reportSelection.hideServiceFees = user.selectedHideServiceFees;
                    dispatch(
                        setEventSeller(reportSelection)
                    );
                }
            }
        };
        fetchEvent();
        return () => {
            debouncedResults.cancel();
        }
        
    }, [
        checkChanged, 
        id, 
        currentReportSelection, 
        dispatch, 
        getEventDetails, 
        alwaysShowRevenue, 
        viewInactiveEvents, 
        viewRevenueData, 
        viewServiceFees, 
        debouncedResults, 
        windowSizeJson,
        user
    ]);

    const exportOrdersToCsv = () => {
        if (vipEvent != undefined && currentReportSelection) {
            const showServiceFees = viewServiceFees && !currentReportSelection.hideServiceFees;
            const showRevenueData = viewRevenueData && !currentReportSelection.hideRevenue;
            const csvData = exportEventCustomerDataToCsv(vipEvent, showServiceFees, showRevenueData, hasPhoneData, hasNonUsaOrders, currencySymbol, currencyAbbrev);
            const fileName = getFileNameFromEvent(vipEvent, `orders`);
            downloadFile(fileName, csvData);
        }
    };

    const filterOrders = (orders: Order[] | undefined) => {
        let filteredOrders: Order[] | undefined = orders;
        if (searchTerm && searchTerm.length >= 2 && orders && orders.length > 0) {
            const srch = searchTerm.toLowerCase();
            filteredOrders = orders.filter((order) => {
                return order.attendeeNames?.find(x => x.toLowerCase().includes(srch)) || 
                    order.purchaserFirstName.toLowerCase().includes(srch) ||
                    order.purchaserLastName.toLowerCase().includes(srch);
            })
        }
        return filteredOrders;
    };

    if (vipEvent != undefined) {
        if (windowSize.isMobile || (vipEvent.orders && vipEvent.orders.length > 10)) {
            searchBarHidden = false;
        }
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

        const filteredOrders = filterOrders(vipEvent.orders);
        filteredOrders?.forEach((order, i) => { 
            hasOrders = true;
            const key = `or${i}`;
            const showOrder = (!order.isDeleted && order.isActive) || (order.isDeleted && currentReportSelection?.showDeletedOrders) || (!order.isActive && currentReportSelection?.showInactiveOrders);
            if (showOrder) {
                if (windowSize.isMobile) { 
                    orderRows.push(<OrderMobileRow key={key} EventDate={vipEvent?.eventDate} EventName={vipEvent?.title} Order={order} ChangeOrderStatus={changeOrderStatus} HasPhoneData={hasPhoneData} HasShirtData={hasShirtData} HideRevenue={hideRevItem} HideServiceFees={hideServiceFeeDisplay} CanCheckInTickets={canCheckInTickets} />);
                } else {
                    orderRows.push(<OrderRow key={key} EventDate={vipEvent?.eventDate} EventName={vipEvent?.title} Order={order} ChangeOrderStatus={changeOrderStatus} HasPhoneData={hasPhoneData} HasShirtData={hasShirtData} HideRevenue={hideRevItem} HideServiceFees={hideServiceFeeDisplay} CanCheckInTickets={canCheckInTickets} />);
                }                
            }            
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

    const isDennis = (user.username == 'dwbodine@gmail.com' || user.username == 'dwbodine@hotmail.com');

    return (
        <>
            {(vipEvent != undefined) ? 
            <Container fluid className="vipContainer">  
                <Row hidden={!isDennis}>
                    <Col>
                        <div style={{padding: '15px'}}>{windowSize.width} X {windowSize.height} / {windowSize.angle} / {windowSize.orientation} / {windowSize.isMobile}</div>
                    </Col>
                </Row>
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
                                    <tr hidden={!canCheckInTickets} className="no-print">
                                        <td className="vipLabel">Checked In:</td>
                                        <td>{vipEvent.totalCheckedIn} / {vipEvent.totalTickets}</td>
                                    </tr>
                                    <tr hidden={hideRevItem}>
                                        <td className="vipLabel">Total Revenue:</td>
                                        <td>${vipEvent.totalRevenue?.toFixed(2)}</td>
                                    </tr>
                                    <tr hidden={hideServiceFeeDisplay || !viewServiceFees }>
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
                            <Col md={10} sm={12} hidden={windowSize.isMobile}>
                                <div className="admin-button-row">
                                    <span className="admin-button" hidden={!canExportCustomerData}>
                                        <Button onClick={exportOrdersToCsv}>Export to Csv</Button>
                                    </span>
                                    <PrintButton ShowPrint={viewPrintButton} />
                                </div>
                            </Col>
                            <Col md={10} sm={12}>
                                <span className="inactive-check" hidden={!viewInactiveEvents}>
                                    <FormCheck checked={currentReportSelection?.showInactiveOrders} onChange={handleShowInactive} disabled={currentReportSelection?.showDeletedOrders} /> Show Inactive Orders?
                                </span>
                                <span className="deleted-check" hidden={!viewDeletedEvents}>
                                    <FormCheck checked={currentReportSelection?.showDeletedOrders} onChange={handleShowDeleted} /> Show Deleted Orders?
                                </span>
                                <span className="revenue-check" hidden={!hasOrders || !viewRevenueControls}>
                                    <FormCheck checked={currentReportSelection?.hideRevenue} onChange={handleHideRevenue} /> Hide Revenue Items?
                                </span>
                                <span className="service-fees-check" hidden={!hasOrders || !viewServiceFees}>
                                    <FormCheck checked={currentReportSelection?.hideServiceFees} onChange={handleHideServiceFees} /> Hide Service Fees?
                                </span>
                            </Col>
                            <Col md={10} sm={12} className="no-print" hidden={searchBarHidden}>
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="form-control search-text-input"
                                    placeholder="Search for orders..." 
                                    hidden={(isLoading || !orderRows || orderRows.length == 0)}
                                />
                            </Col>
                        </Row>
                        <Row hidden={isLoading} className="vipTable-container">
                            <table className="vipTable">
                                <thead hidden={windowSize.isMobile}>
                                    <tr>
                                        <th>Purchaser Name</th>
                                        <th>Attendee Name</th>
                                        <th className="purchase-date no-print">Purchase Date</th>
                                        <th>Event Date</th>
                                        <th>Event Name</th>
                                        <th>Ticket Type</th>
                                        <th># of tickets</th>
                                        <th hidden={hideRevItem}>Revenue</th>
                                        <th className="no-print" hidden={hideServiceFeeDisplay || !viewServiceFees}>Service Fees</th>
                                        <th>Email</th>
                                        {(hasPhoneData) ? <th>Phone #</th> : ''}
                                        {(hasShirtData) ? <th>Shirt Sizes</th> : ''}
                                        {(changeOrderStatus) ? <th colSpan={2} className="command-column no-print">Commands</th> : ''}
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
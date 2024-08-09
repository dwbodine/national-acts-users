import { ITicketTypeData, TicketType, VipEvent } from "@/types/event";
import React from 'react';
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setEvents } from '@/lib/reportSelectionSlice';
import { useSetEventInactive } from "@/hooks/useSetEventInactive";
import { useSetEventDeleted } from "@/hooks/useSetEventDeleted";
import { useGetLocation } from "@/hooks/useGetLocation";
import router from "next/router";
import { RootState } from "@/lib/store";
import { eventService } from "@/services";
import { Button, Col, Container, Row } from "react-bootstrap";
import { UserSellerType } from "@/types/user";
import { getTicketDataFromEvents } from "@/utils/getTicketData";

export default function EventMobileRow(props: any) {
    const dispatch = useDispatch(); 
    const vipEvent = props.VipEvent as VipEvent;
    const changEventStatus = props.ChangeEventStatus as boolean;
    const hideRevItem = props.HideRevenue as boolean;
    const hideServiceFees = props.HideServiceFees as boolean;
    const canCheckInTickets = props.CanCheckInTickets as boolean;
    const { setEventInactive } = useSetEventInactive();
    const { setEventDeleted } = useSetEventDeleted();
    const { getLocation } = useGetLocation();
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);   
    const eUrl: string = eventService.getEventUrl(); 
    const currentSellerType = currentReportSelection.seller.sellerType;
    const id = `event_${vipEvent.ticketSocketEventId}`;

    const setDetailEvent = () => {
        const url = `/${eUrl}?id=${vipEvent.ticketSocketEventId}`;
        window.open(url, "_blank");
    };

    const activateDeactivateEvent = () => {
        const eventId = vipEvent.ticketSocketEventId;
        const isActive = vipEvent.isActive;
        setEventInactive(eventId, isActive)
            .then((response) => {
                if (!response.success) {
                    if (response.statusCode == 401) {
                        router.push('/logout');
                    } else {
                        console.log(response.eventError);
                    }                    
                    return;
                } else {
                    dispatch(
                        setEvents()
                    );
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const deleteUndeleteEvent = () => {
        const eventId = vipEvent.ticketSocketEventId;
        const isDeleted = vipEvent.isDeleted;
        setEventDeleted(eventId, isDeleted)
            .then((response) => {
                if (!response.success) {
                    if (response.statusCode == 401) {
                        router.push('/logout');
                    } else {
                        console.log(response.eventError);
                    }
                    return;
                } else {
                    dispatch(
                        setEvents()
                    );
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    let statusClass = '';
    if (props.VipEvent.isDeleted) {
        statusClass += 'event-deleted';
    } else if (!props.VipEvent.isActive) {
        statusClass += 'event-inactive';
    }

    const venueName = vipEvent.venue?.name;
    let location = '';
    if (vipEvent.venue) {
        location = getLocation(vipEvent.venue);
    }

    const ticketBreakdownRows: any[] = [];
    let hasTicketData = false;
    const ticketData = getTicketDataFromEvents([vipEvent]);
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
                ticketBreakdownRows.push(<div className="ticket-type" key={key}>{ticketType.ticketTypeName} ({number}{total})</div>);
                i++;
            });
        });
    }

    
    const eventDate = moment(vipEvent.eventDate).format('MM/DD/YYYY');
    const revenue = `$${new Number(vipEvent.totalRevenue).toFixed(2)}`;
    const serviceFees = `$${new Number(vipEvent.totalServiceFees).toFixed(2)}`;
    const inactiveLabel = vipEvent.isActive ? "Deactivate" : "Activate";
    const deletedLabel = vipEvent.isDeleted ? "Undelete" : "Delete";
    const buttonText = currentSellerType == UserSellerType.Venue ? "Customer List" : "VIP List";
        
    return (
        <tr className={'mobile-event-card-container ' + statusClass}>
            <td>
               <Container className="mobile-event-card" id={id}>
                    <Row>
                        <Col>Date:</Col>
                        <Col>{eventDate}</Col>
                    </Row>
                    <Row>
                        <Col>Title:</Col>
                        <Col>{vipEvent.title}</Col>
                    </Row>
                    <Row>
                        <Col>Venue:</Col>
                        <Col>{venueName}</Col>
                    </Row>
                    <Row>
                        <Col>Location:</Col>
                        <Col>{location}</Col>
                    </Row>
                    <Row>
                        <Col>Tickets sold:</Col>
                        <Col>{vipEvent.totalTickets}</Col>
                    </Row>
                    <Row hidden={!canCheckInTickets} className="no-print">
                        <Col>Checked in:</Col>
                        <Col>{vipEvent.totalCheckedIn} / {vipEvent.totalTickets}</Col>
                    </Row>
                    <Row>
                        <Col>Ticket types sold:</Col>
                        <Col>
                            { ticketBreakdownRows }
                        </Col>
                    </Row>
                    <Row hidden={hideRevItem}>
                        <Col>Revenue:</Col>
                        <Col>{revenue}</Col>
                    </Row>
                    <Row hidden={hideServiceFees} className="no-print">
                        <Col>Service Fees:</Col>
                        <Col>{serviceFees}</Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button onClick={setDetailEvent}>{buttonText}</Button>
                        </Col>
                    </Row>
                    <Row className="no-print" hidden={!changEventStatus}>
                        <Col>
                            <Button onClick={activateDeactivateEvent}>{inactiveLabel}</Button>
                            <Button onClick={deleteUndeleteEvent}>{deletedLabel}</Button>
                        </Col>
                    </Row>
               </Container>
            </td>
        </tr>
    );
}
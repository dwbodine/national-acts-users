import { RootState } from "@/lib/store";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import router from 'next/router';
import { Button, Col, FormCheck, Row } from "react-bootstrap";
import { toast } from 'react-toastify';
import { setIsLoading } from "@/lib/globalSelectionSlice";
import { useGetLocation } from "@/hooks/common/useGetLocation";
import moment from "moment";
import ConfirmationDialog from "../../common/confirmationDialogComponent";
import { useRefundEvent } from "@/hooks/admin/useRefundEvent";
import { ModifyEventResponse, VipEvent } from "@/types/event";
import { setAdminEvent, setReloadEvents, setMustSaveEvent } from "@/lib/adminSelectionSlice";
import { useUpdateEvent } from "@/hooks/admin/useUpdateEvent";
import { useGetEventStatus } from "@/hooks/common/useGetEventStatus";
import { DatePicker } from "rsuite";

export default function AdminEventEdit() {
    const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
    const dispatch = useDispatch();
    const { getLocation } = useGetLocation();
    const { refundEvent } = useRefundEvent();
    const { updateEvent } = useUpdateEvent();
    const { getEventStatusText } = useGetEventStatus();
    const [markCancelled, setMarkCancelled] = useState<boolean>(true);
    const [refundServiceFees, setRefundServiceFees] = useState<boolean>(false);

    useEffect(() => {
        if (currentAdminSelection.selectedEvent == undefined) {
            goBack();
        }
    }, [currentAdminSelection, dispatch]);

    const setIsActive = (isActive: boolean) => {
        if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
            return;
        }
        let currentEvent = {...currentAdminSelection.selectedEvent};
        currentEvent.isActive = isActive;
        dispatch(
            setAdminEvent(currentEvent)
        );   
        markDirty();   
    };

    const setIsHidden = (isHidden: boolean) => {
        if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
            return;
        }
        let currentEvent = {...currentAdminSelection.selectedEvent};
        currentEvent.isHidden = isHidden;
        dispatch(
            setAdminEvent(currentEvent)
        );   
        markDirty();   
    };

    const setIsDeleted = (isDeleted: boolean) => {
        if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
            return;
        }
        let currentEvent = {...currentAdminSelection.selectedEvent};
        currentEvent.isDeleted = isDeleted;
        dispatch(
            setAdminEvent(currentEvent)
        );   
        markDirty();   
    };

    const setIsAddedToBandsInTown = (isAddedToBandsInTown: boolean) => {
        if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
            return;
        }
        let currentEvent = {...currentAdminSelection.selectedEvent};
        currentEvent.isAddedToBandsInTown = isAddedToBandsInTown;
        dispatch(
            setAdminEvent(currentEvent)
        );   
        markDirty();   
    };

    const onAnnounceDateChange = (date: Date | null) => {
        if (!date || !currentAdminSelection || !currentAdminSelection.selectedEvent) {
            return;
        }

        if (date <= new Date()) {
            onCleanAnnounceDate();
            return;
        }

        const eventDate = moment(currentAdminSelection.selectedEvent.eventDate).toDate();
        if (date >= eventDate) {
            onCleanAnnounceDate();
            return;
        }

        const announceDate = moment(date).startOf('day');
        let currentEvent = {...currentAdminSelection.selectedEvent};
        currentEvent.announceDate = announceDate.format('YYYY-MM-DD');
        dispatch(
            setAdminEvent(currentEvent)
        );
        markDirty();
    };

    const onCleanAnnounceDate = () => {
        if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
            return;
        }
        let currentEvent = {...currentAdminSelection.selectedEvent};
        currentEvent.announceDate = undefined;
        dispatch(
            setAdminEvent(currentEvent)
        );   
        markDirty();   
    };

    const goBack = (dismissToast: boolean = true) => {
        if (dismissToast) {
            toast.dismiss();
        }            
        dispatch(
            setMustSaveEvent(false)
        );
        router.push('/admin/events/');
    }

    const confirmGoBack = () => {
        if (!currentAdminSelection?.mustSaveEvent) {
            goBack();
            return;
        }

        let message: string = 'You have made changes to this event, are you sure you want to discard them and leave?';
        const toastId = toast.warning(
            <ConfirmationDialog
                Message={message}
                ConfirmText="Honey Badger Don't Care" 
                CancelText="Oh...No"
                OnConfirm={goBack}
                OnCancel={() => { toast.dismiss() }}
                />,
                {
                  position: 'top-left',
                  autoClose: false,
                  closeOnClick: false
                }
        );
    }

    const manageOrders = () => {
        if (!currentAdminSelection.selectedEvent) {
            return;
        }
        router.push('/admin/events/orders/');
    }

    const setTicketTypeStatus = (e: any) => {
        if (currentAdminSelection.selectedEvent == undefined || currentAdminSelection.selectedEvent.ticketTypes == undefined) {
            return;
        }

        const ticketTypeId = parseInt(e.currentTarget.id?.replace('ticketType_', ''));
        if (!isNaN(ticketTypeId) && ticketTypeId > 0) {
            const isChecked = e.currentTarget.checked ?? false;
            let currentEvent = {...currentAdminSelection.selectedEvent};
            currentEvent.ticketTypes = currentEvent.ticketTypes?.map((ticketType) => {
                if (ticketType.ticketTypeId == ticketTypeId) {
                    ticketType = {...ticketType, isActive: isChecked};
                }
                return ticketType;
            });
            dispatch(
                setAdminEvent(currentEvent)
            );
            markDirty();
        }
    };

    const confirmDoRefund = () => {
        let message: string = 'By continuing, ';
        if (markCancelled) {
            message += 'this event will be marked as cancelled and ';
        }
        message += 'all transactions in this event will be marked as refunded in full';
        if (refundServiceFees) {
            message += ', including all service fees';
        }
        const toastId = toast.warning(
            <ConfirmationDialog
                Message={message}
                ConfirmText="Hell Yeah!" 
                CancelText="Oh Shit... No"
                OnConfirm={handleRefund}
                OnCancel={() => { toast.dismiss() }}
                />,
                {
                  position: 'top-left',
                  autoClose: false,
                  closeOnClick: false
                }
        );
    };

    const handleRefund = () => {
        toast.dismiss();
        if (!currentAdminSelection.selectedEvent) {
            return false;
        }
        dispatch (
            setIsLoading(true)
        );
        const eventId = currentAdminSelection.selectedEvent.ticketSocketEventId;
        refundEvent(eventId, markCancelled, refundServiceFees)
            .then((response: ModifyEventResponse) => {
                const success = response.success;
                dispatch (
                    setIsLoading(false)
                );
                if (success) {
                    toast.success('Refund succeeded');
                    dispatch (
                        setReloadEvents(true)
                    );
                    dispatch (
                        setAdminEvent(undefined)
                    );
                    goBack(false);
                } else {
                    toast.error('Refund failed');
                }                
            });
    };

    const markDirty = () => {
        dispatch(
            setMustSaveEvent(true)
        );
    }

    const onSubmit = () => {
        if (!currentAdminSelection.selectedEvent) {
            return false;
        }
        dispatch(
            setIsLoading(true)
        );
        
        let eventToUpdate: VipEvent = {...currentAdminSelection.selectedEvent };
        updateEvent(eventToUpdate).then((response: ModifyEventResponse) => {
            if (response.success) {
                toast.success("Event updated successfully");
                dispatch(
                    setReloadEvents(true)
                );
                dispatch (
                    setAdminEvent(undefined)
                );                
                goBack(false);
            } else {
                toast.error(response.eventError ?? "Error occurred while updating event");
            }
            dispatch(
                setIsLoading(false)
            );
        });
    }

    const pageHeader = "Edit event";

    const eventTitle = (currentAdminSelection.selectedEvent != undefined) ? currentAdminSelection.selectedEvent.title : '';
    const location = (currentAdminSelection.selectedEvent?.venue != undefined) ? getLocation(currentAdminSelection.selectedEvent.venue) : '';
    const eventDate = currentAdminSelection.selectedEvent?.eventDate != undefined ? moment(currentAdminSelection.selectedEvent.eventDate).format('MM/DD/YYYY') : '';
    const refundsDisabled = (currentAdminSelection.selectedEvent == undefined) || currentAdminSelection.selectedEvent.totalTickets == 0;
    const cancelDisabled = (currentAdminSelection.selectedEvent?.isCancelled);
    const cancelTitle = cancelDisabled ? 'Event has already been cancelled': '';
    const announceDate = (currentAdminSelection.selectedEvent != undefined && currentAdminSelection.selectedEvent.announceDate != null) ? moment(currentAdminSelection.selectedEvent.announceDate).toDate() : null;
    const announceDateDisabled = (currentAdminSelection.selectedEvent != undefined && eventDate != undefined) ? moment(eventDate).toDate() < new Date() : false;
    const isActive = currentAdminSelection?.selectedEvent?.isActive ?? false;
    const isDeleted = currentAdminSelection?.selectedEvent?.isDeleted ?? false;
    const isHidden = currentAdminSelection?.selectedEvent?.isHidden ?? false;
    const isAddedToBandsInTown = currentAdminSelection?.selectedEvent?.isAddedToBandsInTown ?? false;

    let ticketTypeRows: any[] = [];
    if (currentAdminSelection.selectedEvent && currentAdminSelection.selectedEvent.ticketTypes && currentAdminSelection.selectedEvent.ticketTypes.length > 0) {
        currentAdminSelection.selectedEvent.ticketTypes.forEach((ticketType, i) => {
            const ticketTypeId = ticketType.ticketTypeId;
            let ticketTypeDisabled = false;
            if (currentAdminSelection.selectedEvent && currentAdminSelection.selectedEvent.orders) {
                for (let i=0; i < currentAdminSelection.selectedEvent.orders.length; i++) {
                    const order = currentAdminSelection.selectedEvent.orders[i];
                    var ticketsWithType = order.tickets?.find(x => x.ticketTypeId == ticketTypeId);
                    if (ticketsWithType != undefined) {
                        ticketTypeDisabled = true;
                        break;
                    }
                }
            }

            const rowTitle = ticketTypeDisabled ? "Cannot change the status of a ticket type with tickets sold" : "";
            const key = `admin_tt${i}`;

            ticketTypeRows.push(<tr key={key}>
                                    <td>{ticketType.ticketTypeName}</td>
                                    <td>
                                        <FormCheck id={`ticketType_${ticketType.ticketTypeId}`} title={rowTitle} 
                                            disabled={ticketTypeDisabled} checked={ticketType.isActive}
                                             onChange={(e) => setTicketTypeStatus(e)} label="Active" /></td></tr>);
        });
    }

    if (ticketTypeRows.length == 0) {
        ticketTypeRows.push(<tr key="admin_tt0"><td colSpan={2}>n/a</td></tr>);
    }

    return (
        <Col className="admin-container" hidden={currentAdminSelection.selectedEvent == undefined}>
            <Row>
                <Col><h3>{pageHeader}</h3></Col>
            </Row>
            <Row className="form-group">
                <Col className="form-header">
                    <span className="title">Title:</span> {eventTitle}<br />
                    <span className="title">Date:</span> {eventDate}<br />
                    <span className="title">Venue:</span> {currentAdminSelection.selectedEvent?.venue?.name} <br />
                    <span className="title">Location:</span> {location}<br />
                    <span className="title">Status:</span> {getEventStatusText(currentAdminSelection.selectedEvent)}<br />
                </Col>
            </Row>
            <Row className="form-group">
                <Col>
                    Announce Date: <DatePicker id="announceDate" format="M/d/yyyy" onChange={onAnnounceDateChange} value={announceDate} oneTap cleanable onClean={onCleanAnnounceDate} disabled={announceDateDisabled} />
                </Col>
            </Row>
            <Row className="form-group">
                <Col>
                    <FormCheck
                        checked={isActive && !isDeleted}
                        disabled={isDeleted}
                        onChange={(e) => setIsActive(e.target.checked)}
                        label="Is Active?"                
                    />
                    <FormCheck
                        checked={isHidden}
                        disabled={isDeleted}
                        onChange={(e) => setIsHidden(e.target.checked)}
                        label="Is Hidden?"                
                    />
                    <FormCheck
                        checked={isDeleted}
                        onChange={(e) => setIsDeleted(e.target.checked)}
                        label="Is Deleted?"                
                    />
                    <FormCheck
                        checked={isAddedToBandsInTown}
                        disabled={isDeleted}
                        onChange={(e) => setIsAddedToBandsInTown(e.target.checked)}
                        label="Is Added to BandsInTown?"                
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <h5>Ticket Types</h5>
                </Col>
            </Row>
            <Row>
                <Col>
                    <table className="ticket-type-table">
                        <tbody>
                            {ticketTypeRows}
                        </tbody>
                    </table>
                </Col>
            </Row>
            <Row className="refund-section-header" hidden={refundsDisabled}>
                <Col>
                    <h5>Process Event Refunds</h5>
                </Col>
            </Row>
            <Row className="refund-section" hidden={refundsDisabled}>
                <Col>
                    <Button className="form-control-float" onClick={confirmDoRefund}>Refund All Tickets</Button>
                    <FormCheck
                        disabled={cancelDisabled}
                        title={cancelTitle}
                        className="form-control-float"
                        checked={markCancelled}
                        onChange={(e) => setMarkCancelled(e.target.checked)}
                        label="Mark as cancelled?"                
                    />
                    <FormCheck
                        className="form-control-float"
                        checked={refundServiceFees}
                        onChange={(e) => setRefundServiceFees(e.target.checked)}
                        label="Refund service fees?"                
                    />
                </Col>
            </Row>
            <Row className="refund-section">
                <Col>
                    <Button onClick={manageOrders}>Manage Orders</Button>
                </Col>
            </Row> 
            <Row>
                <Col>
                    <Button onClick={onSubmit}>Submit</Button> <Button onClick={confirmGoBack}>Back</Button>
                </Col>
            </Row> 
        </Col>
    );
}
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
import { setAdminEvent, setReloadEvents } from "@/lib/adminSelectionSlice";
import { useUpdateEvent } from "@/hooks/admin/useUpdateEvent";
import { useGetEventStatus } from "@/hooks/common/useGetEventStatus";

export default function AdminEventEdit() {
    const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
    const dispatch = useDispatch();
    const { getLocation } = useGetLocation();
    const { refundEvent } = useRefundEvent();
    const { updateEvent } = useUpdateEvent();
    const { getEventStatusText } = useGetEventStatus();
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isHidden, setIsHidden] = useState<boolean>(false);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const [markCancelled, setMarkCancelled] = useState<boolean>(true);
    const [refundServiceFees, setRefundServiceFees] = useState<boolean>(false);
    const [isAddedToBandsInTown, setIsAddedToBandsInTown] = useState<boolean>(false);

    useEffect(() => {
        if (currentAdminSelection.selectedEvent == undefined) {
            goBack();
        } else {
            setIsActive(currentAdminSelection.selectedEvent.isActive);
            setIsHidden(currentAdminSelection.selectedEvent.isHidden ?? false);
            setIsDeleted(currentAdminSelection.selectedEvent.isDeleted);
            setIsAddedToBandsInTown(currentAdminSelection.selectedEvent.isAddedToBandsInTown ?? false);
        }
    }, [currentAdminSelection, dispatch]);

    const goBack = () => {
        router.push('/admin/events/');
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
                    goBack();
                } else {
                    toast.error('Refund failed');
                }                
            });
    };

    const onSubmit = () => {
        if (!currentAdminSelection.selectedEvent) {
            return false;
        }
        dispatch(
            setIsLoading(true)
        );
        
        let eventToUpdate: VipEvent = {...currentAdminSelection.selectedEvent, isActive, isHidden, isDeleted, isAddedToBandsInTown};
        updateEvent(eventToUpdate).then((response: ModifyEventResponse) => {
            if (response.success) {
                dispatch(
                    setReloadEvents(true)
                );
                toast.success("Event updated successfully");
                router.push('/admin/events/');
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

    let ticketTypeRows: any[] = [];
    if (currentAdminSelection.selectedEvent && currentAdminSelection.selectedEvent.ticketTypes && currentAdminSelection.selectedEvent.ticketTypes.length > 0) {
        currentAdminSelection.selectedEvent.ticketTypes.forEach(ticketType => {
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

            ticketTypeRows.push(<tr><td>{ticketType.ticketTypeName}</td><td><FormCheck id={`ticketType_${ticketType.ticketTypeId}`} title={rowTitle} disabled={ticketTypeDisabled} checked={ticketType.isActive} onChange={(e) => setTicketTypeStatus(e)} label="Active" /></td></tr>);
        });
    }

    if (ticketTypeRows.length == 0) {
        ticketTypeRows.push(<tr><td colSpan={2}>n/a</td></tr>);
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
                    <span className="title">Location:</span> {location}<br />
                    <span className="title">Status:</span> {getEventStatusText(currentAdminSelection.selectedEvent)}<br />
                </Col>
            </Row>
            <Row className="form-group" hidden={refundsDisabled}>
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
            <Row>
                <Col>
                    <Button onClick={onSubmit}>Submit</Button> <Button onClick={goBack}>Back</Button>
                </Col>
            </Row> 
        </Col>
    );
}
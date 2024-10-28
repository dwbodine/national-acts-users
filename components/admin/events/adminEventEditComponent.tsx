import { RootState } from "@/lib/store";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import router from 'next/router';
import { Button, FormCheck } from "react-bootstrap";
import { toast } from 'react-toastify';
import { setIsLoading } from "@/lib/globalSelectionSlice";
import { useGetLocation } from "@/hooks/common/useGetLocation";
import moment from "moment";
import ConfirmationDialog from "../../common/confirmationDialogComponent";
import { useRefundEvent } from "@/hooks/admin/useRefundEvent";
import { ModifyEventResponse } from "@/types/event";
import { setAdminEvent } from "@/lib/adminSelectionSlice";

export default function AdminEventEdit() {
    const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
    const dispatch = useDispatch();
    const { getLocation } = useGetLocation();
    const { refundEvent } = useRefundEvent();
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isHidden, setIsHidden] = useState<boolean>(false);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const [markCancelled, setMarkCancelled] = useState<boolean>(false);
    const [refundServiceFees, setRefundServiceFees] = useState<boolean>(false);
    const [isAddedToBandsInTown, setIsAddedToBandsInTown] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (currentAdminSelection.selectedEvent == undefined) {
            goBack();
        } else {
            setIsActive(currentAdminSelection.selectedEvent.isActive);
        }
    }, [currentAdminSelection, dispatch]);

    const goBack = () => {
        router.push('/admin/events/');
    }

    const setTicketTypeStatus = (e: any) => {

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
        message += '.<br />Are you sure?';
        toast.info(
            <ConfirmationDialog
                Message={message}
                ConfirmText="Hell Yeah!" 
                CancelText="Oh Shit... No"
                OnConfirm={handleRefund}
                OnCancel={() => {}}
                />,
                {
                  autoClose: false,
                  closeOnClick: false,
                }
        );
    };

    const handleRefund = () => {
        if (!currentAdminSelection.selectedEvent) {
            return false;
        }
        dispatch (
            setIsLoading(true)
        );
        const eventId = currentAdminSelection.selectedEvent.ticketSocketEventId;
        refundEvent(eventId, markCancelled, refundServiceFees)
            .then((response: ModifyEventResponse) => {
                if (response.success && !response.eventError && currentAdminSelection.selectedEvent != undefined) {
                    let currentEvent = {...currentAdminSelection.selectedEvent};
                    currentEvent.isCancelled = true;
                    currentEvent.cancelledDate = moment().format('MM/DD/YYYY');
                    dispatch (
                        setAdminEvent(currentEvent)
                    );
                }
                dispatch (
                    setIsLoading(false)
                );
            });
    };

    const onSubmit = () => {
        setErrorMessage(undefined);
        if (!currentAdminSelection.selectedEvent) {
            return false;
        }
        dispatch(
            setIsLoading(true)
        );
        /*
        const newRoleName: string = (roleName ? roleName : '');
        let roleToUpdate: Role = {...currentAdminSelection.selectedRole, roleName: newRoleName};
        updateRole(roleToUpdate).then((response: UpdateRoleResponse) => {
            if (response.success) {
                dispatch(
                    setReloadRoles(true)
                )
                router.push('/admin/roles/');
            } else {
                setErrorMessage(response.roleError ?? "Error occurred while saving role");
            }
            dispatch(
                setIsLoading(false)
            );
        });*/
    }

    const pageHeader = "Edit event";

    const eventTitle = (currentAdminSelection.selectedEvent != undefined) ? currentAdminSelection.selectedEvent.title : '';
    const location = (currentAdminSelection.selectedEvent?.venue != undefined) ? getLocation(currentAdminSelection.selectedEvent.venue) : '';
    const eventDate = currentAdminSelection.selectedEvent?.eventDate != undefined ? moment(currentAdminSelection.selectedEvent.eventDate).format('MM/DD/YYYY') : '';

    let ticketTypeRows: any[] = [];
    if (currentAdminSelection.selectedEvent && currentAdminSelection.selectedEvent.ticketTypes && currentAdminSelection.selectedEvent.ticketTypes.length > 0) {
        currentAdminSelection.selectedEvent.ticketTypes.forEach(ticketType => {
            const ticketTypeId = ticketType.ticketTypeName;
            const ticketTypeDisabled = false;
            if (currentAdminSelection.selectedEvent && currentAdminSelection.selectedEvent.orders) {
                currentAdminSelection.selectedEvent.orders.forEach((order) => {
                    var ticketsWithType = order.tickets?.find(x => x.ticketType)
                });
            }

            ticketTypeRows.push(<div>{ticketType.ticketTypeName} <FormCheck disabled={ticketTypeDisabled} checked={ticketType.isActive} onChange={(e) => setTicketTypeStatus(e.target.checked)} label="Active" /></div>);
        });
    }

    return (
        <div className="admin-container" hidden={currentAdminSelection.selectedEvent == undefined}>
            <h3>{pageHeader}</h3>
            <div className="form-group">
                <div className="form-header">
                    <span className="title">Title:</span> {eventTitle}<br />
                    <span className="title">Date:</span> {eventDate}<br />
                    <span className="title">Location:</span> {location}<br />
                </div>
                <div>
                    <Button onClick={confirmDoRefund}>Refund Event</Button>
                    <FormCheck
                        checked={markCancelled}
                        onChange={(e) => setMarkCancelled(e.target.checked)}
                        label="Mark as cancelled?"                
                    />
                    <FormCheck
                        checked={refundServiceFees}
                        onChange={(e) => setRefundServiceFees(e.target.checked)}
                        label="Refund service fees?"                
                    />
                </div>
                <FormCheck
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    label="Is Active?"                
                />
                <FormCheck
                    checked={isHidden}
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
                    onChange={(e) => setIsAddedToBandsInTown(e.target.checked)}
                    label="Is Added to BandsInTown?"                
                />
                <h5>Ticket Types</h5>
                {ticketTypeRows}
                <Button onClick={onSubmit}>Submit</Button> <Button onClick={goBack}>Back</Button>
                { errorMessage ? 
                <div className="danger">{errorMessage}</div>
                : ''}
            </div> 
        </div>
    );
}
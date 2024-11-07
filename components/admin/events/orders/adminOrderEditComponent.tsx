import { RootState } from "@/lib/store";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import router from 'next/router';
import { GetPermissionsResponse, Permission, Role, UpdateRoleResponse } from "@/types/user";
import { Button, Col, FormCheck, Row } from "react-bootstrap";
import { useGetAllPermissions } from "@/hooks/user/useGetAllPermissions";
import { setAdminOrder, setReloadRoles, setSelectedRole } from "@/lib/adminSelectionSlice";
import { useUpdateRole } from "@/hooks/admin/useUpdateRole";
import { setIsLoading } from "@/lib/globalSelectionSlice";
import { useRefundOrder } from "@/hooks/admin/useRefundOrder";
import { useUpdateOrder } from "@/hooks/admin/useUpdateOrder";
import { useGetLocation } from "@/hooks/common/useGetLocation";
import { useGetOrderStatus } from "@/hooks/common/useGetOrderStatus";
import { toast } from "react-toastify";
import ConfirmationDialog from "../../../common/confirmationDialogComponent";
import { ModifyOrderResponse } from "@/types/event";
import moment from "moment";
import { useGetEventStatus } from "@/hooks/common/useGetEventStatus";

export default function AdminOrderEdit() {
    const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
    const dispatch = useDispatch();
    const { refundOrder } = useRefundOrder();
    const { updateOrder } = useUpdateOrder();
    const { getOrderStatusText } = useGetOrderStatus();
    const { getEventStatusText } = useGetEventStatus();
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isHidden, setIsHidden] = useState<boolean>(false);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const [markChargeback, setMarkChargeback] = useState<boolean>(false);
    const [refundServiceFees, setRefundServiceFees] = useState<boolean>(false);

    useEffect(() => {
        if (currentAdminSelection.selectedOrder == undefined) {
            goBack();
        } else {
            setIsActive(currentAdminSelection.selectedOrder.isActive);
            setIsHidden(currentAdminSelection.selectedOrder.isHidden ?? false);
            setIsDeleted(currentAdminSelection.selectedOrder.isDeleted);
        }
    }, [currentAdminSelection, dispatch]);

    const goBack = () => {
        router.push('/admin/events/orders/');
    }

    const setTicketCheckInStatus = () => {

    };
    
    const confirmDoRefund = () => {
        let message: string = 'By continuing, this order will be marked as refunded in full';
        if (refundServiceFees) {
            message += ', including all service fees';
        }
        const toastId = toast.warning(
            <ConfirmationDialog
                Message={message}
                ConfirmText="Yayuh!" 
                CancelText="Oh HAIL No"
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
        if (!currentAdminSelection.selectedOrder) {
            return false;
        }
        dispatch (
            setIsLoading(true)
        );
        const orderId = currentAdminSelection.selectedOrder.ticketSocketOrderId;
        refundOrder(orderId, refundServiceFees, markChargeback)
            .then((response: ModifyOrderResponse) => {
                const success = response.success;
                dispatch (
                    setIsLoading(false)
                );
                if (success) {
                    toast.success('Refund succeeded');
                    dispatch (
                        setAdminOrder(undefined)
                    );
                    goBack();
                } else {
                    toast.error('Refund failed');
                }
            });
    };


    const onSubmit = () => {
        if (!currentAdminSelection.selectedOrder) {
            return false;
        }
        dispatch(
            setIsLoading(true)
        );
        
    }    

    const pageHeader = "Edit Order";
    const currentOrder = currentAdminSelection.selectedOrder;
    const purchaseDate = currentOrder?.purchaseDate != undefined ? moment(currentOrder.purchaseDate).format('MM/DD/YYYY') : '';
    const purchaserName = `${currentOrder?.purchaserFirstName} ${currentOrder?.purchaserLastName}`;
    const eventDate = currentOrder?.eventDate ? moment(currentOrder.eventDate).format('MM/DD/YYYY') : '';
    const refundsDisabled = currentOrder?.numTickets == 0;
    const chargebackDisabled = (currentOrder?.hasChargebacks);
    const chargebackTitle = chargebackDisabled ? 'Order has already been charged back': '';

    let ticketRows: any[] = [];
    if (currentOrder && currentOrder.tickets && currentOrder.tickets.length > 0) {
        currentOrder.tickets.forEach(ticket => {
            const ticketId = ticket.ticketSocketOrderTicketId;
            const ticketRow = <tr>
                                <td>{ticket.ticketSocketOrderTicketId}</td>
                                <td>{ticket.attendeeFirstName}</td>
                                <td>{ticket.attendeeLastName}</td>
                                <td>{ticket.price?.toFixed(2)}</td>
                                <td>{ticket.serviceFee?.toFixed(2)}</td>
                                <td></td>
                                <td></td>
                              </tr>;
            ticketRows.push(ticketRow);
        });
    }

    if (ticketRows.length == 0) {
        ticketRows.push(<tr><td colSpan={2}>n/a</td></tr>);
    }

    return (
        <Col className="admin-container" hidden={currentAdminSelection.selectedOrder == undefined}>
            <Row>
                <Col><h3>{pageHeader}</h3></Col>
            </Row>
            <Row className="form-group">
                <Col className="form-header">
                    <span className="title">Event:</span> {currentOrder?.eventTitle}<br />
                    <span className="title">Event Date:</span> {eventDate}<br />
                    <span className="title">Status:</span> {getEventStatusText(currentAdminSelection.selectedEvent)}
                </Col>
            </Row>    
            <Row className="form-group">
                <Col className="form-header">
                    <span className="title">Purchase Date:</span> {purchaseDate}<br />                    
                    <span className="title">Purchaser Name:</span> {purchaserName}<br />
                    <span className="title">Number Tickets Sold:</span> {currentOrder?.numTickets}<br />
                    <div hidden={!currentOrder || currentOrder.currencyAbbrev == "USD"}>
                        <span className="title">Exchange Rate:</span> {currentOrder?.exchangeRate} <br />
                        <span className="title">Ticket Revenue:</span> {currentOrder?.revenue?.toFixed(2)} <br />
                        <span className="title">Service Fee Revenue:</span> {currentOrder?.serviceFees?.toFixed(2)} <br />
                    </div>
                    <span className="title">Ticket Revenue (USD):</span> {currentOrder?.revenueUsd?.toFixed(2)}<br />
                    <span className="title">Service Fee Revenue (USD):</span> {currentOrder?.serviceFeesUsd?.toFixed(2)}<br />
                </Col>
            </Row>
            <Row className="form-group" hidden={!currentOrder || !(currentOrder.hasRefunds || currentOrder.hasChargebacks)}>
                <Col className="form-header">
                    <span className="title">Number Tickets Refunded:</span> {currentOrder?.numTicketsRefunded}<br />
                    <div hidden={!currentOrder || currentOrder.currencyAbbrev == "USD"}>
                        <span className="title">Ticket Revenue Refunded:</span> {currentOrder?.revenueRefunded?.toFixed(2)} <br />
                        <span className="title">Service Fee Revenue Refunded:</span> {currentOrder?.serviceFeeRevenueRefunded?.toFixed(2)} <br />
                    </div>
                    <span className="title">Ticket Revenue Refunded (USD):</span> {currentOrder?.revenueRefundedUsd?.toFixed(2)}<br />
                    <span className="title">Service Fee Revenue Refunded (USD):</span> {currentOrder?.serviceFeeRevenueRefundedUsd?.toFixed(2)}<br />
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
                </Col>
            </Row>
            <Row>
                <Col>
                    <h5>Tickets</h5>
                </Col>
            </Row>
            <Row>
                <Col>
                    <table className="ticket-table">
                        <thead>
                            <tr>
                                <th>Ticket Id</th>
                                <th>Attendee First Name</th>
                                <th>Attendee Last Name</th>
                                <th>Price</th>
                                <th>Service Fees</th>
                                <th>Checked-in</th>
                                <th>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ticketRows}
                        </tbody>
                    </table>
                </Col>
            </Row>
            <Row className="refund-section-header">
                <Col>
                    <h5>Process Refunds</h5>
                </Col>
            </Row>
            <Row className="refund-section" hidden={refundsDisabled}>
                <Col>
                    <Button className="form-control-float" onClick={confirmDoRefund}>Refund All Tickets</Button>
                    <FormCheck
                        disabled={chargebackDisabled}
                        title={chargebackTitle}
                        className="form-control-float"
                        checked={markChargeback}
                        onChange={(e) => setMarkChargeback(e.target.checked)}
                        label="Mark as chargeback?"                
                    />
                    <FormCheck
                        className="form-control-float"
                        checked={refundServiceFees}
                        onChange={(e) => setRefundServiceFees(e.target.checked)}
                        label="Refund service fees?"                
                    />
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
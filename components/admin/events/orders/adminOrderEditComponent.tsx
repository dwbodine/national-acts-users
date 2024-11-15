import { RootState } from '@/lib/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import router from 'next/router';
import { Button, Col, FormCheck, Row } from 'react-bootstrap';
import {
  setAdminOrder,
  setMustSaveOrder,
  setReloadEvents,
} from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { useRefundOrder } from '@/hooks/admin/useRefundOrder';
import { useUpdateOrder } from '@/hooks/admin/useUpdateOrder';
import { useGetOrderStatus } from '@/hooks/common/useGetOrderStatus';
import { toast } from 'react-toastify';
import ConfirmationDialog from '../../../common/confirmationDialogComponent';
import { ModifyOrderResponse } from '@/types/event';
import moment from 'moment';
import { useRefundTicket } from '@/hooks/admin/useRefundTicket';

export default function AdminOrderEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { refundOrder } = useRefundOrder();
  const { refundTicket } = useRefundTicket();
  const { updateOrder } = useUpdateOrder();
  const { getOrderStatusText } = useGetOrderStatus();
  const [markChargeback, setMarkChargeback] = useState<boolean>(false);
  const [refundServiceFees, setRefundServiceFees] = useState<boolean>(false);

  useEffect(() => {}, [currentAdminSelection]);

  const setPrice = (e: any): any => {
    const newPrice = parseFloat(e.currentTarget?.value ?? 0);
    if (
      !currentAdminSelection.selectedOrder ||
      !e.currentTarget ||
      !e.currentTarget.id ||
      isNaN(newPrice)
    ) {
      return;
    }
    const ticketId = parseInt(e.currentTarget.id.replace('price_', ''));
    let currentOrder = { ...currentAdminSelection.selectedOrder };
    let orderRevenue = 0;
    if (!isNaN(ticketId) && currentOrder.tickets && !currentOrder.isComped) {
      currentOrder.tickets = currentOrder.tickets.map((t) => {
        let ticket = { ...t };
        if (ticket.ticketSocketOrderTicketId == ticketId) {
          ticket.price = newPrice;
          orderRevenue += newPrice;
        } else {
          orderRevenue += ticket.price ?? 0;
        }
        return ticket;
      });
    }

    if (currentOrder.revenue != orderRevenue) {
      currentOrder.revenue = orderRevenue;
      currentOrder.revenueUsd = orderRevenue * currentOrder.exchangeRate;

      dispatch(setAdminOrder(currentOrder));

      dispatch(setMustSaveOrder(true));
    }
  };

  const goBack = (dismissToast: boolean = true) => {
    if (dismissToast) {
      toast.dismiss();
    }
    dispatch(setMustSaveOrder(false));
    router.push('/admin/events/orders/');
  };

  const confirmGoBack = () => {
    if (!currentAdminSelection?.mustSaveOrder) {
      goBack();
      return;
    }

    let message: string =
      'You have made changes to this order, are you sure you want to discard them and leave?';
    const toastId = toast.warning(
      <ConfirmationDialog
        Message={message}
        ConfirmText="Yes"
        CancelText="No"
        OnConfirm={goBack}
        OnCancel={() => {
          toast.dismiss();
        }}
      />,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
      },
    );
  };

  const markDirty = () => {
    dispatch(setMustSaveOrder(true));
  };

  const setIsActive = (isActive: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedOrder) {
      return;
    }
    let currentOrder = { ...currentAdminSelection.selectedOrder };
    currentOrder.isActive = isActive;
    dispatch(setAdminOrder(currentOrder));
    markDirty();
  };

  const setIsDeleted = (isDeleted: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedOrder) {
      return;
    }
    let currentOrder = { ...currentAdminSelection.selectedOrder };
    currentOrder.isDeleted = isDeleted;
    dispatch(setAdminOrder(currentOrder));
    markDirty();
  };

  const setIsComped = (isComped: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedOrder) {
      return;
    }
    let currentOrder = { ...currentAdminSelection.selectedOrder };
    currentOrder.isComped = isComped;
    currentOrder.isDeleted = false;
    currentOrder.isActive = true;
    dispatch(setAdminOrder(currentOrder));
    markDirty();
  };

  const setServiceFee = (e: any) => {
    const newServiceFee = parseFloat(e?.currentTarget?.value ?? 0);
    if (
      !currentAdminSelection.selectedOrder ||
      !e.currentTarget ||
      !e.currentTarget.id ||
      isNaN(newServiceFee)
    ) {
      return;
    }
    const ticketId = parseInt(e.currentTarget.id.replace('serviceFee_', ''));
    let currentOrder = { ...currentAdminSelection.selectedOrder };
    let orderServiceFees = 0;
    if (!isNaN(ticketId) && currentOrder.tickets && !currentOrder.isComped) {
      currentOrder.tickets = currentOrder.tickets.map((t) => {
        let ticket = { ...t };
        if (ticket.ticketSocketOrderTicketId == ticketId) {
          ticket.serviceFee = newServiceFee;
          orderServiceFees += newServiceFee;
        } else {
          orderServiceFees += ticket.serviceFee ?? 0;
        }
        return ticket;
      });
    }

    if (currentOrder.serviceFees != orderServiceFees) {
      currentOrder.serviceFees = orderServiceFees;
      currentOrder.serviceFeesUsd = orderServiceFees * currentOrder.exchangeRate;

      dispatch(setAdminOrder(currentOrder));

      dispatch(setMustSaveOrder(true));
    }
  };

  const setTicketActive = (e: any) => {
    if (!currentAdminSelection.selectedOrder || !e.currentTarget || !e.currentTarget.id) {
      return;
    }
    const ticketId = parseInt(e.currentTarget.id.replace('serviceFee_', ''));
    let currentOrder = { ...currentAdminSelection.selectedOrder };
    if (!isNaN(ticketId) && currentOrder.tickets) {
      const isActive = e.currentTarget.checked;
      currentOrder.tickets = currentOrder.tickets.map((t) => {
        let ticket = { ...t };
        if (ticket.ticketSocketOrderTicketId == ticketId) {
          ticket.isActive = isActive;
        }
        return ticket;
      });

      dispatch(setAdminOrder(currentOrder));

      dispatch(setMustSaveOrder(true));
    }
  };

  const setTicketCheckInStatus = (e: any) => {
    if (!currentAdminSelection.selectedOrder || !e.currentTarget || !e.currentTarget.id) {
      return;
    }
    const ticketId = parseInt(e.currentTarget.id.replace('serviceFee_', ''));
    let currentOrder = { ...currentAdminSelection.selectedOrder };
    if (!isNaN(ticketId) && currentOrder.tickets) {
      const isCheckedIn = e.currentTarget.checked;
      currentOrder.tickets = currentOrder.tickets.map((t) => {
        let ticket = { ...t };
        if (ticket.ticketSocketOrderTicketId == ticketId) {
          ticket.isCheckedIn = isCheckedIn;
        }
        return ticket;
      });

      dispatch(setAdminOrder(currentOrder));

      dispatch(setMustSaveOrder(true));
    }
  };

  const confirmRefundTicket = (e: any) => {
    if (!currentAdminSelection.selectedOrder || !e.currentTarget || !e.currentTarget.id) {
      return;
    }
    const ticketId = parseInt(e.currentTarget.id.replace('refund_', ''));

    const ticket = currentAdminSelection.selectedOrder.tickets?.find(
      (x) => x.ticketSocketOrderTicketId == ticketId,
    );
    if (!ticket) {
      toast.warning('Ticket not found');
      return;
    }

    if (currentAdminSelection.mustSaveOrder) {
      toast.warning('Must save changes to order before proceeding');
      return;
    }

    if ((ticket.price ?? 0) == 0) {
      toast.warning('Ticket price must be set and saved before attempting refund');
      return;
    }

    let message: string = 'By continuing, this ticket will be marked as refunded in full';
    const toastId = toast.warning(
      <ConfirmationDialog
        Message={message}
        ConfirmText="Yes"
        CancelText="No"
        OnConfirm={() => doRefundTicket(ticketId, false)}
        OnCancel={cancelRefundTicket}
      />,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
      },
    );
  };

  const confirmRefundTicketWithServiceFees = (e: any) => {
    if (!currentAdminSelection.selectedOrder || !e.currentTarget || !e.currentTarget.id) {
      return;
    }
    const ticketId = parseInt(e.currentTarget.id.replace('refundSf_', ''));

    const ticket = currentAdminSelection.selectedOrder.tickets?.find(
      (x) => x.ticketSocketOrderTicketId == ticketId,
    );
    if (!ticket) {
      toast.warning('Ticket not found');
      return;
    }

    if (currentAdminSelection.mustSaveOrder) {
      toast.warning('Must save changes to order before proceeding');
      return;
    }

    if ((ticket.price ?? 0) == 0) {
      toast.warning('Ticket price must be set and saved before attempting refund');
      return;
    }

    let message: string =
      'By continuing, this ticket will be marked as refunded in full, including all service fees';
    const toastId = toast.warning(
      <ConfirmationDialog
        Message={message}
        ConfirmText="Yes"
        CancelText="No"
        OnConfirm={() => doRefundTicket(ticketId, true)}
        OnCancel={cancelRefundTicket}
      />,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
      },
    );
  };

  const cancelRefundTicket = () => {
    toast.dismiss();
  };

  const doRefundTicket = (refundTicketId: number, refundServiceFees: boolean) => {
    toast.dismiss();
    dispatch(setIsLoading(true));

    refundTicket(refundTicketId, refundServiceFees).then(
      (response: ModifyOrderResponse) => {
        const success = response.success;
        dispatch(setIsLoading(false));
        if (success) {
          toast.success('Refund succeeded');
          dispatch(setAdminOrder(undefined));
          dispatch(setReloadEvents(true));
          goBack(false);
        } else {
          toast.error('Refund failed');
        }
      },
    );
  };

  const confirmDoRefund = () => {
    if (!currentAdminSelection.selectedOrder) {
      return;
    }

    if (currentAdminSelection.mustSaveOrder) {
      toast.warning('Must save changes to order before proceeding');
      return;
    }

    const missingPriceTicket = currentAdminSelection.selectedOrder?.tickets?.find(
      (x) => (x.price ?? 0) == 0,
    );
    if (missingPriceTicket != undefined) {
      toast.warning(
        'One or more tickets have a zero price, please correct before attempting refund',
      );
      return;
    }

    let message: string = 'By continuing, this order will be marked as refunded in full';
    if (refundServiceFees) {
      message += ', including all service fees';
    }
    const toastId = toast.warning(
      <ConfirmationDialog
        Message={message}
        ConfirmText="Yes"
        CancelText="No"
        OnConfirm={handleRefund}
        OnCancel={() => {
          toast.dismiss();
        }}
      />,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
      },
    );
  };

  const handleRefund = () => {
    toast.dismiss();
    if (!currentAdminSelection.selectedOrder) {
      return false;
    }
    dispatch(setIsLoading(true));
    const orderId = currentAdminSelection.selectedOrder.ticketSocketOrderId;
    refundOrder(orderId, refundServiceFees, markChargeback).then(
      (response: ModifyOrderResponse) => {
        const success = response.success;
        dispatch(setIsLoading(false));
        if (success) {
          toast.success('Refund succeeded');
          dispatch(setAdminOrder(undefined));
          dispatch(setReloadEvents(true));
          goBack(false);
        } else {
          toast.error('Refund failed');
        }
      },
    );
  };

  const onSubmit = () => {
    if (!currentAdminSelection.selectedOrder) {
      return false;
    }
    dispatch(setIsLoading(true));
    const currentOrder = { ...currentAdminSelection.selectedOrder };
    updateOrder(currentOrder).then((results: ModifyOrderResponse) => {
      dispatch(setIsLoading(false));
      if (results.success && !results.orderError) {
        toast.success('Order updated successfully');
        dispatch(setAdminOrder(undefined));
        dispatch(setReloadEvents(true));
        setTimeout(() => {
          goBack(false);
        }, 500);
      } else {
        toast.error(results.orderError ?? 'Unknown error occurred while saving order');
      }
    });
  };

  const pageHeader = 'Edit Order';
  const currentOrder = currentAdminSelection.selectedOrder;
  const purchaseDate =
    currentOrder?.purchaseDate != undefined
      ? moment(currentOrder.purchaseDate).format('MM/DD/YYYY')
      : '';
  const purchaserName = `${currentOrder?.purchaserFirstName} ${currentOrder?.purchaserLastName}`;
  const eventDate = currentOrder?.eventDate
    ? moment(currentOrder.eventDate).format('MM/DD/YYYY')
    : '';
  const refundsDisabled =
    currentOrder?.numTickets == 0 ||
    (currentOrder?.hasRefunds &&
      currentOrder?.tickets?.find((x) => !x.isRefunded) == undefined);
  const chargebackDisabled =
    currentOrder?.numTickets == 0 ||
    (currentOrder?.hasChargebacks &&
      currentOrder?.tickets?.find((x) => !x.isChargedBack) == undefined);
  const chargebackTitle = chargebackDisabled ? 'Order has already been charged back' : '';
  const currencyAbbrev = currentOrder?.currencyAbbrev;
  const isActive = currentOrder?.isActive ?? false;
  const isDeleted = currentOrder?.isDeleted ?? false;
  const isComped = currentOrder?.isComped ?? false;

  let ticketRows: any[] = [];
  if (currentOrder && currentOrder.tickets && currentOrder.tickets.length > 0) {
    currentOrder.tickets.forEach((ticket) => {
      const ticketId = ticket.ticketSocketOrderTicketId;
      const ticketRow = (
        <tr key={`row_${ticketId}`}>
          <td>{ticket.ticketSocketOrderTicketId}</td>
          <td>{ticket.attendeeFirstName}</td>
          <td>{ticket.attendeeLastName}</td>
          <td>
            <input
              id={`price_${ticketId}`}
              disabled={ticket.isRefunded || ticket.isChargedBack}
              value={ticket.price?.toFixed(2)}
              type="number"
              step={0.25}
              onChange={setPrice}
            />
          </td>
          <td>
            <input
              id={`serviceFee_${ticketId}`}
              disabled={ticket.isRefunded || ticket.isChargedBack}
              value={ticket.serviceFee?.toFixed(2)}
              type="number"
              step={0.25}
              onChange={setServiceFee}
            />
          </td>
          <td style={{ textAlign: 'center' }}>
            <input
              id={`checkin__${ticketId}`}
              disabled={ticket.isRefunded || ticket.isChargedBack}
              type="checkbox"
              defaultChecked={ticket.isActive && ticket.isCheckedIn}
              onClick={setTicketCheckInStatus}
            />
          </td>
          <td style={{ textAlign: 'center' }}>
            <input
              id={`active__${ticketId}`}
              disabled={ticket.isRefunded || ticket.isChargedBack}
              type="checkbox"
              defaultChecked={ticket.isActive}
              onClick={setTicketActive}
            />
          </td>
          <td>
            <Button
              title={`Refund ticket # ${ticket.ticketSocketOrderTicketId}`}
              disabled={ticket.isRefunded || ticket.isChargedBack}
              id={`refund_${ticketId}`}
              onClick={confirmRefundTicket}
            >
              Refund Ticket
            </Button>
            <Button
              title={`Refund ticket # ${ticket.ticketSocketOrderTicketId} with service fees`}
              disabled={ticket.isRefunded || ticket.isChargedBack}
              id={`refundSf_${ticketId}`}
              onClick={confirmRefundTicketWithServiceFees}
            >
              Refund Ticket With Service Fees
            </Button>
          </td>
        </tr>
      );
      ticketRows.push(ticketRow);
    });
  }

  if (ticketRows.length == 0) {
    ticketRows.push(
      <tr>
        <td colSpan={2}>n/a</td>
      </tr>,
    );
  }

  return (
    <Col
      className="admin-container"
      hidden={currentAdminSelection.selectedOrder == undefined}
    >
      <Row>
        <Col>
          <h3>{pageHeader}</h3>
        </Col>
      </Row>
      <Row className="form-group">
        <Col className="form-header">
          <span className="title">Event:</span> {currentOrder?.eventTitle}
          <br />
          <span className="title">Event Date:</span> {eventDate}
          <br />
        </Col>
      </Row>
      <Row className="form-group">
        <Col className="form-header">
          <span className="title">Purchase Date:</span> {purchaseDate}
          <br />
          <span className="title">Order Status:</span>{' '}
          {getOrderStatusText(currentAdminSelection.selectedOrder)}
          <br />
          <span className="title">Purchaser Name:</span> {purchaserName}
          <br />
          <span className="title">Number Tickets Sold:</span> {currentOrder?.numTickets}
          <br />
          <div hidden={!currentOrder || currencyAbbrev == 'USD'}>
            <span className="title">Exchange Rate:</span> {currentOrder?.exchangeRate}{' '}
            <br />
            <span className="title">Ticket Revenue {currencyAbbrev}:</span>{' '}
            {(currentOrder?.revenue ?? 0).toFixed(2)} <br />
            <span className="title">Service Fee Revenue {currencyAbbrev}:</span>{' '}
            {(currentOrder?.serviceFees ?? 0).toFixed(2)} <br />
          </div>
          <span className="title">Ticket Revenue (USD):</span>{' '}
          {(currentOrder?.revenueUsd ?? 0).toFixed(2)}
          <br />
          <span className="title">Service Fee Revenue (USD):</span>{' '}
          {(currentOrder?.serviceFeesUsd ?? 0).toFixed(2)}
          <br />
        </Col>
      </Row>
      <Row
        className="form-group"
        hidden={
          !currentOrder || !(currentOrder.hasRefunds || currentOrder.hasChargebacks)
        }
      >
        <Col className="form-header">
          <span className="title">Number Tickets Refunded:</span>{' '}
          {currentOrder?.numTicketsRefunded}
          <br />
          <div hidden={!currentOrder || currentOrder.currencyAbbrev == 'USD'}>
            <span className="title">Ticket Revenue Refunded:</span>{' '}
            {(currentOrder?.revenueRefunded ?? 0).toFixed(2)} <br />
            <span className="title">Service Fee Revenue Refunded:</span>{' '}
            {(currentOrder?.serviceFeeRevenueRefunded ?? 0).toFixed(2)} <br />
          </div>
          <span className="title">Ticket Revenue Refunded (USD):</span>{' '}
          {(currentOrder?.revenueRefundedUsd ?? 0).toFixed(2)}
          <br />
          <span className="title">Service Fee Revenue Refunded (USD):</span>{' '}
          {(currentOrder?.serviceFeeRevenueRefundedUsd ?? 0).toFixed(2)}
          <br />
        </Col>
      </Row>

      <Row className="form-group">
        <Col>
          <FormCheck
            checked={isActive && !isDeleted}
            disabled={isDeleted || isComped}
            onChange={(e) => setIsActive(e.target.checked)}
            label="Is Active?"
          />
          <FormCheck
            checked={isDeleted}
            disabled={isComped}
            onChange={(e) => setIsDeleted(e.target.checked)}
            label="Is Deleted?"
          />
          <FormCheck
            checked={isComped}
            onChange={(e) => setIsComped(e.target.checked)}
            label="Is Comped?"
          />
        </Col>
      </Row>
      <Row hidden={isComped}>
        <Col>
          <h5>Tickets</h5>
        </Col>
      </Row>
      <Row hidden={isComped}>
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
                <th>Active</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>{ticketRows}</tbody>
          </table>
        </Col>
      </Row>
      <Row className="refund-section-header" hidden={refundsDisabled || isComped}>
        <Col>
          <h5>Process Refunds</h5>
        </Col>
      </Row>
      <Row className="refund-section" hidden={refundsDisabled || isComped}>
        <Col>
          <Button className="form-control-float" onClick={confirmDoRefund}>
            Refund All Tickets
          </Button>
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
          <Button onClick={onSubmit}>Submit</Button>{' '}
          <Button onClick={confirmGoBack}>Back</Button>
        </Col>
      </Row>
    </Col>
  );
}

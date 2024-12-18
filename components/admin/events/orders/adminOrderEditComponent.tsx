import { RootState } from '@/lib/store';
import { SyntheticEvent, useEffect, useState } from 'react';
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
import { DatePicker } from 'rsuite';
import { useGetOrderById } from '@/hooks/common/useGetOrderById';
import { useSetTicketsCheckedIn } from '@/hooks/order/useSetTicketsCheckedIn';
import { FaArrowTurnDown } from 'react-icons/fa6';

export default function AdminOrderEdit(props: any) {
  const id: number | undefined = props.Id as number;
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { refundOrder } = useRefundOrder();
  const { refundTicket } = useRefundTicket();
  const { updateOrder } = useUpdateOrder();
  const { getOrderById } = useGetOrderById();
  const { getOrderStatusText } = useGetOrderStatus();
  const [markChargeback, setMarkChargeback] = useState<boolean>(false);
  const [refundServiceFees, setRefundServiceFees] = useState<boolean>(false);
  const { setTicketsCheckedIn } = useSetTicketsCheckedIn();

  const [selectedAction, setSelectedAction] = useState('');
  const [ticketIdList, setTicketIdList] = useState<number[]>([]);
  const allTicketIds: number[] = currentAdminSelection.selectedOrder?.tickets?.map(t => { return t.ticketSocketOrderTicketId }) ?? [];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.selectedOrder == undefined && id != undefined) {
        getOrderById(id)
          .then((response) => {
            setTicketIdList([]);
            if (response.order && !response.orderError) {
               dispatch(
                  setAdminOrder(response.order)
               );
            }
          })
      }
    }, 300);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentAdminSelection, dispatch, getOrderById, id]);

  const setPrice = (ticketId: number, newPrice: number): any => {
    if (
      !currentAdminSelection.selectedOrder ||
      !ticketId ||
      isNaN(ticketId) ||
      isNaN(newPrice)
    ) {
      return;
    }
    let currentOrder = { ...currentAdminSelection.selectedOrder };
    let orderRevenue = 0;
    if (currentOrder.tickets && !currentOrder.isComped) {
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
    if (!id && dismissToast) {
      toast.dismiss();
    }
    dispatch(setMustSaveOrder(false));
    let path = '/admin/events/orders/';
    if (id && currentAdminSelection.selectedOrder) {
      path += `?id=${currentAdminSelection.selectedOrder.ticketSocketEventId}`;
    }
    router.push(path);
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

  const setServiceFee = (ticketId: number, newServiceFee: number) => {
    if (
      !currentAdminSelection.selectedOrder ||
      !ticketId ||
      isNaN(ticketId) ||
      isNaN(newServiceFee)
    ) {
      return;
    }
    let currentOrder = { ...currentAdminSelection.selectedOrder };
    let orderServiceFees = 0;
    if (currentOrder.tickets && !currentOrder.isComped) {
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

  const setTicketActive = (ticketId: number, isActive: boolean) => {
    if (!currentAdminSelection.selectedOrder || !ticketId || isNaN(ticketId)) {
      return;
    }
    let currentOrder = { ...currentAdminSelection.selectedOrder };
    if (currentOrder.tickets) {
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

  const setTicketCheckInStatus = (ticketId: number, isCheckedIn: boolean) => {
    if (!currentAdminSelection.selectedOrder || !ticketId || isNaN(ticketId)) {
      return;
    }
    let currentOrder = { ...currentAdminSelection.selectedOrder };
    if (currentOrder.tickets) {
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

  const setFirstName = (ticketId: number, firstName: string) => {
    if (!currentAdminSelection.selectedOrder || !ticketId || isNaN(ticketId)) {
      return;
    }
    let currentOrder = { ...currentAdminSelection.selectedOrder };
    if (currentOrder.tickets) {
      currentOrder.tickets = currentOrder.tickets.map((t) => {
        let ticket = { ...t };
        if (ticket.ticketSocketOrderTicketId == ticketId) {
          ticket.attendeeFirstName = firstName;
        }
        return ticket;
      });

      dispatch(setAdminOrder(currentOrder));

      dispatch(setMustSaveOrder(true));
    }
  };

  const setLastName = (ticketId: number, lastName: string) => {
    if (!currentAdminSelection.selectedOrder || !ticketId || isNaN(ticketId)) {
      return;
    }
    let currentOrder = { ...currentAdminSelection.selectedOrder };
    if (currentOrder.tickets) {
      currentOrder.tickets = currentOrder.tickets.map((t) => {
        let ticket = { ...t };
        if (ticket.ticketSocketOrderTicketId == ticketId) {
          ticket.attendeeLastName = lastName;
        }
        return ticket;
      });

      dispatch(setAdminOrder(currentOrder));

      dispatch(setMustSaveOrder(true));
    }
  };

  const setEmail = (ticketId: number, email: string) => {
    if (!currentAdminSelection.selectedOrder || !ticketId || isNaN(ticketId)) {
      return;
    }
    let currentOrder = { ...currentAdminSelection.selectedOrder };
    if (currentOrder.tickets) {
      currentOrder.tickets = currentOrder.tickets.map((t) => {
        let ticket = { ...t };
        if (ticket.ticketSocketOrderTicketId == ticketId) {
          ticket.attendeeEmail = email;
        }
        return ticket;
      });

      dispatch(setAdminOrder(currentOrder));

      dispatch(setMustSaveOrder(true));
    }
  };

  const setPhone = (ticketId: number, phone: string) => {
    if (!currentAdminSelection.selectedOrder || !ticketId || isNaN(ticketId)) {
      return;
    }
    let currentOrder = { ...currentAdminSelection.selectedOrder };
    if (currentOrder.tickets) {
      currentOrder.tickets = currentOrder.tickets.map((t) => {
        let ticket = { ...t };
        if (ticket.ticketSocketOrderTicketId == ticketId) {
          ticket.attendeePhone = phone;
        }
        return ticket;
      });

      dispatch(setAdminOrder(currentOrder));

      dispatch(setMustSaveOrder(true));
    }
  };

  const setShirtSize = (ticketId: number, shirtSize: string) => {
    if (!currentAdminSelection.selectedOrder || !ticketId || isNaN(ticketId)) {
      return;
    }
    let currentOrder = { ...currentAdminSelection.selectedOrder };
    if (currentOrder.tickets) {
      currentOrder.tickets = currentOrder.tickets.map((t) => {
        let ticket = { ...t };
        if (ticket.ticketSocketOrderTicketId == ticketId) {
          ticket.shirtSize = shirtSize;
        }
        return ticket;
      });

      dispatch(setAdminOrder(currentOrder));

      dispatch(setMustSaveOrder(true));
    }
  };

  const setRefundOrChargebackDate = (ticketId: number, newDate: Date | null) => {
    if (!currentAdminSelection.selectedOrder || !ticketId || isNaN(ticketId)) {
      return;
    }
    let currentOrder = { ...currentAdminSelection.selectedOrder };
    if (!isNaN(ticketId) && currentOrder.tickets) {
      const refundDate = moment(newDate).format('YYYY-MM-DD');
      currentOrder.tickets = currentOrder.tickets.map((t) => {
        let ticket = { ...t };
        if (ticket.ticketSocketOrderTicketId == ticketId) {
          if (ticket.isChargedBack) {
            ticket.chargebackDate = refundDate;
          } else if (ticket.isRefunded) {
            ticket.refundDate = refundDate;
          }
        }
        return ticket;
      });

      dispatch(setAdminOrder(currentOrder));

      dispatch(setMustSaveOrder(true));
    }
  };

  const confirmRefundTicket = (ticketId: number) => {
    if (!currentAdminSelection.selectedOrder || !ticketId || isNaN(ticketId)) {
      return;
    }

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

  const confirmRefundTicketWithServiceFees = (ticketId: number) => {
    if (!currentAdminSelection.selectedOrder || !ticketId || isNaN(ticketId)) {
      return;
    }

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

  const updateTicketIdList = (ticketId: number, addToList: boolean) => {
    let idList: number[] = ticketIdList ? [...ticketIdList] : [];
    if (!addToList && idList.includes(ticketId)) {
      idList = idList.filter(id => id != ticketId);
    } else if (addToList && !idList.includes(ticketId)) {
      idList.push(ticketId);
    }
    setTicketIdList(idList);
  };

  const selectAllTickets = (addToList: boolean) => {
    if (!allTicketIds) {
      return;
    }
    if (addToList) {
      setTicketIdList(allTicketIds);
    } else {
      setTicketIdList([]);
    }
  };

  const bulkEditConfirm = () => {
    if (ticketIdList.length == 0 || !selectedAction) {
      return;
    }

    let message = '';
    switch (selectedAction) {
      case "checkin":
        message = `You are about to check in ${ticketIdList.length} tickets`;
        break;
      case "checkout":
        message = `You are about to undo check-in for ${ticketIdList.length} tickets`;
        break;
    }

    if (!message) {
      return;
    }

    const toastId = toast.warning(
      <ConfirmationDialog
        Message={message}
        ConfirmText="Yes"
        CancelText="No"
        OnConfirm={handleBulkEdit}
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

  const handleBulkEdit = () => {
    toast.dismiss();
    if (ticketIdList.length == 0 || !selectedAction) {
      return;
    }

    switch (selectedAction) {
      case "checkin":
        checkInTickets(true);
        break;
      case "checkout":
        checkInTickets(false);
        break;
    }
  };

  const checkInTickets = (isCheckedIn: boolean) => {
    if (ticketIdList.length == 0) {
      return;
    }
    setTicketsCheckedIn(ticketIdList, isCheckedIn)
      .then((response) => {
        if (response.success && !response.ticketError) {
          const successMessage = isCheckedIn ? "Tickets checked in successfully" : "Tickets unchecked successfully";
          toast.success(successMessage);
          setTicketIdList([]);
          setSelectedAction('');
          dispatch(setAdminOrder(undefined));
          dispatch(setReloadEvents(true));
          setTimeout(() => {
            goBack(false);
          }, 500);
        } else {
          let errorMessage = response.ticketError;
          if (!errorMessage) {
            errorMessage = isCheckedIn ? 'Unexpected error occurred while checking in tickets' : 'Unexpected error occurred while unchecking tickets';
          }
          toast.error(errorMessage);
        }
      });
  };

  const pageHeader = 'Edit Order';
    const purchaseDate =
    currentAdminSelection.selectedOrder?.purchaseDate != undefined
      ? moment(currentAdminSelection.selectedOrder.purchaseDate).format('MM/DD/YYYY')
      : '';
  const purchaserName = `${currentAdminSelection.selectedOrder?.purchaserFirstName} ${currentAdminSelection.selectedOrder?.purchaserLastName}`;
  const eventDate = currentAdminSelection.selectedOrder?.eventDate
    ? moment(currentAdminSelection.selectedOrder.eventDate).format('MM/DD/YYYY')
    : '';
  const refundsDisabled =
  currentAdminSelection.selectedOrder?.numTickets == 0 ||
    (currentAdminSelection.selectedOrder?.hasRefunds &&
      currentAdminSelection.selectedOrder?.tickets?.find((x) => !x.isRefunded) == undefined);
  const chargebackDisabled =
  currentAdminSelection.selectedOrder?.numTickets == 0 ||
    (currentAdminSelection.selectedOrder?.hasChargebacks &&
      currentAdminSelection.selectedOrder?.tickets?.find((x) => !x.isChargedBack) == undefined);
  const chargebackTitle = chargebackDisabled ? 'Order has already been charged back' : '';
  const currencyAbbrev = currentAdminSelection.selectedOrder?.currencyAbbrev;
  const isActive = currentAdminSelection.selectedOrder?.isActive ?? false;
  const isDeleted = currentAdminSelection.selectedOrder?.isDeleted ?? false;
  const isComped = currentAdminSelection.selectedOrder?.isComped ?? false;

  let ticketRows: any[] = [];
  let hasRefunds = false;
  let hasChargebacks = false;
  if (currentAdminSelection.selectedOrder && currentAdminSelection.selectedOrder.tickets && currentAdminSelection.selectedOrder.tickets.length > 0) {
    currentAdminSelection.selectedOrder.tickets.forEach((ticket) => {
      const ticketId = ticket.ticketSocketOrderTicketId;
      let refundDate = undefined;
      if (ticket.isChargedBack) {
        hasChargebacks = true;
        refundDate = moment(ticket.chargebackDate).toDate();
      } else if (ticket.isRefunded) {
        hasRefunds = true;
        refundDate = moment(ticket.refundDate).toDate();
      }
      const ticketRow = (
        <tr key={`row_${ticketId}`}>
          <td>
            <FormCheck
              id={`tId_${ticketId}`}
              key={`tId_${ticketId}`}
              checked={ticketIdList.includes(ticketId)}
              onChange={(e) => updateTicketIdList(ticketId, e.currentTarget.checked)}
            />
          </td>
          <td>{ticket.ticketSocketOrderTicketId}</td>
          <td>
            {isComped ?
              <input
                id={`fName_${ticketId}`}
                key={`fName_${ticketId}`}
                value={ticket.attendeeFirstName ?? ''}
                type="text"
                onChange={(e) => setFirstName(parseInt(`${ticketId}`), e.currentTarget.value)}
              />
              : ticket.attendeeFirstName
            }
          </td>
          <td>
            {isComped ?
              <input
                id={`lName_${ticketId}`}
                key={`lName_${ticketId}`}
                value={ticket.attendeeLastName ?? ''}
                type="text"
                onChange={(e) => setLastName(parseInt(`${ticketId}`), e.currentTarget.value)}
              />
              : ticket.attendeeLastName
            }
          </td>
          <td hidden={!isComped}>
            <input
              id={`phone_${ticketId}`}
              key={`phone_${ticketId}`}
              value={ticket.attendeePhone ?? ''}
              type="text"
              onChange={(e) => setPhone(parseInt(`${ticketId}`), e.currentTarget.value)}
            />
          </td>
          <td hidden={!isComped}>
            <input
              id={`email_${ticketId}`}
              key={`email_${ticketId}`}
              value={ticket.attendeeEmail ?? ''}
              type="text"
              onChange={(e) => setEmail(parseInt(`${ticketId}`), e.currentTarget.value)}
            />
          </td>
          <td>
            {isComped ?
              <select
                id={`shirt_${ticketId}`}
                key={`shirt_${ticketId}`}
                defaultValue={ticket.shirtSize}
                onChange={(e) => setShirtSize(parseInt(`${ticketId}`), e.currentTarget.value)}>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="XXXL">XXXL</option>
              </select>
              : (ticket.shirtSize ? ticket.shirtSize : 'n/a')
            }
          </td>
          <td hidden={isComped}>
            <input
              id={`price_${ticketId}`}
              key={`price_${ticketId}`}
              disabled={ticket.isRefunded || ticket.isChargedBack}
              value={ticket.price?.toFixed(2)}
              type="number"
              step={0.25}
              onChange={(e) => setPrice(parseInt(`${ticketId}`), parseFloat(e.currentTarget.value))}
            />
          </td>
          <td hidden={isComped}>
            <input
              id={`serviceFee_${ticketId}`}
              key={`serviceFee_${ticketId}`}
              disabled={ticket.isRefunded || ticket.isChargedBack}
              value={ticket.serviceFee?.toFixed(2)}
              type="number"
              step={0.25}
              onChange={(e) => setServiceFee(parseInt(`${ticketId}`), parseFloat(e.currentTarget.value))}
            />
          </td>
          <td hidden={isComped || (!hasChargebacks && !hasRefunds)}>
            <DatePicker
              id={`rcDate_${ticketId}`}
              key={`rcDate_${ticketId}`}
              format="M/d/yyyy"
              onSelect={(newDate: Date | null) => setRefundOrChargebackDate(parseInt(`${ticketId}`), newDate)}
              value={refundDate}
              oneTap
              cleanable={false}
            />
          </td>
          <td style={{ textAlign: 'center' }} hidden={isComped}>
            <input
              id={`checkin_${ticketId}`}
              key={`checkin_${ticketId}`}
              disabled={ticket.isRefunded || ticket.isChargedBack}
              type="checkbox"
              defaultChecked={ticket.isActive && ticket.isCheckedIn}
              onClick={(e) => setTicketCheckInStatus(parseInt(`${ticketId}`), e.currentTarget.checked)}
            />
          </td>
          <td style={{ textAlign: 'center' }} hidden={isComped}>
            <input
              id={`active_${ticketId}`}
              key={`active_${ticketId}`}
              disabled={ticket.isRefunded || ticket.isChargedBack}
              type="checkbox"
              defaultChecked={ticket.isActive}
              onClick={(e) => setTicketActive(parseInt(`${ticketId}`), e.currentTarget.checked)}
            />
          </td>
          <td hidden={isComped}>
            <Button
              title={`Refund ticket # ${ticket.ticketSocketOrderTicketId}`}
              disabled={ticket.isRefunded || ticket.isChargedBack}
              id={`refund_${ticketId}`}
              key={`refund_${ticketId}`}
              onClick={(e) => confirmRefundTicket(parseInt(`${ticketId}`))}
            >
              Refund Ticket
            </Button>
            <Button
              title={`Refund ticket # ${ticket.ticketSocketOrderTicketId} with service fees`}
              disabled={ticket.isRefunded || ticket.isChargedBack}
              id={`refundSf_${ticketId}`}
              key={`refundSf_${ticketId}`}
              onClick={(e) => confirmRefundTicketWithServiceFees(parseInt(`${ticketId}`))}
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
      <tr key="tr-empty">
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
          <span className="title">Event:</span> {currentAdminSelection.selectedOrder?.eventTitle}
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
          <span className="title">Number Tickets Sold:</span> {currentAdminSelection.selectedOrder?.numTickets}
          <br />
          <div hidden={!currentAdminSelection.selectedOrder || currencyAbbrev == 'USD'}>
            <span className="title">Exchange Rate:</span> {currentAdminSelection.selectedOrder?.exchangeRate}{' '}
            <br />
            <span className="title">Ticket Revenue {currencyAbbrev}:</span>{' '}
            {(currentAdminSelection.selectedOrder?.revenue ?? 0).toFixed(2)} <br />
            <span className="title">Service Fee Revenue {currencyAbbrev}:</span>{' '}
            {(currentAdminSelection.selectedOrder?.serviceFees ?? 0).toFixed(2)} <br />
          </div>
          <span className="title">Ticket Revenue (USD):</span>{' '}
          {(currentAdminSelection.selectedOrder?.revenueUsd ?? 0).toFixed(2)}
          <br />
          <span className="title">Service Fee Revenue (USD):</span>{' '}
          {(currentAdminSelection.selectedOrder?.serviceFeesUsd ?? 0).toFixed(2)}
          <br />
        </Col>
      </Row>
      <Row
        className="form-group"
        hidden={
          !currentAdminSelection.selectedOrder || !(currentAdminSelection.selectedOrder.hasRefunds || currentAdminSelection.selectedOrder.hasChargebacks)
        }
      >
        <Col className="form-header">
          <span className="title">Number Tickets Refunded:</span>{' '}
          {currentAdminSelection.selectedOrder?.numTicketsRefunded}
          <br />
          <div hidden={!currentAdminSelection.selectedOrder || currentAdminSelection.selectedOrder.currencyAbbrev == 'USD'}>
            <span className="title">Ticket Revenue Refunded:</span>{' '}
            {(currentAdminSelection.selectedOrder?.revenueRefunded ?? 0).toFixed(2)} <br />
            <span className="title">Service Fee Revenue Refunded:</span>{' '}
            {(currentAdminSelection.selectedOrder?.serviceFeeRevenueRefunded ?? 0).toFixed(2)} <br />
          </div>
          <span className="title">Ticket Revenue Refunded (USD):</span>{' '}
          {(currentAdminSelection.selectedOrder?.revenueRefundedUsd ?? 0).toFixed(2)}
          <br />
          <span className="title">Service Fee Revenue Refunded (USD):</span>{' '}
          {(currentAdminSelection.selectedOrder?.serviceFeeRevenueRefundedUsd ?? 0).toFixed(2)}
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
      <Row>
        <Col>
          <h5>Tickets</h5>
        </Col>
      </Row>
      <Row hidden={allTicketIds.length == 0}>
        <Col className="bulk-arrow-row">
          <div><FaArrowTurnDown className="bulk-arrow" /></div>
          <div>With selected:</div>
          <div>
            <select onChange={(e) => setSelectedAction(e.currentTarget.value)} className="bulk-select" defaultValue={selectedAction}>
              <option value="">-- Select One --</option>
              <option value="checkin">Check In</option>
              <option value="checkout">Undo Check-in</option>
            </select>
          </div>
          <div>
            <Button onClick={bulkEditConfirm}>Update</Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <table className="ticket-table">
            <thead>
              <tr>
                <th>
                  <FormCheck
                    id={`tId_selectAll`}
                    checked={allTicketIds.length > 0 && (ticketIdList.length == allTicketIds.length)}
                    onChange={(e) => selectAllTickets(e.currentTarget.checked)}
                  />
                </th>
                <th>Ticket Id</th>
                <th>Attendee First Name</th>
                <th>Attendee Last Name</th>
                <th hidden={!isComped}>Attendee Phone</th>
                <th hidden={!isComped}>Attendee Email</th>
                <th>Shirt Size</th>
                <th hidden={isComped}>Price</th>
                <th hidden={isComped}>Service Fees</th>
                <th hidden={isComped || (!hasChargebacks && !hasRefunds)}>{hasChargebacks ? "Chargeback Date" : "Refund Date"}</th>
                <th hidden={isComped}>Checked-in</th>
                <th hidden={isComped}>Active</th>
                <th hidden={isComped}>&nbsp;</th>
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

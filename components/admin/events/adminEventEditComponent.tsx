import { RootState } from '@/lib/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import router from 'next/router';
import { Button, Col, Form, FormCheck, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { useGetLocation } from '@/hooks/common/useGetLocation';
import moment from 'moment';
import ConfirmationDialog from '../../common/confirmationDialogComponent';
import { useRefundEvent } from '@/hooks/admin/useRefundEvent';
import { ModifyEventResponse, ModifyOrderResponse, Note, VipEvent } from '@/types/event';
import {
  setAdminEvent,
  setReloadEvents,
  setMustSaveEvent,
} from '@/lib/adminSelectionSlice';
import { useUpdateEvent } from '@/hooks/admin/useUpdateEvent';
import { useGetEventStatus } from '@/hooks/common/useGetEventStatus';
import { DatePicker, Modal, TimePicker } from 'rsuite';
import { useAddCompedOrder } from '@/hooks/admin/useAddCompOrder';
import { useGetEventById } from '@/hooks/common/useGetEventById';
import { useSendListToBand } from '@/hooks/admin/useSendListToBand';
import { useAddNote } from '@/hooks/admin/useAddNote';

export default function AdminEventEdit(props: any) {
  const id: number | undefined = props.Id as number;
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const dispatch = useDispatch();
  const { getLocation } = useGetLocation();
  const { refundEvent } = useRefundEvent();
  const { updateEvent } = useUpdateEvent();
  const { getEventStatusText } = useGetEventStatus();
  const [markCancelled, setMarkCancelled] = useState<boolean>(true);
  const [numCompedTickets, setNumCompedTickets] = useState<number>(0);
  const [refundServiceFees, setRefundServiceFees] = useState<boolean>(false);
  const { addCompedOrder } = useAddCompedOrder();
  const { getEventById } = useGetEventById();
  const { sendListToBand } = useSendListToBand();
  const [notesOpen, setNotesOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const { addNote } = useAddNote();

  const beforeOnUnload = (ev: BeforeUnloadEvent) => {
    ev.preventDefault();
    return ev;
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.selectedEvent == undefined && id != undefined) {
        dispatch(setIsLoading(true));
        getEventById(id)
          .then((response) => {
            if (response.event && !response.eventError) {
              dispatch(
                setAdminEvent(response.event)
              );
            }
            dispatch(setIsLoading(false));
          })
      } else if (globalSelection.isLoading) {
        dispatch(setIsLoading(false));
      }
    }, 300);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentAdminSelection, dispatch, id, getEventById, globalSelection]);

  const handleNotesOpen = () => setNotesOpen(true);
  const handleNotesClose = () => setNotesOpen(false);

  const addNewNote = () => {
    if (!noteText || !currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    addNote(noteText, currentAdminSelection.selectedEvent.ticketSocketEventId)
      .then((response) => {
        if (response.success && !response.noteError) {
          toast.success("Note added successfully");
          setNoteText('');
          dispatch(setReloadEvents(true));
          dispatch(setAdminEvent(undefined));
          goBack(false);
        } else {
          toast.error(response.noteError ?? "Unexpected error occurred while adding note");
        }
        setNotesOpen(false);
      });

  };

  const setIsActive = (isActive: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.isActive = isActive;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setIsHidden = (isHidden: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.isHidden = isHidden;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setIsDeleted = (isDeleted: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.isDeleted = isDeleted;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setIsAddedToBandsInTown = (isAddedToBandsInTown: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.isAddedToBandsInTown = isAddedToBandsInTown;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setEmailSentToVips = (isSent: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.emailSentToVips = isSent;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setTextSentToVips = (isSent: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.textSentToVips = isSent;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setListSentToBand = (isSent: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    sendListToBand(currentAdminSelection.selectedEvent.ticketSocketEventId, isSent)
      .then((response) => {
        if (response.success && !response.eventError) {
          toast.success("VIP list marked as sent to band");
          dispatch(setReloadEvents(true));
          dispatch(setAdminEvent(undefined));
          goBack(false);
        } else {
          const errMsg = response.eventError ?? "unknown error";
          toast.error(`Send list failed - ${errMsg}`);
        }
      });

  };

  const setCompTicketTypeName = (ticketTypeName: string) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent = { ...currentAdminSelection.selectedEvent };
    if (currentEvent.ticketTypes) {
      currentEvent.ticketTypes = currentEvent.ticketTypes.map((ticketType) => {
        let newTicketType = { ...ticketType };
        if (newTicketType.ticketTypeId == 0) {
          newTicketType.ticketTypeName = ticketTypeName;
        }
        return newTicketType;
      });
    }
    dispatch(setAdminEvent(currentEvent));
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
    let currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.announceDate = announceDate.format('YYYY-MM-DD HH:mm:ss');
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const onAnnounceTimeChange = (date: Date | null) => {
    if (!date || !currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }

    if (date <= new Date()) {
      onCleanAnnounceTime();
      return;
    }

    const eventDate = moment(currentAdminSelection.selectedEvent.eventDate).toDate();
    if (date >= eventDate) {
      onCleanAnnounceTime();
      return;
    }

    const announceTime = moment(date);
    let currentEvent = { ...currentAdminSelection.selectedEvent };
    let announceDate = moment(currentEvent.announceDate);
    announceDate = announceDate.hours(announceTime.hours());
    announceDate = announceDate.minutes(announceTime.minutes());
    announceDate = announceDate.seconds(0);
    currentEvent.announceDate = announceDate.format('YYYY-MM-DD HH:mm:ss');
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const onCleanAnnounceDate = () => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.announceDate = undefined;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const onCleanAnnounceTime = () => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent = { ...currentAdminSelection.selectedEvent };
    if (currentEvent.announceDate) {
      let announceDate = moment(currentEvent.announceDate);
      announceDate = announceDate.hours(0);
      announceDate = announceDate.minutes(0);
      announceDate = announceDate.seconds(0);
      currentEvent.announceDate = announceDate.format('YYYY-MM-DD HH:mm:ss');;
    }    
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const onCheckInLocationChange = (location: string | undefined) => {
    if (!location || !currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.checkInLocation = location;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const onCheckInNotesChange = (notes: string | undefined) => {
    if (!notes || !currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.checkInNotes = notes;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const goBack = (dismissToast: boolean = true) => {
    if (!id && dismissToast) {
      toast.dismiss();
    }
    dispatch(setMustSaveEvent(false));
    if (!id) {
      router.push('/admin/events/');
    }
  };

  const confirmGoBack = () => {
    if (!currentAdminSelection?.mustSaveEvent) {
      goBack();
      return;
    }

    let message: string =
      'You have made changes to this event, are you sure you want to discard them and leave?';
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

  const manageOrders = () => {
    if (!currentAdminSelection.selectedEvent) {
      return;
    }
    let path = '/admin/events/orders/';
    if (id) {
      path += `?id=${id}`;
    }
    router.push(path);
  };

  const setTicketTypeStatus = (ticketTypeId: number, isActive: boolean) => {
    if (
      currentAdminSelection.selectedEvent == undefined ||
      currentAdminSelection.selectedEvent.ticketTypes == undefined ||
      !ticketTypeId ||
      isNaN(ticketTypeId)
    ) {
      return;
    }

    if (ticketTypeId > 0) {
      let currentEvent = { ...currentAdminSelection.selectedEvent };
      currentEvent.ticketTypes = currentEvent.ticketTypes?.map((ticketType) => {
        if (ticketType.ticketTypeId == ticketTypeId) {
          ticketType = { ...ticketType, isActive: isActive };
        }
        return ticketType;
      });
      dispatch(setAdminEvent(currentEvent));
      markDirty();
    }
  };

  const confirmDoRefund = () => {
    if (
      !currentAdminSelection.selectedEvent ||
      !currentAdminSelection.selectedEvent.orders ||
      currentAdminSelection.selectedEvent.orders.length == 0
    ) {
      return;
    }

    let hasMissingPrices = false;
    for (const order of currentAdminSelection.selectedEvent.orders) {
      if (order.tickets && order.tickets.length > 0) {
        const missingOrderTicket = order.tickets.find((x) => (x.price ?? 0) == 0);
        if (missingOrderTicket != undefined) {
          hasMissingPrices = true;
          break;
        }
      }
    }

    if (hasMissingPrices) {
      toast.error(
        'Cannot refund entire event - one or more orders has tickets with missing prices, please correct before continuing',
      );
      return;
    }

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
    if (!currentAdminSelection.selectedEvent) {
      return false;
    }
    dispatch(setIsLoading(true));
    const eventId = currentAdminSelection.selectedEvent.ticketSocketEventId;
    refundEvent(eventId, markCancelled, refundServiceFees).then(
      (response: ModifyEventResponse) => {
        const success = response.success;
        dispatch(setIsLoading(false));
        if (success) {
          toast.success('Refund succeeded');
          dispatch(setReloadEvents(true));
          dispatch(setAdminEvent(undefined));
          goBack(false);
        } else {
          toast.error('Refund failed');
        }
      },
    );
  };

  const compOrder = () => {
    if (!currentAdminSelection.selectedEvent || numCompedTickets == 0) {
      return false;
    }
    dispatch(setIsLoading(true));
    const eventId = currentAdminSelection.selectedEvent.ticketSocketEventId;
    addCompedOrder(eventId, numCompedTickets).then(
      (response: ModifyOrderResponse) => {
        const success = response.success;
        dispatch(setIsLoading(false));
        if (success) {
          toast.success('Comp order created');
          dispatch(setReloadEvents(true));
          dispatch(setAdminEvent(undefined));
          goBack(false);
        } else {
          toast.error('Comp order creation failed');
        }
      },
    );
  };

  const cancelEvent = () => {
    if (!currentAdminSelection.selectedEvent) {
      return false;
    }
    dispatch(setIsLoading(true));
    const eventId = currentAdminSelection.selectedEvent.ticketSocketEventId;
    refundEvent(eventId, true, false).then((response: ModifyEventResponse) => {
      const success = response.success;
      dispatch(setIsLoading(false));
      if (success) {
        toast.success('Refund succeeded');
        dispatch(setReloadEvents(true));
        dispatch(setAdminEvent(undefined));
        goBack(false);
      } else {
        toast.error('Cancellation failed');
      }
    });
  };



  const markDirty = () => {
    dispatch(setMustSaveEvent(true));
    if (id) {
      window.addEventListener("beforeunload", beforeOnUnload);
    }
  };

  const onSubmit = () => {
    if (!currentAdminSelection.selectedEvent) {
      return false;
    }
    dispatch(setIsLoading(true));

    let eventToUpdate: VipEvent = { ...currentAdminSelection.selectedEvent };
    updateEvent(eventToUpdate).then((response: ModifyEventResponse) => {
      if (response.success) {
        toast.success('Event updated successfully');
        dispatch(setReloadEvents(true));
        dispatch(setAdminEvent(undefined));
        goBack(false);
        if (id) {
          window.removeEventListener("beforeunload", beforeOnUnload);
          if (window.opener) {
            window.opener.location.reload(false);
          }
        }
      } else {
        toast.error(response.eventError ?? 'Error occurred while updating event');
      }
      dispatch(setIsLoading(false));
    });
  };

  const pageHeader = 'Edit event';

  const eventTitle =
    currentAdminSelection.selectedEvent != undefined
      ? currentAdminSelection.selectedEvent.title
      : '';
  const location =
    currentAdminSelection.selectedEvent?.venue != undefined
      ? getLocation(currentAdminSelection.selectedEvent.venue)
      : '';
  const eventDate =
    currentAdminSelection.selectedEvent?.eventDate != undefined
      ? moment(currentAdminSelection.selectedEvent.eventDate).format('MM/DD/YYYY')
      : '';
  const refundsDisabled =
    currentAdminSelection.selectedEvent == undefined ||
    currentAdminSelection.selectedEvent.totalTickets == 0;
  const cancelDisabled = (currentAdminSelection.selectedEvent?.isCancelled);
  const cancelTitle = cancelDisabled ? 'Event has already been cancelled' : '';
  const announceDate =
    currentAdminSelection.selectedEvent != undefined &&
      currentAdminSelection.selectedEvent.announceDate != null
      ? moment(currentAdminSelection.selectedEvent.announceDate).toDate()
      : null;
  const announceDateDisabled =
    currentAdminSelection.selectedEvent != undefined && eventDate != undefined
      ? moment(eventDate).toDate() < new Date()
      : false;

  const announceTimeDisabled = !announceDateDisabled && !announceDate;

  
  const isActive = currentAdminSelection?.selectedEvent?.isActive ?? false;
  const isDeleted = currentAdminSelection?.selectedEvent?.isDeleted ?? false;
  const isHidden = currentAdminSelection?.selectedEvent?.isHidden ?? false;
  const isAddedToBandsInTown =
    currentAdminSelection?.selectedEvent?.isAddedToBandsInTown ?? false;

  const emailSentToVips = currentAdminSelection?.selectedEvent?.emailSentToVips ?? false;
  const textSentToVips = currentAdminSelection?.selectedEvent?.textSentToVips ?? false;
  const listSentToBand = currentAdminSelection?.selectedEvent?.listSentToBand ?? false;
  const listSentTime = currentAdminSelection?.selectedEvent?.listSentTime ? moment.utc(currentAdminSelection.selectedEvent.listSentTime).format('MM/DD/YYYY h:mm A') : 'n/a';
  const numVips = (currentAdminSelection?.selectedEvent?.listSentToBand ?? false) ? (currentAdminSelection?.selectedEvent?.listSentNumVips ?? 0).toString() : 'n/a';

  const checkInLocation = currentAdminSelection?.selectedEvent?.checkInLocation;
  const checkInNotes = currentAdminSelection?.selectedEvent?.checkInNotes;

  let ticketTypeRows: any[] = [];
  if (
    currentAdminSelection.selectedEvent &&
    currentAdminSelection.selectedEvent.ticketTypes &&
    currentAdminSelection.selectedEvent.ticketTypes.length > 0
  ) {
    currentAdminSelection.selectedEvent.ticketTypes.forEach((ticketType, i) => {
      const ticketTypeId = ticketType.ticketTypeId;
      let ticketTypeDisabled = false;
      if (
        currentAdminSelection.selectedEvent &&
        currentAdminSelection.selectedEvent.orders
      ) {
        for (let i = 0; i < currentAdminSelection.selectedEvent.orders.length; i++) {
          const order = currentAdminSelection.selectedEvent.orders[i];
          if (order.isComped) {
            ticketTypeDisabled = true;
          } else {
            var ticketsWithType = order.tickets?.find(
              (x) => x.ticketTypeId == ticketTypeId,
            );
            if (ticketsWithType != undefined) {
              ticketTypeDisabled = true;
              break;
            }
          }
        }
      }

      const rowTitle = ticketTypeDisabled
        ? 'Cannot change the status of a ticket type with tickets sold'
        : '';
      const key = `admin_tt${i}`;

      ticketTypeRows.push(
        <tr key={key}>
          <td>{ticketType.ticketTypeId == 0 ?
            <input
              type="text"
              value={ticketType.ticketTypeName}
              onChange={(e) => setCompTicketTypeName(e.target.value)}
            /> :
            ticketType.ticketTypeName
          }
          </td>
          <td>
            {ticketType.ticketTypeId != 0 ?
              <FormCheck
                id={`ticketType_${ticketType.ticketTypeId}`}
                title={rowTitle}
                disabled={ticketTypeDisabled}
                checked={ticketType.isActive}
                onChange={(e) => setTicketTypeStatus(parseInt(`${ticketType.ticketTypeId}`), e.currentTarget.checked)}
                label="Active"
              /> : ''}
          </td>
        </tr>,
      );
    });
  }

  if (ticketTypeRows.length == 0) {
    ticketTypeRows.push(
      <tr key="admin_tt0">
        <td colSpan={2}>n/a</td>
      </tr>,
    );
  }

  let notes: any[] = [];
  if (currentAdminSelection.selectedEvent?.notes) {
    currentAdminSelection.selectedEvent.notes.forEach((note: Note) => {
      notes.push(<div key={`note_${note.noteId}`}>{note.note}&nbsp;<span className="note-created">Date: {moment(note.noteTimestamp).format('MM/DD/YYYY h:mm A')}</span></div>)
    });
  }

  if (notes.length == 0) {
    notes.push(<div>n/a</div>)
  }

  return (
    <Col
      className="admin-container"
      hidden={currentAdminSelection.selectedEvent == undefined}
    >
      <Row>
        <Col>
          <h3>{pageHeader}</h3>
        </Col>
      </Row>
      <Row className="form-group">
        <Col className="form-header">
          <span className="title">Title:</span> {eventTitle}
          <br />
          <span className="title">Date:</span> {eventDate}
          <br />
          <span className="title">Venue:</span>{' '}
          {currentAdminSelection.selectedEvent?.venue?.name} <br />
          <span className="title">Location:</span> {location}
          <br />
          <span className="title">Status:</span>{' '}
          {getEventStatusText(currentAdminSelection.selectedEvent)}
          <br />
        </Col>
      </Row>
      <Row className="form-group">
        <Col xs={1}>
          Announce Date:
        </Col>
        <Col>
          <DatePicker
            id="announceDate"
            format="M/d/yyyy"
            onSelect={onAnnounceDateChange}
            value={announceDate}
            oneTap
            cleanable
            showMeridiem
            onClean={onCleanAnnounceDate}
            disabled={announceDateDisabled}
          />
          <TimePicker
            id="announceTime"
            format="hh:mm aa"
            onSelect={onAnnounceTimeChange}
            value={announceDate}
            cleanable
            showMeridiem
            onClean={onCleanAnnounceTime}
            disabled={announceTimeDisabled}
          />
        </Col>
      </Row>
      
      <Row className="form-group">
        <Col xs={1}>
          Check-in location:
        </Col>
        <Col xs={5}>
          <Form.Control as="textarea"
            rows={3}
            id="checkInLocation"
            onChange={(e) => onCheckInLocationChange(e.currentTarget.value)}
            value={checkInLocation}
          />
        </Col>
      </Row>
      <Row className="form-group">
        <Col xs={1}>
          Check-in notes:
        </Col>
        <Col xs={5}>
          <Form.Control as="textarea"
            id="checkInNotes"
            rows={5}
            onChange={(e) => onCheckInNotesChange(e.currentTarget.value)}
            value={checkInNotes}
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
          <FormCheck
            checked={emailSentToVips}
            disabled={isDeleted}
            onChange={(e) => setEmailSentToVips(e.target.checked)}
            label="Email Sent To VIPs?"
          />
          <FormCheck
            checked={textSentToVips}
            disabled={isDeleted}
            onChange={(e) => setTextSentToVips(e.target.checked)}
            label="Text Sent To VIPs?"
          />
          <FormCheck
            checked={listSentToBand}
            disabled={isDeleted}
            onChange={(e) => setListSentToBand(e.target.checked)}
            label="List Sent To Band?"
          />
          <div>
            Date/Time List sent to band: {listSentTime}
          </div>
          <div>
            # of VIPs at time email was sent: {numVips}
          </div>
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
            <tbody>{ticketTypeRows}</tbody>
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
          <Button className="form-control-float" onClick={confirmDoRefund}>
            Refund All Tickets
          </Button>
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
      <Row>
        <Col>
          Add comp order with
          <input
            value={numCompedTickets}
            onChange={(e) => setNumCompedTickets(parseInt(e.target.value))}
            type="number"
            className="comped-tickets"
          />
          tickets
          <Button className="comp-button" onClick={compOrder}>Comp</Button>
        </Col>
      </Row>
      <Row
        className="refund-section"
        hidden={(currentAdminSelection?.selectedEvent?.orders?.length ?? 0) > 0}
      >
        <Col>
          <Button onClick={cancelEvent}>Mark Cancelled</Button><Button onClick={handleNotesOpen}>Add Note</Button>
          <Modal open={notesOpen} onClose={handleNotesClose}>
            <Modal.Header>
              <Modal.Title>Add New Note:</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Control as="textarea"
                id="addNote"
                rows={5}
                onChange={(e) => setNoteText(e.currentTarget.value)}
                value={noteText}
                placeholder="Note text"
              />
            </Modal.Body>
            <Modal.Footer className="modal-notes-footer">
              <Button onClick={addNewNote}>
                Ok
              </Button>
              <Button onClick={handleNotesClose}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
      <Row>
          <Col>
            <div>NOTES:</div>
            {notes}
          </Col>
      </Row>
      <Row className="refund-section">
        <Col>
          <Button onClick={manageOrders}>Manage Orders</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={onSubmit}>Submit</Button>{' '}
          <Button hidden={id != undefined} onClick={confirmGoBack}>Back</Button>
        </Col>
      </Row>
    </Col>
  );
}

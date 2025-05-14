import { RootState } from '@/lib/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ItemDataType } from 'rsuite/esm/internals/types';
import router from 'next/router';
import { Button, Col, Form, FormCheck, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { useGetLocation } from '@/hooks/common/useGetLocation';
import moment from 'moment';
import ConfirmationDialog from '../../common/confirmationDialogComponent';
import { useRefundEvent } from '@/hooks/admin/useRefundEvent';
import { GetSellersResponse, GetToursResponse, ModifyEventResponse, ModifyOrderResponse, Note, Seller, VipEvent } from '@/types/event';
import {
  setAdminEvent,
  setReloadEvents,
  setMustSaveEvent,
  setReloadVenues,
  setVenues,
  setAdminVenue,
  setAdminDates,
  setReloadSellers,
  setAllSellers,
  setTicketSocketEventsOnly,
  setAdminSellerId,
} from '@/lib/adminSelectionSlice';
import { useUpdateEvent } from '@/hooks/admin/useUpdateEvent';
import { DatePicker, Modal, SelectPicker, TimePicker } from 'rsuite';
import { useAddCompedOrder } from '@/hooks/admin/useAddCompOrder';
import { useGetEventById } from '@/hooks/common/useGetEventById';
import { useAddNote } from '@/hooks/admin/useAddNote';
import { useUpdateVenue } from '@/hooks/admin/useUpdateVenue';
import { useGetAllVenues } from '@/hooks/admin/useGetAllVenues';
import { ExternalVenue, ModifyExternalVenueResponse } from '@/types/admin';
import AdminFileUpload from '../common/adminFileUploadComponent';
import { useCancelEvent } from '@/hooks/admin/useCancelEvent';
import { useGetSellers } from '@/hooks/common/useGetSellers';
import { useGetTicketSocketEventsOnly } from '@/hooks/admin/useGetTicketSocketEventsOnly';

export default function AdminEventEdit(props: any) {
  const id: number | undefined = props.Id as number;
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const dispatch = useDispatch();
  const { updateVenue } = useUpdateVenue();
  const { getExternalVenueLocation } = useGetLocation();
  const { getAllVenues } = useGetAllVenues();
  
  const { refundEvent } = useRefundEvent();
  const { cancelEvent } = useCancelEvent();
  const { updateEvent } = useUpdateEvent();
  const [markCancelled, setMarkCancelled] = useState<boolean>(true);
  const [numCompedTickets, setNumCompedTickets] = useState<number>(0);
  const [refundServiceFees, setRefundServiceFees] = useState<boolean>(false);
  const { addCompedOrder } = useAddCompedOrder();
  const { getEventById } = useGetEventById();
  const { getSellers } = useGetSellers();
  const { getTicketSocketEventsOnly } = useGetTicketSocketEventsOnly();
  const [notesOpen, setNotesOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const { addNote } = useAddNote();
  const [isUploading, setIsUploading] = useState(false);
  const [isThumbnailDirty, setIsThumbnailDirty] = useState(false);
  const thumbNailBaseUrl = `${process.env.NEXT_PUBLIC_WWW_URL}/common/thumbnails`;
  const [venueOpen, setVenueOpen] = useState(false);
  const [venueName, setVenueName] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string | undefined>(undefined);
  const [zipCode, setZipCode] = useState<string | undefined>(undefined);
  const [country, setCountry] = useState<string | undefined>(undefined);
  
  const currentSeller: Seller | undefined = currentAdminSelection.allSellers?.find(x => x.sellerId == currentAdminSelection.sellerId);

  const beforeOnUnload = (ev: BeforeUnloadEvent) => {
    ev.preventDefault();
    return ev;
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.reloadSellers) {
          dispatch(setReloadSellers(false));
          dispatch(setIsLoading(true));
          getSellers().then((response: GetSellersResponse) => {
            dispatch(setAllSellers(response.sellers));
            dispatch(setIsLoading(false));
          });
      } else if (currentAdminSelection.reloadVenues) {
        dispatch(setIsLoading(true));
        dispatch(setReloadVenues(false));
        getAllVenues()
          .then((response) => {
            if (response.venues && !response.venueError) {
              dispatch(
                setVenues(response.venues)
              );
            }
            dispatch(setIsLoading(false));
          })
      } else if (currentAdminSelection.selectedEvent == undefined && id != undefined) {
        dispatch(setIsLoading(true));
        getEventById(id)
          .then((response) => {
            if (response.event && !response.eventError) {
              dispatch(
                setAdminEvent(response.event)
              );
              dispatch(
                setAdminSellerId(response.event.sellerId)
              );
              getTicketSocketEventsOnly(response.event.sellerId).then((response) => {
                if (response.events && !response.eventError) {
                  dispatch(setTicketSocketEventsOnly(response.events));
                }
                dispatch(setIsLoading(false));
              });
            } else {
              dispatch(setIsLoading(false));
            }            
          })
      }
    }, 300);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentAdminSelection, dispatch, id, getEventById, globalSelection, getAllVenues, currentSeller, getSellers, getTicketSocketEventsOnly]);

  const onEventVenueChange = (value: number | null, event: React.SyntheticEvent) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.externalEventVenueId = value ?? undefined;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const onEventChange = (value: number | null, event: React.SyntheticEvent) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.ticketSocketEventId = value ?? undefined;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setEventTitle = (title: string) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.title = title;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const handleNotesOpen = () => setNotesOpen(true);
  const handleNotesClose = () => setNotesOpen(false);

  const addNewNote = () => {
    if (!noteText || !currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    addNote(noteText, currentAdminSelection.selectedEvent.externalEventId)
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

  const setDisableLinkButton = (isDisabled: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.disableLinkButton = isDisabled;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setDisableLinkReason = (reason: string) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.disableLinkReason = reason.trim().length > 0 ? reason : undefined;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setDisableVipLinkButton = (isDisabled: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.disableVipLinkButton = isDisabled;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setDisableVipLinkReason = (reason: string) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.disableVipLinkReason = reason.trim().length > 0 ? reason : undefined;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setExternalVipLink = (url: string) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.externalVipLink = url.trim().length > 0 ? url : undefined;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setExternalUrl = (url: string) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.externalUrl = url.trim().length > 0 ? url : undefined;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const onEventDateChange = (date: Date | null) => {
    if (!date || !currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }

    const eventDate = moment(date).startOf('day');
    let currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.eventDate = eventDate.format('YYYY-MM-DD HH:mm:ss');
    dispatch(setAdminEvent(currentEvent));
    markDirty();
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

    const eventDate = moment(currentAdminSelection.selectedEvent.eventDate).toDate();
    if (date >= eventDate) {
      toast.warn("Announce date must be before event date");
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

  const onEventTimeChange = (date: Date | null) => {
      if (!date || !currentAdminSelection || !currentAdminSelection.selectedEvent) {
        return;
      }
  
      const eventTime = moment(date);
      let currentEvent = { ...currentAdminSelection.selectedEvent };
      let eventDate = moment(currentEvent.eventDate);
      eventDate = eventDate.hours(eventTime.hours());
      eventDate = eventDate.minutes(eventTime.minutes());
      eventDate = eventDate.seconds(0);
      currentEvent.eventTime = eventDate.format('YYYY-MM-DD HH:mm:ss');
      dispatch(setAdminEvent(currentEvent));
      markDirty();
  };

  const onCleanEventTime = () => {
      if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
        return;
      }
      let currentEvent = { ...currentAdminSelection.selectedEvent };
      currentEvent.eventTime = undefined;    
      dispatch(setAdminEvent(currentEvent));
      markDirty();
  };

  const onCheckInLocationChange = (location: string | undefined) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.checkInLocation = location;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const onCheckInNotesChange = (notes: string | undefined) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
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
    dispatch(setAdminEvent(undefined));
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
      if (!order.isComped && order.tickets && order.tickets.length > 0) {
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
    const eventId = currentAdminSelection.selectedEvent.externalEventId;
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
    if (!currentAdminSelection.selectedEvent) {
      return false;
    }
    if (!currentAdminSelection.selectedEvent.ticketSocketEventId) {
      toast.warn("Cannot currently comp orders for an event without tickets on sale");
      return false;
    }
    if (numCompedTickets == 0) {
      toast.warn("Must enter a number for comped tickets for the order");
      return false;
    }
    dispatch(setIsLoading(true));
    const eventId = currentAdminSelection.selectedEvent.externalEventId;
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

  const cancelTicketSocketEvent = () => {
    if (!currentAdminSelection.selectedEvent) {
      return false;
    }

    const eventId = currentAdminSelection.selectedEvent.externalEventId;
    const isCancelled = !currentAdminSelection.selectedEvent.isCancelled;

    dispatch(setIsLoading(true));
    
    cancelEvent(eventId, isCancelled).then((response: ModifyEventResponse) => {
      const success = response.success;
      dispatch(setIsLoading(false));
      if (success) {
        const message = isCancelled ? 'Cancellation succeeded' : 'Uncancellation succeeded';
        toast.success(message);
        dispatch(setReloadEvents(true));
        dispatch(setAdminEvent(undefined));
        goBack(false);
      } else {
        const message = isCancelled ? 'Cancellation failed' : 'Uncancellation failed';
        toast.error(message);
      }
    });
  };

  const markDirty = () => {
    dispatch(setMustSaveEvent(true));
    if (id) {
      window.addEventListener("beforeunload", beforeOnUnload);
    }
  };

  const onFileUpload = (fileUploadName: string, filename: string) => {
    if (!currentAdminSelection.selectedEvent || !fileUploadName || !filename) {
      return;
    }
    let currentEvent = { ...currentAdminSelection.selectedEvent };
    switch (fileUploadName) {
      case 'Thumbnail':
        currentEvent.thumbnail = filename;
        dispatch(setAdminEvent(currentEvent));
        setIsThumbnailDirty(true);
        markDirty();
        break;
      default:
        break;
    }
  };

  const onUploadStart = () => {
    setIsUploading(true);
  };

  const onUploadComplete = (filename: string | undefined) => {
    setIsUploading(false);
    if (filename) {
      toast.success('File uploaded successfully - click submit to save');
    } else {
      toast.error('File upload failed!');
    }
  };

  const handleVenueOpen = () => {
    let venue: ExternalVenue = {
      venueId: 0,
      venue: '',
      address: '',
      city: '',
    };

    dispatch(setAdminVenue(venue));
    setVenueOpen(true);
  };

  const addVenue = () => {
    if (!currentAdminSelection.selectedVenue) {
      return false;
    }

    if (!venueName) {
      toast.error("Venue name is required");
      return;
    }

    if (!address) {
      toast.error("Address is required");
      return;
    }

    if (!city) {
      toast.error("City is required");
      return;
    }

    if (!state && !zipCode && !country) {
      toast.error("Must provide at least one of state, zip or country");
      return;
    }

    handleVenueClose();

    let venueToUpdate: ExternalVenue = {
      ...currentAdminSelection.selectedVenue,
      venue: venueName,
      address: address,
      city: city,
      state: state,
      zipCode: zipCode,
      country: country,
    };

    updateVenue(venueToUpdate).then((response: ModifyExternalVenueResponse) => {
      if (response.success) {
        const newVenue = response.updatedVenue;
        let adminSelection = { ...currentAdminSelection };
        if (newVenue != undefined && 
            adminSelection.venues != undefined && 
            adminSelection.selectedEvent != undefined && 
            !adminSelection.venues.find(x => x.venueId == newVenue.venueId)) {
          dispatch(setAdminVenue(undefined));
          let venueList = [ ...adminSelection.venues ];
          venueList.push(newVenue);
          venueList.sort((a, b) =>
            a.venue < b.venue ? -1 : a.venue > b.venue ? 1 : 0,
          );
          dispatch(
            setVenues(venueList)
          );
          let currentEvent = { ...adminSelection.selectedEvent };
          currentEvent.externalEventVenueId = newVenue.venueId;
          dispatch(
            setAdminEvent(currentEvent)
          );
          toast.success('Venue added successfully');
        } else {
          toast.error('Error occurred while saving venue');
        }
      } else {
        toast.error(response.venueError ?? 'Error occurred while saving venue');
      }
    });
  };

  const handleVenueClose = () => setVenueOpen(false);
  

  const onSubmit = () => {
    if (!currentAdminSelection.selectedEvent || !currentAdminSelection.sellerId) {
      return false;
    }    

    let eventToUpdate: VipEvent = { ...currentAdminSelection.selectedEvent };

    if (!eventToUpdate.title) {
      toast.warning("Title must be set");
      return;
    }

    if (!eventToUpdate.eventDate) {
      toast.warning("Event date must be set");
      return;
    }

    if (!eventToUpdate.externalEventVenueId) {
      toast.warning("Event venue must be set");
      return;
    }

    if (!eventToUpdate.externalUrl && !eventToUpdate.externalVipLink) {
      toast.warning("Either vip or ticket link must be set");
      return;
    }

    if (!eventToUpdate.announceDate) {
      eventToUpdate.announceDate = undefined;
    }

    if (!eventToUpdate.disableLinkReason) {
      eventToUpdate.disableLinkReason = undefined;
    }

    if (!eventToUpdate.disableVipLinkReason) {
      eventToUpdate.disableVipLinkReason = undefined;
    }

    if (!eventToUpdate.externalUrl) {
      eventToUpdate.externalUrl = undefined;
    }

    if (!eventToUpdate.externalVipLink) {
      eventToUpdate.externalVipLink = undefined;
    }

    dispatch(setIsLoading(true));

    updateEvent(eventToUpdate).then((response: ModifyEventResponse) => {
      if (response.success) {
        let adminSelection = { ...currentAdminSelection };
        adminSelection.start = undefined;
        adminSelection.end = undefined;
        toast.success('Event updated successfully');
        dispatch(setReloadEvents(true));
        dispatch(setAdminDates(adminSelection));
        dispatch(setAdminEvent(undefined));
        dispatch(setAdminVenue(undefined));
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

  const selectedEvent = currentAdminSelection.selectedEvent;

  const eventId =
    selectedEvent?.externalEventId != undefined
      ? selectedEvent.externalEventId
      : 0;

  const ticketSocketEventId = selectedEvent?.ticketSocketEventId ?? 0;

  const pageHeader = (eventId > 0) ? `Edit event for ${currentSeller?.name}` : `Add event for ${currentSeller?.name}`;

  const eventTitle =
      selectedEvent != undefined
        ? selectedEvent.title
        : '';
  
  const eventDate =
    selectedEvent?.eventDate != undefined
      ? moment(selectedEvent.eventDate).toDate()
      : null;

  const eventTime =
      selectedEvent != undefined &&
      selectedEvent.eventTime != null
            ? moment(selectedEvent.eventTime).toDate()
            : null; 
  
  const announceDate =
    selectedEvent != undefined &&
      selectedEvent.announceDate != null
      ? moment(selectedEvent.announceDate).toDate()
      : null;
  
  const refundsDisabled =
    selectedEvent == undefined ||
    selectedEvent.totalTickets == 0 ||
    ticketSocketEventId == 0;

  const isCancelled = (selectedEvent?.isCancelled ?? false)
  const cancelButtonText = isCancelled ? 'Uncancel Event' : 'Mark Cancelled';
  const refundCancelDisabled = isCancelled;
  const refundCancelTitle = refundCancelDisabled ? 'Event has already been cancelled' : '';
  
  const isActive = selectedEvent?.isActive ?? false;
  const isDeleted = selectedEvent?.isDeleted ?? false;
  const isHidden = selectedEvent?.isHidden ?? false;
  const isAddedToBandsInTown =
    selectedEvent?.isAddedToBandsInTown ?? false;

  const thumbnail = selectedEvent?.thumbnail ?? undefined;
  const externalEventVenueId = selectedEvent?.externalEventVenueId ?? 0;  

  const externalUrl = selectedEvent?.externalUrl ?? undefined;
  const externalVipLink = selectedEvent?.externalVipLink ?? undefined;

  const disableLinkButton = selectedEvent?.disableLinkButton ?? false;
  const disableLinkReason = selectedEvent?.disableLinkReason ?? undefined;

  const disableVipLinkButton = selectedEvent?.disableVipLinkButton ?? false;
  const disableVipLinkReason = selectedEvent?.disableVipLinkReason ?? undefined;

  const emailSentToVips = selectedEvent?.emailSentToVips ? "true" : "false";
  const textSentToVips = selectedEvent?.textSentToVips  ? "true" : "false";
  const listSentToBand = selectedEvent?.listSentToBand   ? "true" : "false";
  const listSentTime = selectedEvent?.listSentTime ? moment.utc(selectedEvent.listSentTime).format('MM/DD/YYYY h:mm A') : 'n/a';
  const numVips = (selectedEvent?.listSentToBand ?? false) ? (selectedEvent?.listSentNumVips ?? 0).toString() : 'n/a';

  const checkInLocation = selectedEvent?.checkInLocation;
  const checkInNotes = selectedEvent?.checkInNotes;

  let ticketTypeRows: any[] = [];
  if (
    selectedEvent &&
    selectedEvent.ticketTypes &&
    selectedEvent.ticketTypes.length > 0
  ) {
    selectedEvent.ticketTypes.forEach((ticketType, i) => {
      const ticketTypeId = ticketType.ticketTypeId;
      let ticketTypeDisabled = false;
      if (
        selectedEvent && selectedEvent.orders
      ) {
        for (let i = 0; i < selectedEvent.orders.length; i++) {
          const order = selectedEvent.orders[i];
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
  if (selectedEvent?.notes) {
    selectedEvent.notes.forEach((note: Note) => {
      notes.push(<div key={`note_${note.noteId}`}>{note.note}&nbsp;<span className="note-created">Date: {moment(note.noteTimestamp).format('MM/DD/YYYY h:mm A')}</span></div>)
    });
  }

  if (notes.length == 0) {
    notes.push(<div>n/a</div>)
  }

  const venueList: ItemDataType<number>[] = currentAdminSelection?.venues ?
    currentAdminSelection?.venues?.map((venue) => {
      return {
        label: `${venue.venue} ${getExternalVenueLocation(venue)}`,
        value: venue.venueId
      }
    }) : [];

  const eventList: ItemDataType<number>[] = currentAdminSelection?.ticketSocketEvents ?
    currentAdminSelection?.ticketSocketEvents?.map((evt) => {
      return {
        label: `${moment(evt.eventDate).format('MM/DD/YYYY')} - ${evt.title}`,
        value: evt.ticketSocketEventId
      }
    }) : [];

  const isExternalEvent = (selectedEvent?.isExternal ?? false) && (ticketSocketEventId == 0);

  return (
    <Col
      className="admin-container"
      hidden={selectedEvent == undefined}
    >
      <Row>
        <Col>
          <h3>{pageHeader}</h3>
        </Col>
      </Row>
      <Row>
        <Col className="form-group">
          <label className="mt-4">Event title</label>
          <input
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="form-control"
            placeholder="event title"
            type="text"
          />
        </Col>
      </Row>
      <Row>
        <Col className="form-group">
          <label className="mt-4">Event date</label>
          <DatePicker
            id="eventDate"
            format="M/d/yyyy"
            onSelect={onEventDateChange}
            value={eventDate}
            oneTap
            showMeridiem
          />
        </Col>
      </Row>
      <Row hidden={isExternalEvent}>
        <Col className="form-group">
          <label className="mt-4">Associated Ticket Socket Event</label>
          <SelectPicker
            value={ticketSocketEventId}
            data={eventList}
            size="lg"
            block
            onChange={onEventChange}
          />      
        </Col>
      </Row>
      <Row>
        <Col className="form-group">
          <label className="mt-4">Event venue</label>
          <SelectPicker
            value={externalEventVenueId}
            data={venueList}
            size="lg"
            block
            onChange={onEventVenueChange}
          />
          <Button disabled={externalEventVenueId > 0} onClick={handleVenueOpen}>Add New Venue</Button>
          <Modal open={venueOpen} onClose={handleVenueClose}>
            <Modal.Header>
              <Modal.Title>Add New Venue:</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-group">
                <label className="mt-4">Venue name</label>
                <input
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="form-control"
                  placeholder="venue name"
                  type="text"
                />
              </div>
              <div className="form-group">
                <label className="mt-4">Address</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-control"
                  placeholder="address"
                  type="text"
                />
              </div>
              <div className="form-group">
                <label className="mt-4">City</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-control"
                  placeholder="city"
                  type="text"
                />
              </div>
              <div className="form-group">
                <label className="mt-4">State</label>
                <input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="form-control"
                  placeholder="state"
                  type="text"
                />
              </div>
              <div className="form-group">
                <label className="mt-4">Postal Code</label>
                <input
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="form-control"
                  placeholder="postal code"
                  type="text"
                />
              </div>
              <div className="form-group">
                <label className="mt-4">Country</label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="form-control"
                  placeholder="country"
                  type="text"
                />
              </div>
            </Modal.Body>
            <Modal.Footer className="modal-notes-footer">
              <Button onClick={addVenue}>
                Ok
              </Button>
              <Button onClick={handleVenueClose}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
      <Row>
        <Col className="form-group">
          <AdminFileUpload
            Title="Thumbnail (square, no wider than 100px x 100px)"
            FileUploadName="Thumbnail"
            OnUpLoad={onFileUpload}
            CurrentFileName={thumbnail}
            IsDirty={isThumbnailDirty}
            CurrentFileTitle={"View Current Thumbnail"}
            BaseUrl={thumbNailBaseUrl}
            OnUploadStart={onUploadStart}
            OnUploadComplete={onUploadComplete}
          />
        </Col>
      </Row>
      <Row className="form-group">
        <Col>
          <label className="mt-4">Event time (local)</label>

          <TimePicker
            id="eventTime"
            format="hh:mm aa"
            onSelect={onEventTimeChange}
            value={eventTime}
            cleanable
            showMeridiem
            onClean={onCleanEventTime}
          />

          <label className="mt-4">Announce Date</label>
          
          <DatePicker
            id="announceDate"
            format="M/d/yyyy"
            onSelect={onAnnounceDateChange}
            value={announceDate}
            oneTap
            cleanable
            showMeridiem
            onClean={onCleanAnnounceDate}
          />
          <TimePicker
            id="announceTime"
            format="hh:mm aa"
            onSelect={onAnnounceTimeChange}
            value={announceDate}
            cleanable
            showMeridiem
            onClean={onCleanAnnounceTime}
          />
        </Col>
      </Row>
      <Row>
        <Col className="form-group">
          <label className="mt-4">VIP Link</label>
          <Form.Control as="textarea"
            rows={3}
            id="externalVipLink"
            onChange={(e) => setExternalVipLink(e.currentTarget.value)}
            value={externalVipLink}
            placeholder='VIP/Website Link (VIP tickets)'
          />
        </Col>
      </Row>
      <Row>
        <Col className="form-group">
          <label className="mt-4">Tickets Link</label>
          <Form.Control as="textarea"
            rows={3}
            id="externalUrl"
            onChange={(e) => setExternalUrl(e.currentTarget.value)}
            value={externalUrl}
            placeholder='Ticket/Website Link (regular tickets)'
          />
        </Col>
      </Row> 
      <Row>
        <Col className="form-group">
          <FormCheck
            checked={disableLinkButton}
            onChange={(e) => setDisableLinkButton(e.target.checked)}
            label={'Disable "Tickets" button'}
          />
          <label className="mt-4">Alternate text for Tickets Button (10 chars or less)</label>
          <input
            value={disableLinkReason}
            onChange={(e) => setDisableLinkReason(e.target.value)}
            className="form-control"
            placeholder="Alternate text for Tickets button"
            type="text"
          />
        </Col>
      </Row>
      <Row>
        <Col className="form-group">
          <FormCheck
            checked={disableVipLinkButton}
            onChange={(e) => setDisableVipLinkButton(e.target.checked)}
            label={'Disable "VIP" button'}
          />
          <label className="mt-4">Alternate text for VIP Button (10 chars or less)</label>
          <input
            value={disableVipLinkReason}
            onChange={(e) => setDisableVipLinkReason(e.target.value)}
            className="form-control"
            placeholder="Alternate text for VIP button"
            type="text"
          />
        </Col>
      </Row>     
      <Row className="form-group" hidden={isExternalEvent}>
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
      <Row className="form-group" hidden={isExternalEvent}>
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
        </Col>
      </Row>
      <Row className="form-group" hidden={isExternalEvent}>
        <Col>
          Email Sent to Vips: {emailSentToVips}
        </Col>
      </Row>
      <Row className="form-group" hidden={isExternalEvent}>
        <Col>
          Text Sent to Vips: {textSentToVips}
        </Col>
      </Row>
      <Row className="form-group" hidden={isExternalEvent}>
        <Col>
          List sent to band: {listSentToBand}
        </Col>
      </Row>
      <Row className="form-group" hidden={isExternalEvent}>
        <Col>
          Date/Time List sent to band: {listSentTime}
        </Col>
      </Row>
      <Row className="form-group" hidden={isExternalEvent}>
        <Col>
            # of VIPs at time email was sent: {numVips}
        </Col>
      </Row>
      <Row hidden={isExternalEvent}>
        <Col>
          <h5>Ticket Types</h5>
        </Col>
      </Row>
      <Row hidden={isExternalEvent}>
        <Col>
          <table className="ticket-type-table">
            <tbody>{ticketTypeRows}</tbody>
          </table>
        </Col>
      </Row>
      <Row className="refund-section-header" hidden={refundsDisabled || isExternalEvent}>
        <Col>
          <h5>Process Event Refunds</h5>
        </Col>
      </Row>
      <Row className="refund-section" hidden={refundsDisabled || isExternalEvent}>
        <Col>
          <Button className="form-control-float" onClick={confirmDoRefund}>
            Refund All Tickets
          </Button>
          <FormCheck
            disabled={refundCancelDisabled}
            title={refundCancelTitle}
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
      <Row hidden={isExternalEvent}>
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
      <Row className="refund-section">
        <Col>
          <Button onClick={cancelTicketSocketEvent}>{cancelButtonText}</Button><br /><br />
          <Button onClick={handleNotesOpen}>Add Note</Button>
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
      <Row className="refund-section" hidden={isExternalEvent || (currentAdminSelection?.selectedEvent?.orders?.length ?? 0) <= 0}>
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
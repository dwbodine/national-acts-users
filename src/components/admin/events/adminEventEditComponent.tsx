'use client';

import moment from 'moment';
import { useRouter } from 'next/navigation';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Input,
  Modal,
  Row,
  SelectPicker,
  TimePicker,
} from 'rsuite';
import { ItemDataType } from 'rsuite/esm/internals/types';

import PageHeader from '@/components/common/PageHeaderComponent';
import Textarea from '@/components/common/Textarea';
import { ImageType } from '@/constants';
import { useAddCompedOrder } from '@/hooks/admin/useAddCompOrder';
import { useAddNote } from '@/hooks/admin/useAddNote';
import { useCancelEvent } from '@/hooks/admin/useCancelEvent';
import { useGetAllCountries } from '@/hooks/admin/useGetAllCountries';
import { useGetAllVenues } from '@/hooks/admin/useGetAllVenues';
import { useGetTicketSocketEventsOnly } from '@/hooks/admin/useGetTicketSocketEventsOnly';
import { useRefundEvent } from '@/hooks/admin/useRefundEvent';
import { useUpdateEvent } from '@/hooks/admin/useUpdateEvent';
import { useUpdateVenue } from '@/hooks/admin/useUpdateVenue';
import { useGetEventById } from '@/hooks/common/useGetEventById';
import { useGetLocation } from '@/hooks/common/useGetLocation';
import { useGetSellers } from '@/hooks/common/useGetSellers';
import { setTicketSocketEventsOnly, setVenues } from '@/lib/adminDataSelectionSlice';
import {
  setAdminDates,
  setAdminEvent,
  setAdminSellerId,
  setAdminVenue,
  setAllSellers,
  setCountries,
  setMustSaveEvent,
  setReloadCountries,
  setReloadEvents,
  setReloadSellers,
  setReloadVenues,
} from '@/lib/adminSelectionSlice';
import { setIsLoading, setSaveInProgress } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { ExternalVenue } from '@/types/admin';
import { Note, Seller, VipEvent } from '@/types/event';
import { EditProps } from '@/types/props';
import {
  GetCountriesResponse,
  GetEventResponse,
  GetEventsResponse,
  GetExternalVenuesResponse,
  GetSellersResponse,
  ModifyEventResponse,
  ModifyExternalVenueResponse,
  ModifyNoteResponse,
  ModifyOrderResponse,
} from '@/types/responses';

import ConfirmationDialog from '../../common/confirmationDialogComponent';
import AdminFileUpload from '../common/adminFileUploadComponent';

export default function AdminEventEdit(props: EditProps) {
  const id: number | undefined = props.Id as number;
  const hasId: boolean = id !== undefined && id > 0;
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const currentAdminDataSelection = useSelector((state: RootState) => state.adminDataSelection);
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const dispatch = useDispatch();
  const { updateVenue } = useUpdateVenue();
  const { getExternalVenueLocation } = useGetLocation();
  const { getAllVenues } = useGetAllVenues();
  const { getAllCountries } = useGetAllCountries();
  const router = useRouter();
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
  const [venueOpen, setVenueOpen] = useState(false);
  const [venueName, setVenueName] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string | undefined>(undefined);
  const [zipCode, setZipCode] = useState<string | undefined>(undefined);
  const [countryId, setCountryId] = useState<number | undefined>(undefined);
  const [timezone, setTimezone] = useState<string | undefined>(undefined);
  const [timeZoneList, setTimeZoneList] = useState<ItemDataType<string>[]>([]);

  const currentSeller: Seller | undefined = currentAdminSelection.allSellers?.find(
    (x) => x.sellerId === currentAdminSelection.sellerId,
  );

  const beforeOnUnload = (ev: BeforeUnloadEvent) => {
    ev.preventDefault();
    return ev;
  };

  const loadEventById = useCallback(() => {
    if (!hasId) {
      return;
    }

    dispatch(setMustSaveEvent(false));
    dispatch(setIsLoading(true));
    void getEventById(id).then((response: GetEventResponse) => {
      if (response.event && !response.error) {
        dispatch(setAdminEvent(response.event));
        dispatch(setAdminSellerId(response.event.sellerId));
        void getTicketSocketEventsOnly(response.event.sellerId).then((resp: GetEventsResponse) => {
          if (resp.events && !resp.error) {
            dispatch(setTicketSocketEventsOnly(resp.events));
          }
          dispatch(setIsLoading(false));
        });
      } else {
        dispatch(setIsLoading(false));
      }
    });
  }, [dispatch, getEventById, id, getTicketSocketEventsOnly]);

  useEffect(() => {
    const run = async () => {
      // Branch 1: reload countries
      if (currentAdminSelection.reloadCountries) {
        dispatch(setReloadCountries(false));
        if (!globalSelection.isLoading) {
          dispatch(setIsLoading(true));
        }

        const response: GetCountriesResponse = await getAllCountries();

        if (response.countries && !response.error) {
          dispatch(setCountries(response.countries));
        } else {
          toast.error(response.error);
          dispatch(setIsLoading(false));
        }
      }

      // Branch 2: reload sellers
      if (currentAdminSelection.reloadSellers) {
        dispatch(setReloadSellers(false));
        if (!globalSelection.isLoading) {
          dispatch(setIsLoading(true));
        }

        const response: GetSellersResponse = await getSellers();

        if (response.sellers && !response.error) {
          dispatch(setAllSellers(response.sellers));
        } else {
          toast.error(response.error);
          dispatch(setIsLoading(false));
        }
      }

      // Branch 3: reload venues
      if (currentAdminSelection.reloadVenues) {
        if (!globalSelection.isLoading) {
          dispatch(setIsLoading(true));
        }
        dispatch(setReloadVenues(false));

        const response: GetExternalVenuesResponse = await getAllVenues();

        if (response.venues && !response.error) {
          dispatch(setVenues(response.venues));
        } else {
          toast.error(response.error);
          dispatch(setIsLoading(false));
        }
      }

      // Branch 4: load event
      const canLoadEvent =
        currentAdminSelection.selectedEvent === undefined &&
        hasId &&
        currentAdminSelection.countries !== undefined &&
        currentAdminSelection.allSellers !== undefined &&
        currentAdminDataSelection.venues !== undefined;

      if (canLoadEvent) {
        void loadEventById();
        return;
      }

      // Branch 5: clear loading state
      const canClearLoading =
        currentAdminSelection &&
        currentAdminSelection.countries &&
        currentAdminSelection.allSellers &&
        currentAdminDataSelection.venues &&
        globalSelection.isLoading &&
        !globalSelection.saveInProgress;

      if (canClearLoading) {
        dispatch(setIsLoading(false));
      }
    };

    const timeoutId = setTimeout(() => {
      void run();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    currentAdminSelection.reloadCountries,
    currentAdminSelection.reloadSellers,
    currentAdminSelection.reloadVenues,
    currentAdminSelection.selectedEvent,
    currentAdminSelection.countries,
    currentAdminSelection.allSellers,
    currentAdminDataSelection.venues,
    id,
    globalSelection.isLoading,
    globalSelection.saveInProgress,
    dispatch,
    getAllCountries,
    getSellers,
    getAllVenues,
    loadEventById,
  ]);

  const markDirty = () => {
    dispatch(setMustSaveEvent(true));
    if (id) {
      window.addEventListener('beforeunload', beforeOnUnload);
    }
  };

  const goBack = (dismissToast: boolean = true) => {
    if (!hasId && dismissToast) {
      toast.dismiss();
    }
    dispatch(setAdminEvent(undefined));
    dispatch(setMustSaveEvent(false));
    if (!hasId) {
      router.push('/admin/events');
    }
  };

  const onEventVenueChange = (value: number | null) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.externalEventVenueId = value ?? undefined;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const onEventChange = (value: number | null) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.ticketSocketEventId = value ?? undefined;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setEventTitle = (title: string) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
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
    void addNote(noteText, currentAdminSelection.selectedEvent.externalEventId).then(
      (response: ModifyNoteResponse) => {
        if (response.success && !response.error) {
          toast.success('Note added successfully');
          setNoteText('');
          if (hasId) {
            loadEventById();
          } else {
            dispatch(setReloadEvents(true));
            dispatch(setAdminEvent(undefined));
            goBack(false);
          }
        } else {
          toast.error(response.error ?? 'Unexpected error occurred while adding note');
        }
        setNotesOpen(false);
      },
    );
  };

  const setIsActive = (isActive: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.isActive = isActive;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setIsHidden = (isHidden: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.isHidden = isHidden;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setIsDeleted = (isDeleted: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.isDeleted = isDeleted;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setIsAddedToBandsInTown = (isAddedToBandsInTown: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.isAddedToBandsInTown = isAddedToBandsInTown;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setIsExcludedFromDashboard = (isExcludedFromDashboard: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.excludeFromDashboard = isExcludedFromDashboard;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setDisableLinkButton = (isDisabled: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.disableLinkButton = isDisabled;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setDisableLinkReason = (reason: string) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.disableLinkReason = reason.trim().length > 0 ? reason : undefined;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setDisableVipLinkButton = (isDisabled: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.disableVipLinkButton = isDisabled;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setDisableVipLinkReason = (reason: string) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.disableVipLinkReason = reason.trim().length > 0 ? reason : undefined;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setExternalVipLink = (url: string) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.externalVipLink = url.trim().length > 0 ? url : undefined;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setExternalUrl = (url: string) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.externalUrl = url.trim().length > 0 ? url : undefined;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const onEventDateChange = (date: Date | null) => {
    if (!date || !currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }

    const eventDate = moment(date).startOf('day');
    const currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.eventDate = eventDate.format('YYYY-MM-DD');
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setCompTicketTypeName = (ticketTypeName: string) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent = { ...currentAdminSelection.selectedEvent };
    if (currentEvent.ticketTypes) {
      currentEvent.ticketTypes = currentEvent.ticketTypes.map((ticketType) => {
        const newTicketType = { ...ticketType };
        if (newTicketType.ticketTypeId === 0) {
          newTicketType.ticketTypeName = ticketTypeName;
        }
        return newTicketType;
      });
    }
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setTicketTypeOrder = (ticketTypeId: number, order: string) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent = { ...currentAdminSelection.selectedEvent };
    if (currentEvent.ticketTypes) {
      const orderNum = parseInt(order);
      if (isNaN(orderNum)) {
        return;
      }
      currentEvent.ticketTypes = currentEvent.ticketTypes.map((ticketType) => {
        const newTicketType = { ...ticketType };
        if (newTicketType.ticketTypeId === ticketTypeId) {
          newTicketType.ticketTypeOrder = orderNum;
        }
        return newTicketType;
      });
    }
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const onCleanAnnounceDate = () => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.announceDate = undefined;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const onAnnounceDateChange = (date: Date | null) => {
    if (!date || !currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }

    const eventDate = moment(currentAdminSelection.selectedEvent.eventDate).toDate();
    if (date >= eventDate) {
      toast.warn('Announce date must be before event date');
      onCleanAnnounceDate();
      return;
    }

    let announceDate = moment(date).startOf('day');
    announceDate = announceDate.hours(0);
    announceDate = announceDate.minutes(0);
    announceDate = announceDate.seconds(0);
    const currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.announceDate = announceDate.format('YYYY-MM-DD HH:mm:ss');
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const onCleanAnnounceTime = () => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent = { ...currentAdminSelection.selectedEvent };
    if (currentEvent.announceDate) {
      let announceDate = moment(currentEvent.announceDate);
      announceDate = announceDate.hours(0);
      announceDate = announceDate.minutes(0);
      announceDate = announceDate.seconds(0);
      currentEvent.announceDate = announceDate.format('YYYY-MM-DD HH:mm:ss');
    }
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
    const currentEvent = { ...currentAdminSelection.selectedEvent };
    let announceDate = moment(currentEvent.announceDate);
    announceDate = announceDate.hours(announceTime.hours());
    announceDate = announceDate.minutes(announceTime.minutes());
    announceDate = announceDate.seconds(0);
    currentEvent.announceDate = announceDate.format('YYYY-MM-DD HH:mm:ss');
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const onEventTimeChange = (date: Date | null) => {
    if (!date || !currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }

    const theTime = moment(date);
    const currentEvent = { ...currentAdminSelection.selectedEvent };
    let eventDate = moment(currentEvent.eventDate);
    eventDate = eventDate.hours(theTime.hours());
    eventDate = eventDate.minutes(theTime.minutes());
    eventDate = eventDate.seconds(0);
    currentEvent.eventTime = eventDate.format('YYYY-MM-DD HH:mm:ss');
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const onCleanEventTime = () => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.eventTime = undefined;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const onCheckInLocationChange = (location: string | undefined) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.checkInLocation = location;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const onCheckInNotesChange = (notes: string | undefined) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.checkInNotes = notes;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const onCountryChange = (cId: number | null) => {
    setCountryId(cId ?? undefined);
    if (cId) {
      const country = currentAdminSelection.countries?.find((x) => x.countryId === cId);
      const tzList: ItemDataType<string>[] = country?.timezones
        ? country.timezones.map((tz) => ({
            label: `${tz.displayName}`,
            value: tz.timezone,
          }))
        : [];
      setTimeZoneList(tzList);
    } else {
      setTimeZoneList([]);
    }
  };

  const onTimezoneChange = (tzone: string | null) => {
    setTimezone(tzone ?? undefined);
  };

  const confirmGoBack = () => {
    if (!currentAdminSelection?.mustSaveEvent) {
      goBack();
      return;
    }

    const message: string =
      'You have made changes to this event, are you sure you want to discard them and leave?';
    toast.warning(
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
        autoClose: false,
        closeOnClick: false,
        position: 'top-center',
      },
    );
  };

  const manageOrders = () => {
    if (!currentAdminSelection.selectedEvent) {
      return;
    }
    let path = '/admin/events/orders/';
    if (hasId) {
      path += `?id=${id}`;
    }
    router.push(path);
  };

  const setTicketTypeStatus = (ticketTypeId: number, isActive: boolean) => {
    if (
      currentAdminSelection.selectedEvent === undefined ||
      currentAdminSelection.selectedEvent.ticketTypes === undefined ||
      !ticketTypeId ||
      isNaN(ticketTypeId)
    ) {
      return;
    }

    if (ticketTypeId > 0) {
      const currentEvent = { ...currentAdminSelection.selectedEvent };
      currentEvent.ticketTypes = currentEvent.ticketTypes?.map((ticketType) => {
        const updatedTicketType = { ...ticketType };
        if (ticketType.ticketTypeId === ticketTypeId) {
          updatedTicketType.isActive = isActive;
        }
        return updatedTicketType;
      });
      dispatch(setAdminEvent(currentEvent));
      markDirty();
    }
  };

  const handleRefund = () => {
    toast.dismiss();
    if (!currentAdminSelection.selectedEvent) {
      return;
    }
    dispatch(setIsLoading(true));
    const eventId = currentAdminSelection.selectedEvent.externalEventId;
    void refundEvent(eventId, markCancelled, refundServiceFees).then(
      (response: ModifyEventResponse) => {
        const { success } = response;
        dispatch(setIsLoading(false));
        if (success) {
          toast.success('Refund succeeded');
          if (hasId) {
            loadEventById();
          } else {
            dispatch(setReloadEvents(true));
            dispatch(setAdminEvent(undefined));
            goBack(false);
          }
        } else {
          toast.error('Refund failed');
        }
      },
    );
  };

  const confirmDoRefund = () => {
    if (
      !currentAdminSelection.selectedEvent ||
      !currentAdminSelection.selectedEvent.orders ||
      currentAdminSelection.selectedEvent.orders.length === 0
    ) {
      return;
    }

    let hasMissingPrices = false;
    for (const order of currentAdminSelection.selectedEvent.orders) {
      if (!order.isComped && order.tickets && order.tickets.length > 0) {
        const missingOrderTicket = order.tickets.find((x) => (x.price ?? 0) === 0);
        if (missingOrderTicket !== undefined) {
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
    toast.warning(
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
        autoClose: false,
        closeOnClick: false,
        position: 'top-center',
      },
    );
  };

  const compOrder = () => {
    if (!currentAdminSelection.selectedEvent) {
      return;
    }
    if (!currentAdminSelection.selectedEvent.ticketSocketEventId) {
      toast.warn('Cannot currently comp orders for an event without tickets on sale');
      return;
    }
    if (numCompedTickets === 0) {
      toast.warn('Must enter a number for comped tickets for the order');
      return;
    }
    dispatch(setIsLoading(true));
    const eventId = currentAdminSelection.selectedEvent.externalEventId;
    void addCompedOrder(eventId, numCompedTickets).then((response: ModifyOrderResponse) => {
      const { success } = response;
      dispatch(setIsLoading(false));
      if (success) {
        toast.success('Comp order created');
        if (hasId) {
          loadEventById();
        } else {
          dispatch(setReloadEvents(true));
          dispatch(setAdminEvent(undefined));
          goBack(false);
        }
      } else {
        toast.error('Comp order creation failed');
      }
    });
  };

  const cancelTicketSocketEvent = () => {
    if (!currentAdminSelection.selectedEvent) {
      return;
    }

    const eventId = currentAdminSelection.selectedEvent.externalEventId;
    const isCancelled = !currentAdminSelection.selectedEvent.isCancelled;

    dispatch(setIsLoading(true));

    void cancelEvent(eventId, isCancelled).then((response: ModifyEventResponse) => {
      const { success } = response;
      dispatch(setIsLoading(false));
      if (success) {
        const message = isCancelled ? 'Cancellation succeeded' : 'Uncancellation succeeded';
        toast.success(message);
        if (hasId) {
          loadEventById();
        } else {
          dispatch(setReloadEvents(true));
          dispatch(setAdminEvent(undefined));
          goBack(false);
        }
      } else {
        const message = isCancelled ? 'Cancellation failed' : 'Uncancellation failed';
        toast.error(message);
      }
    });
  };

  const onFileUpload = (fileUploadName: string, filename: string) => {
    if (!currentAdminSelection.selectedEvent || !fileUploadName || !filename) {
      return;
    }
    const currentEvent = { ...currentAdminSelection.selectedEvent };
    switch (fileUploadName) {
      case 'Thumbnail':
        currentEvent.externalThumbnail = filename;
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

  const onFileRemove = () => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    const currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.externalThumbnail = undefined;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const handleVenueOpen = () => {
    const venue: ExternalVenue = {
      address: '',
      city: '',
      venue: '',
      venueId: 0,
    };

    setVenueName(undefined);
    setAddress(undefined);
    setCity(undefined);
    setState(undefined);
    setZipCode(undefined);
    setCountryId(undefined);
    setTimeZoneList([]);
    setTimezone(undefined);

    dispatch(setAdminVenue(venue));
    setVenueOpen(true);
  };

  const handleVenueClose = () => setVenueOpen(false);

  const addVenue = () => {
    if (!currentAdminSelection.selectedVenue) {
      return;
    }

    if (!venueName) {
      toast.error('Venue name is required');
      return;
    }

    if (!address) {
      toast.error('Address is required');
      return;
    }

    if (!city) {
      toast.error('City is required');
      return;
    }

    if (!countryId) {
      toast.error('Country is required (even USA)');
      return;
    }

    if (!state && !zipCode) {
      toast.error('Must provide at least one of state or zip');
      return;
    }

    if (!timezone) {
      toast.error('Timezone is required');
      return;
    }

    handleVenueClose();

    const venueToUpdate: ExternalVenue = {
      ...currentAdminSelection.selectedVenue,
      address,
      city,
      country: { countryId },
      state,
      timezone: { timezone },
      venue: venueName,
      zipCode,
    };

    void updateVenue(venueToUpdate).then((response: ModifyExternalVenueResponse) => {
      if (response.success) {
        const newVenue = response.updatedVenue;
        const adminSelection = { ...currentAdminSelection };
        if (newVenue !== undefined && adminSelection.selectedEvent !== undefined) {
          const currentEvent = { ...adminSelection.selectedEvent };
          currentEvent.externalEventVenueId = newVenue.venueId;
          dispatch(setAdminEvent(currentEvent));
          dispatch(setAdminVenue(undefined));
          dispatch(setVenues(undefined));
          dispatch(setReloadVenues(true));
          markDirty();
        } else {
          toast.error('Error occurred while saving venue');
        }
      } else {
        toast.error(response.error ?? 'Error occurred while saving venue');
      }
    });
  };

  const onSubmit = () => {
    if (!currentAdminSelection.selectedEvent || !currentAdminSelection.sellerId) {
      return;
    }

    const eventToUpdate: VipEvent = { ...currentAdminSelection.selectedEvent };

    if (!eventToUpdate.title) {
      toast.warning('Title must be set');
      return;
    }

    if (!eventToUpdate.eventDate) {
      toast.warning('Event date must be set');
      return;
    }

    if (!eventToUpdate.externalEventVenueId) {
      toast.warning('Event venue must be set');
      return;
    }

    if (!eventToUpdate.externalUrl && !eventToUpdate.externalVipLink) {
      toast.warning('Either vip or ticket link must be set');
      return;
    }

    if (eventToUpdate.externalVipLink) {
      if (
        !eventToUpdate.externalVipLink.startsWith('http://') &&
        !eventToUpdate.externalVipLink.startsWith('https://')
      ) {
        toast.warning('VIP link supplied is invalid');
        return;
      }
    }

    if (eventToUpdate.externalUrl) {
      if (
        !eventToUpdate.externalUrl.startsWith('http://') &&
        !eventToUpdate.externalUrl.startsWith('https://')
      ) {
        toast.warning('Ticket link supplied is invalid');
        return;
      }
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

    if (!eventToUpdate.externalThumbnail) {
      eventToUpdate.externalThumbnail = undefined;
    }

    dispatch(setIsLoading(true));
    dispatch(setSaveInProgress(true));

    void updateEvent(eventToUpdate).then((response: ModifyEventResponse) => {
      if (response.success) {
        const adminSelection = { ...currentAdminSelection };
        adminSelection.start = undefined;
        adminSelection.end = undefined;
        toast.success('Event updated successfully');
        if (hasId) {
          loadEventById();
          window.removeEventListener('beforeunload', beforeOnUnload);
          if (window.opener) {
            (window.opener as Window).location.reload();
          }
        } else {
          dispatch(setReloadEvents(true));
          dispatch(setAdminDates(adminSelection));
          dispatch(setAdminEvent(undefined));
          dispatch(setAdminVenue(undefined));
          goBack(false);
        }
      } else {
        toast.error(response.error ?? 'Error occurred while updating event');
      }
      dispatch(setSaveInProgress(false));
      dispatch(setIsLoading(false));
    });
  };

  const { selectedEvent } = currentAdminSelection;

  const eventId = selectedEvent?.externalEventId ? selectedEvent.externalEventId : 0;

  const ticketSocketEventId = selectedEvent?.ticketSocketEventId ?? 0;

  const pageHeader =
    eventId > 0 ? `Edit event for ${currentSeller?.name}` : `Add event for ${currentSeller?.name}`;

  const eventTitle = selectedEvent ? selectedEvent.title : '';

  const eventDate = selectedEvent?.eventDate ? moment(selectedEvent.eventDate).toDate() : null;

  const eventTime = selectedEvent?.eventTime ? moment(selectedEvent.eventTime).toDate() : null;

  const announceDate = selectedEvent?.announceDate
    ? moment(selectedEvent.announceDate).toDate()
    : null;

  const refundsDisabled =
    selectedEvent === undefined || selectedEvent.totalTickets === 0 || ticketSocketEventId === 0;

  const isCancelled = selectedEvent?.isCancelled ?? false;
  const cancelButtonText = isCancelled ? 'Uncancel Event' : 'Mark Cancelled';
  const refundCancelDisabled = isCancelled;
  const refundCancelTitle = refundCancelDisabled ? 'Event has already been cancelled' : '';

  const isActive = selectedEvent?.isActive ?? false;
  const isDeleted = selectedEvent?.isDeleted ?? false;
  const isHidden = selectedEvent?.isHidden ?? false;
  const isAddedToBandsInTown = selectedEvent?.isAddedToBandsInTown ?? false;
  const isExcludedFromDashboard = selectedEvent?.excludeFromDashboard ?? false;

  const thumbnail = selectedEvent?.externalThumbnail ?? undefined;
  const externalEventVenueId = selectedEvent?.externalEventVenueId ?? 0;

  const externalUrl = selectedEvent?.externalUrl ?? '';
  const externalVipLink = selectedEvent?.externalVipLink ?? '';

  const disableLinkButton = selectedEvent?.disableLinkButton ?? false;
  const disableLinkReason = selectedEvent?.disableLinkReason ?? undefined;

  const disableVipLinkButton = selectedEvent?.disableVipLinkButton ?? false;
  const disableVipLinkReason = selectedEvent?.disableVipLinkReason ?? undefined;

  const emailSentToVips = selectedEvent?.emailSentToVips ? 'true' : 'false';
  const textSentToVips = selectedEvent?.textSentToVips ? 'true' : 'false';
  const listSentToBand = selectedEvent?.listSentToBand ? 'true' : 'false';
  const listSentTime = selectedEvent?.listSentTime
    ? moment.utc(selectedEvent.listSentTime).format('MM/DD/YYYY h:mm A')
    : 'n/a';
  const numVips =
    (selectedEvent?.listSentToBand ?? false)
      ? (selectedEvent?.listSentNumVips ?? 0).toString()
      : 'n/a';

  const checkInLocation = selectedEvent?.checkInLocation ?? '';
  const checkInNotes = selectedEvent?.checkInNotes ?? '';

  const ticketTypeRows: ReactElement[] = [];
  if (selectedEvent && selectedEvent.ticketTypes && selectedEvent.ticketTypes.length > 0) {
    selectedEvent.ticketTypes.forEach((ticketType, i) => {
      const { ticketTypeId } = ticketType;
      let ticketTypeDisabled = false;
      if (selectedEvent && selectedEvent.orders) {
        for (let j = 0; j < selectedEvent.orders.length; j += 1) {
          const order = selectedEvent.orders[j];
          if (!order) {
            continue;
          }
          if (order.isComped) {
            ticketTypeDisabled = true;
          } else {
            const ticketsWithType = order.tickets?.find((x) => x.ticketTypeId === ticketTypeId);
            if (ticketsWithType !== undefined) {
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
          <td>
            {ticketType.ticketTypeId === 0 ? (
              <Input value={ticketType.ticketTypeName ?? ''} onChange={setCompTicketTypeName} />
            ) : (
              ticketType.ticketTypeName
            )}
          </td>
          <td>
            {ticketType.ticketTypeId > 0 ? (
              <Checkbox
                id={`ticketType_${ticketType.ticketTypeId}`}
                title={rowTitle}
                disabled={ticketTypeDisabled}
                checked={ticketType.isActive}
                onChange={(_, checked) =>
                  setTicketTypeStatus(parseInt(`${ticketType.ticketTypeId}`), checked)
                }
              >
                Active
              </Checkbox>
            ) : (
              ''
            )}
          </td>
          <td>
            <Input
              style={{ width: '80px' }}
              value={ticketType.ticketTypeOrder}
              onChange={(value) => setTicketTypeOrder(ticketType.ticketTypeId, value)}
            />
          </td>
        </tr>,
      );
    });
  }

  if (ticketTypeRows.length === 0) {
    ticketTypeRows.push(
      <tr key="admin_tt0">
        <td colSpan={2}>n/a</td>
      </tr>,
    );
  }

  const notes: ReactElement[] = [];
  if (selectedEvent?.notes) {
    selectedEvent.notes.forEach((note: Note) => {
      notes.push(
        <div key={`note_${note.noteId}`}>
          {note.note}&nbsp;
          <span className="note-created">
            Date: {moment(note.noteTimestamp).format('MM/DD/YYYY h:mm A')}
          </span>
        </div>,
      );
    });
  }

  if (notes.length === 0) {
    notes.push(<div key="note_00">n/a</div>);
  }

  const venueList: ItemDataType<number>[] = currentAdminDataSelection?.venues
    ? currentAdminDataSelection?.venues?.map((venue) => ({
        label: `${venue.venue} ${getExternalVenueLocation(venue)}`,
        value: venue.venueId,
      }))
    : [];

  const eventList: ItemDataType<number>[] = currentAdminDataSelection?.ticketSocketEvents
    ? currentAdminDataSelection?.ticketSocketEvents?.map((evt) => ({
        label: `${moment(evt.eventDate).format('MM/DD/YYYY')} - ${evt.title}`,
        value: evt.ticketSocketEventId,
      }))
    : [];

  const isExternalEvent = (selectedEvent?.isExternal ?? false) && ticketSocketEventId === 0;

  const countryList: ItemDataType<number>[] = currentAdminSelection.countries
    ? currentAdminSelection.countries.map((country) => ({
        label: `${country.countryName}`,
        value: country.countryId,
      }))
    : [];

  return (
    <>
      <PageHeader pageTitle={pageHeader} />
      <div className="admin-container" hidden={selectedEvent === undefined}>
        <Row>
          <Col>
            <Button hidden={hasId} onClick={confirmGoBack}>
              Back
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="admin-setting-title">Event title</div>
            <Input
              value={eventTitle ?? ''}
              onChange={setEventTitle}
              className="form-control"
              placeholder="event title"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="admin-setting-title">Event date</div>
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
          <Col>
            <div className="admin-setting-title">Associated Ticket Socket Event</div>
            <SelectPicker
              value={ticketSocketEventId}
              data={eventList}
              size="lg"
              block
              onChange={onEventChange}
            />
          </Col>
        </Row>
        <Row className="admin-event-row">
          <Col>
            <div className="admin-setting-title">Event venue</div>
            <SelectPicker
              value={externalEventVenueId}
              data={venueList}
              size="lg"
              block
              onChange={onEventVenueChange}
            />
            <Button disabled={externalEventVenueId > 0} onClick={handleVenueOpen}>
              Add New Venue
            </Button>
            <Modal open={venueOpen} onClose={handleVenueClose} size={'lg'}>
              <Modal.Header>
                <Modal.Title>Add New Venue:</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <div className="admin-setting-title">Venue name</div>
                  <Input
                    value={venueName ?? ''}
                    onChange={setVenueName}
                    placeholder="venue name"
                    style={{ width: '80%' }}
                  />
                </div>
                <div>
                  <div className="admin-setting-title">Address</div>
                  <Input
                    value={address ?? ''}
                    onChange={setAddress}
                    placeholder="address"
                    style={{ width: '80%' }}
                  />
                </div>
                <div>
                  <div className="admin-setting-title">City</div>
                  <Input value={city ?? ''} onChange={setCity} placeholder="city" />
                </div>
                <div>
                  <div className="admin-setting-title">State</div>
                  <Input value={state ?? ''} onChange={setState} placeholder="state" />
                </div>
                <div>
                  <div className="admin-setting-title">Postal Code</div>
                  <Input value={zipCode ?? ''} onChange={setZipCode} placeholder="postal code" />
                </div>
                <div>
                  <div className="admin-setting-title">Country</div>
                  <SelectPicker
                    className="admin-seller-select-value"
                    menuAutoWidth={true}
                    value={countryId}
                    data={countryList}
                    size="lg"
                    onChange={onCountryChange}
                    cleanable={false}
                  />
                </div>
                <div>
                  <div className="admin-setting-title">Timezone</div>
                  <SelectPicker
                    className="admin-seller-select-value"
                    menuAutoWidth={true}
                    value={timezone}
                    data={timeZoneList}
                    size="lg"
                    onChange={onTimezoneChange}
                    cleanable={false}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer className="modal-notes-footer">
                <Button onClick={addVenue}>Ok</Button>
                <Button onClick={handleVenueClose}>Cancel</Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
        <Row>
          <Col>
            <AdminFileUpload
              ImageType={ImageType.THUMBNAILS}
              Title="Event thumbnail (square, will be resized to 100px wide)"
              FileUploadName="Thumbnail"
              OnUpload={onFileUpload}
              CurrentFileName={thumbnail}
              IsDirty={isThumbnailDirty}
              CurrentFileTitle={'View Current Thumbnail'}
              OnUploadStart={onUploadStart}
              OnUploadComplete={onUploadComplete}
              ShowRemoveButton={true}
              OnFileRemove={onFileRemove}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="admin-setting-title">Event time (in venue local time zone)</div>
            <TimePicker
              id="eventTime"
              format="hh:mm aa"
              onSelect={onEventTimeChange}
              value={eventTime}
              cleanable
              showMeridiem
              onClean={onCleanEventTime}
            />

            <div className="admin-setting-title">Announce Date (in Pacific Time)</div>
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
          <Col>
            <span className="edit-event-link">VIP Link</span>
            <a
              target="_blank"
              className="edit-event-link"
              hidden={!externalVipLink}
              href={externalVipLink}
            >
              Visit
            </a>
            <Textarea
              rows={3}
              id="externalVipLink"
              onChange={setExternalVipLink}
              value={externalVipLink ?? ''}
              placeholder="VIP/Website Link (VIP tickets)"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <span className="edit-event-link">Tickets Link</span>
            <a target="_blank" className="edit-event-link" hidden={!externalUrl} href={externalUrl}>
              Visit
            </a>
            <Textarea
              rows={3}
              id="externalUrl"
              onChange={setExternalUrl}
              value={externalUrl ?? ''}
              placeholder="Ticket/Website Link (regular tickets)"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Checkbox
              checked={disableLinkButton}
              onChange={(_, checked) => setDisableLinkButton(checked)}
            >
              Disable "Tickets" button
            </Checkbox>
            <div className="admin-setting-title">
              Alternate text for Tickets Button (10 chars or less)
            </div>
            <Input
              value={disableLinkReason ?? ''}
              onChange={setDisableLinkReason}
              className="form-control"
              placeholder="Alternate text for Tickets button"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Checkbox
              checked={disableVipLinkButton}
              onChange={(_, checked) => setDisableVipLinkButton(checked)}
            >
              Disable "VIP" button
            </Checkbox>
            <div className="admin-setting-title">
              Alternate text for VIP Button (10 chars or less)
            </div>
            <Input
              value={disableVipLinkReason ?? ''}
              onChange={setDisableVipLinkReason}
              className="form-control"
              placeholder="Alternate text for VIP button"
            />
          </Col>
        </Row>
        <Row hidden={isExternalEvent}>
          <Col xs={2}>Check-in location:</Col>
          <Col xs={10}>
            <Textarea
              rows={3}
              id="checkInLocation"
              onChange={onCheckInLocationChange}
              value={checkInLocation ?? ''}
            />
          </Col>
        </Row>
        <Row hidden={isExternalEvent}>
          <Col xs={2}>Check-in notes:</Col>
          <Col xs={10}>
            <Textarea
              id="checkInNotes"
              rows={5}
              onChange={onCheckInNotesChange}
              value={checkInNotes ?? ''}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <Checkbox
              checked={isActive && !isDeleted}
              disabled={isDeleted}
              onChange={(_, checked) => setIsActive(checked)}
            >
              Is Active?
            </Checkbox>
            <br />
            <Checkbox
              checked={isHidden}
              disabled={isDeleted}
              onChange={(_, checked) => setIsHidden(checked)}
            >
              Is Hidden?
            </Checkbox>
            <br />
            <Checkbox checked={isDeleted} onChange={(_, checked) => setIsDeleted(checked)}>
              Is Deleted?
            </Checkbox>
            <br />
            <Checkbox
              checked={isAddedToBandsInTown}
              disabled={isDeleted}
              onChange={(_, checked) => setIsAddedToBandsInTown(checked)}
            >
              Is Added to BandsInTown?
            </Checkbox>
            <br />
            <Checkbox
              checked={isExcludedFromDashboard}
              disabled={isDeleted}
              onChange={(_, checked) => setIsExcludedFromDashboard(checked)}
            >
              Is Excluded from Dashboard?
            </Checkbox>
          </Col>
        </Row>
        <Row hidden={isExternalEvent}>
          <Col>Email Sent to Vips: {emailSentToVips}</Col>
        </Row>
        <Row hidden={isExternalEvent}>
          <Col>Text Sent to Vips: {textSentToVips}</Col>
        </Row>
        <Row hidden={isExternalEvent}>
          <Col>List sent to band: {listSentToBand}</Col>
        </Row>
        <Row hidden={isExternalEvent}>
          <Col>Date/Time List sent to band: {listSentTime}</Col>
        </Row>
        <Row hidden={isExternalEvent}>
          <Col># of VIPs at time email was sent: {numVips}</Col>
        </Row>
        <Row hidden={isExternalEvent}>
          <Col>
            <h5>Ticket Types</h5>
          </Col>
        </Row>
        <Row hidden={isExternalEvent}>
          <Col>
            <table className="ticket-type-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Is Active?</th>
                  <th>Order</th>
                </tr>
              </thead>
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
            <Checkbox
              disabled={refundCancelDisabled}
              title={refundCancelTitle}
              className="form-control-float"
              checked={markCancelled}
              onChange={(_, checked) => setMarkCancelled(checked)}
            >
              Mark as cancelled?
            </Checkbox>
            <Checkbox
              className="form-control-float"
              checked={refundServiceFees}
              onChange={(_, checked) => setRefundServiceFees(checked)}
            >
              Refund service fees?
            </Checkbox>
          </Col>
        </Row>
        <Row hidden={isExternalEvent}>
          <Col>
            Add comp order with
            <Input
              value={numCompedTickets}
              onChange={(value) => setNumCompedTickets(parseInt(value))}
              type="number"
              className="comped-tickets"
            />
            tickets
            <Button className="comp-button" onClick={compOrder}>
              Comp
            </Button>
          </Col>
        </Row>
        <Row className="refund-section">
          <Col>
            <Button onClick={cancelTicketSocketEvent}>{cancelButtonText}</Button>
            <br />
            <br />
            <Button onClick={handleNotesOpen}>Add Note</Button>
            <Modal open={notesOpen} onClose={handleNotesClose}>
              <Modal.Header>
                <Modal.Title>Add New Note:</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Textarea
                  id="addNote"
                  rows={5}
                  onChange={setNoteText}
                  value={noteText ?? ''}
                  placeholder="Note text"
                />
              </Modal.Body>
              <Modal.Footer className="modal-notes-footer">
                <Button onClick={addNewNote}>Ok</Button>
                <Button onClick={handleNotesClose}>Cancel</Button>
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
        <Row
          className="refund-section"
          hidden={
            isExternalEvent || (currentAdminSelection?.selectedEvent?.orders?.length ?? 0) <= 0
          }
        >
          <Col>
            <Button onClick={manageOrders}>Manage Orders</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={onSubmit} disabled={isUploading}>
              Submit
            </Button>{' '}
            <Button hidden={hasId} onClick={confirmGoBack}>
              Back
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
}

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
import { Seller, VipEvent } from '@/types/event';
import {
  setAdminEvent,
  setReloadEvents,
  setMustSaveEvent,
  setVenues,
  setAdminVenue,
  setAdminEvents,
  setReloadVenues,
  setAdminEventsOnly,
} from '@/lib/adminSelectionSlice';
import { DatePicker, Modal, SelectPicker, TimePicker } from 'rsuite';
import { useGetAllVenues } from '@/hooks/admin/useGetAllVenues';
import { useUpdateExternalEvent } from '@/hooks/admin/useUpdateExternalEvent';
import { ExternalVenue, ModifyExternalEventResponse, ModifyExternalVenueResponse } from '@/types/admin';
import { ItemDataType } from 'rsuite/esm/internals/types';
import AdminFileUpload from '../common/adminFileUploadComponent';
import { useUpdateVenue } from '@/hooks/admin/useUpdateVenue';
import { useGetAdminSellerEvents } from '@/hooks/admin/useGetAdminSellerEvents';
import { setReloadAdminEvents } from '@/lib/adminEventsSelectionSlice';

export default function AdminExternalEventEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { updateVenue } = useUpdateVenue();
  const { getExternalVenueLocation } = useGetLocation();
  const { updateExternalEvent } = useUpdateExternalEvent();
  const { getAllVenues } = useGetAllVenues();
  const { getAdminSellerEvents } = useGetAdminSellerEvents();
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.reloadVenues) {
        dispatch(setIsLoading(true));
        dispatch(setReloadVenues(false));
        getAllVenues()
          .then((response) => {
            if (response.venues && !response.venueError) {
              dispatch(
                setVenues(response.venues)
              );
              if (currentSeller != undefined && currentSeller.sellerId != undefined) {
                getAdminSellerEvents([currentSeller.sellerId]).then((response) => {
                  if (response.events && !response.eventError) {
                    dispatch(setAdminEventsOnly(response.events));
                  }
                  dispatch(setIsLoading(false));
                });
              }      
            }
          })
      }
    }, 300);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentAdminSelection, dispatch, getAllVenues, currentSeller, getAdminSellerEvents]);

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
    currentEvent.ticketSocketEventId = value ?? 0;
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

  const setIsActive = (isActive: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.isActive = isActive;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setIsCancelled = (isCancelled: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.isCancelled = isCancelled;
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
      toast.warn('Announce date must be before event date');
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

  const onCleanAnnounceDate = () => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.announceDate = undefined;
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

  const onDoorsOpenChange = (date: Date | null) => {
      if (!date || !currentAdminSelection || !currentAdminSelection.selectedEvent) {
        return;
      }
  
      let doorsOpen = moment(currentAdminSelection.selectedEvent.eventDate)
        .startOf('day')
        .add(date.getHours(), 'hours')
        .add(date.getMinutes(), 'minutes');
  
      let currentEvent = { ...currentAdminSelection.selectedEvent };
      currentEvent.doorsOpen = doorsOpen.format('YYYY-MM-DD HH:mm:ss');
      dispatch(setAdminEvent(currentEvent));
      markDirty();
    };

    const onCleanDoorsOpen = () => {
      if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
        return;
      }
      let currentEvent = { ...currentAdminSelection.selectedEvent };
      if (currentEvent) {
        currentEvent.doorsOpen = undefined;
      }    
      dispatch(setAdminEvent(currentEvent));
      markDirty();
    };
  
    const onMeetAndGreetChange = (date: Date | null) => {
      if (!date || !currentAdminSelection || !currentAdminSelection.selectedEvent) {
        return;
      }
  
      let meetAndGreet = moment(currentAdminSelection.selectedEvent.eventDate)
        .startOf('day')
        .add(date.getHours(), 'hours')
        .add(date.getMinutes(), 'minutes');
  
      let currentEvent = { ...currentAdminSelection.selectedEvent };
      currentEvent.meetAndGreetTime = meetAndGreet.format('YYYY-MM-DD HH:mm:ss');
      dispatch(setAdminEvent(currentEvent));
      markDirty();
    };

  const onCleanMeetAndGreet = () => {
      if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
        return;
      }
      let currentEvent = { ...currentAdminSelection.selectedEvent };
      if (currentEvent) {
        currentEvent.meetAndGreetTime = undefined;
      }    
      dispatch(setAdminEvent(currentEvent));
      markDirty();
    };

  const goBack = (dismissToast: boolean = true) => {
    if (dismissToast) {
      toast.dismiss();
    }
    dispatch(setMustSaveEvent(false));
    router.push('/admin/external-events/seller/');
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

  const markDirty = () => {
    dispatch(setMustSaveEvent(true));
  };

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

    const evtDate = moment(eventToUpdate.eventDate).unix();
    const today = moment().endOf('day').unix();

    if (evtDate < today) {
      toast.warning("Event date must be greater than today's date");
      return;
    }

    if (!eventToUpdate.externalEventVenueId) {
      toast.warning("Event venue must be set");
      return;
    }

    if (!eventToUpdate.externalUrl) {
      toast.warning("External Ticket/Website Link must be set");
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

    updateExternalEvent(currentAdminSelection.sellerId, eventToUpdate).then((response: ModifyExternalEventResponse) => {
      if (response.success) {
        toast.success('Event updated successfully');
        dispatch(setReloadEvents(true));
        dispatch(setAdminEvent(undefined));
        dispatch(setAdminVenue(undefined));
        goBack(false);
      } else {
        toast.error(response.eventError ?? 'Error occurred while updating event');
      }
      dispatch(setIsLoading(false));
    });
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

  const eventId =
    currentAdminSelection.selectedEvent?.eventId != undefined
      ? currentAdminSelection.selectedEvent.eventId
      : 0;

  const pageHeader = (eventId > 0) ? `Edit external event for ${currentSeller?.name}` : `Add external event for ${currentSeller?.name}`;

  const eventTitle =
    currentAdminSelection.selectedEvent != undefined
      ? currentAdminSelection.selectedEvent.title
      : '';

  const eventDate =
    currentAdminSelection.selectedEvent?.eventDate != undefined
      ? moment(currentAdminSelection.selectedEvent.eventDate).toDate()
      : null;

  const eventTime =
        currentAdminSelection.selectedEvent != undefined &&
          currentAdminSelection.selectedEvent.eventTime != null
          ? moment(currentAdminSelection.selectedEvent.eventTime).toDate()
          : null; 

  const doorsOpenTime =
    currentAdminSelection.selectedEvent != undefined &&
      currentAdminSelection.selectedEvent.doorsOpen != null
      ? moment(currentAdminSelection.selectedEvent.doorsOpen).toDate()
      : null;

  const meetAndGreetTime =
    currentAdminSelection.selectedEvent != undefined &&
      currentAdminSelection.selectedEvent.meetAndGreetTime != null
      ? moment(currentAdminSelection.selectedEvent.meetAndGreetTime).toDate()
      : null;

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

  const isCancelled = currentAdminSelection?.selectedEvent?.isCancelled ?? false;
  const isActive = currentAdminSelection?.selectedEvent?.isActive ?? false;
  const isDeleted = currentAdminSelection?.selectedEvent?.isDeleted ?? false;
  const isHidden = currentAdminSelection?.selectedEvent?.isHidden ?? false;
  const isAddedToBandsInTown =
    currentAdminSelection?.selectedEvent?.isAddedToBandsInTown ?? false;

  const thumbnail = currentAdminSelection?.selectedEvent?.thumbnail ?? undefined;
  const externalEventVenueId = currentAdminSelection?.selectedEvent?.externalEventVenueId ?? 0;
  const ticketSocketEventId = currentAdminSelection?.selectedEvent?.ticketSocketEventId ?? 0;

  const externalUrl = currentAdminSelection?.selectedEvent?.externalUrl ?? undefined;
  const externalVipLink = currentAdminSelection?.selectedEvent?.externalVipLink ?? undefined;

  const disableLinkButton = currentAdminSelection?.selectedEvent?.disableLinkButton ?? false;
  const disableLinkReason = currentAdminSelection?.selectedEvent?.disableLinkReason ?? undefined;

  const disableVipLinkButton = currentAdminSelection?.selectedEvent?.disableVipLinkButton ?? false;
  const disableVipLinkReason = currentAdminSelection?.selectedEvent?.disableVipLinkReason ?? undefined;

  const venueList: ItemDataType<number>[] = currentAdminSelection?.venues ?
    currentAdminSelection?.venues?.map((venue) => {
      return {
        label: `${venue.venue} ${getExternalVenueLocation(venue)}`,
        value: venue.venueId
      }
    }) : [];

  const eventList: ItemDataType<number>[] = currentAdminSelection?.events ?
    currentAdminSelection?.events?.map((evt) => {
      return {
        label: `${moment(evt.eventDate).format('MM/DD/YYYY')} - ${evt.title}`,
        value: evt.ticketSocketEventId
      }
    }) : [];

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

          <label className="mt-4">Event date</label>
          <DatePicker
            id="eventDate"
            format="M/d/yyyy"
            onSelect={onEventDateChange}
            value={eventDate}
            oneTap
            showMeridiem
          />

          <label className="mt-4">Associated Ticket Socket Event</label>
          <SelectPicker
            value={ticketSocketEventId}
            data={eventList}
            size="lg"
            block
            onChange={onEventChange}
          />
          
          <label className="mt-4">Doors Open (local)</label>
                  
          <TimePicker
            id="doorsOpen"
            format="hh:mm aa"
            showMeridiem={true}
            hideMinutes={minute => minute % 15 !== 0}
            onChange={onDoorsOpenChange}
            value={doorsOpenTime}
            cleanable
            onClean={onCleanDoorsOpen}
          />

          <label className="mt-4">Meet and Greet Time (local)</label>  
                  
          <TimePicker
            id="meetAndGreet"
            format="hh:mm aa"
            showMeridiem={true}
            hideMinutes={minute => minute % 15 !== 0}
            onChange={onMeetAndGreetChange}
            value={meetAndGreetTime}
            cleanable
            onClean={onCleanMeetAndGreet}
          />
                  

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
      <Row>
        <Col className="form-group">
          <label className="mt-4">External Ticket/Website Link</label>
          <Form.Control as="textarea"
            rows={3}
            id="externalUrl"
            onChange={(e) => setExternalUrl(e.currentTarget.value)}
            value={externalUrl}
            placeholder='External Ticket/Website Link (regular tickets)'
          />
        </Col>
      </Row>
      <Row>
        <Col className="form-group">
          <label className="mt-4">External VIP/Website Link</label>
          <Form.Control as="textarea"
            rows={3}
            id="externalVipLink"
            onChange={(e) => setExternalVipLink(e.currentTarget.value)}
            value={externalVipLink}
            placeholder='External VIP/Website Link (VIP tickets)'
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
      <Row>
        <Col className="form-group">
          <label className="mt-4">
            <span className="danger">NOTE:</span> The following settings will only have an effect if this is an external event without a matching event in TicketSocket.
            <br />
            <br />
          </label>
        </Col>
      </Row>
      <Row>
        <Col>
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
            checked={isCancelled}
            onChange={(e) => setIsCancelled(e.target.checked)}
            label="Is Cancelled?"
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
          <Button disabled={!currentAdminSelection?.mustSaveEvent && isUploading} onClick={onSubmit}>Submit</Button>{' '}
          <Button onClick={confirmGoBack}>Back</Button>
        </Col>
      </Row>
    </Col>
  );
}

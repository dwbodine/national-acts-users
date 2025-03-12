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
import { VipEvent } from '@/types/event';
import {
  setAdminEvent,
  setReloadEvents,
  setMustSaveEvent,
  setVenues,
} from '@/lib/adminSelectionSlice';
import { DatePicker, SelectPicker, TimePicker } from 'rsuite';
import { useGetAllVenues } from '@/hooks/admin/useGetAllVenues';
import { useUpdateExternalEvent } from '@/hooks/admin/useUpdateExternalEvent';
import { ModifyExternalEventResponse } from '@/types/admin';
import { ItemDataType } from 'rsuite/esm/internals/types';
import AdminFileUpload from '../common/adminFileUploadComponent';

export default function AdminExternalEventEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const dispatch = useDispatch();
  const { getExternalVenueLocation } = useGetLocation();
  const { updateExternalEvent } = useUpdateExternalEvent();
  const { getAllVenues } = useGetAllVenues();
  const [isUploading, setIsUploading] = useState(false);
  const [isThumbnailDirty, setIsThumbnailDirty] = useState(false);
  const thumbNailBaseUrl = `${process.env.NEXT_PUBLIC_WWW_URL}/common/thumbnails`;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.venues == undefined) {
        getAllVenues()
          .then((response) => {
            if (response.venues && !response.venueError) {
              dispatch(
                setVenues(response.venues)
              );
            }
          })
      }
    }, 300);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentAdminSelection, dispatch, getAllVenues]);

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
    currentEvent.disableLinkReason = reason;
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
    currentEvent.disableVipLinkReason = reason;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setExternalVipLink = (url: string) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.externalVipLink = url;
    dispatch(setAdminEvent(currentEvent));
    markDirty();
  };

  const setExternalUrl = (url: string) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedEvent) {
      return;
    }
    let currentEvent: VipEvent = { ...currentAdminSelection.selectedEvent };
    currentEvent.externalUrl = url;
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
    dispatch(setIsLoading(true));

    let eventToUpdate: VipEvent = { ...currentAdminSelection.selectedEvent };
    updateExternalEvent(currentAdminSelection.sellerId, eventToUpdate).then((response: ModifyExternalEventResponse) => {
      if (response.success) {
        toast.success('Event updated successfully');
        dispatch(setReloadEvents(true));
        dispatch(setAdminEvent(undefined));
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

  const pageHeader = 'Edit external event';

  const eventTitle =
    currentAdminSelection.selectedEvent != undefined
      ? currentAdminSelection.selectedEvent.title
      : '';

  const eventDate =
    currentAdminSelection.selectedEvent?.eventDate != undefined
      ? moment(currentAdminSelection.selectedEvent.eventDate).toDate()
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

  const thumbnail = currentAdminSelection?.selectedEvent?.externalThumbnail ?? undefined;
  const externalEventVenueId = currentAdminSelection?.selectedEvent?.externalEventVenueId ?? 0;

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
            disabled={eventDate != null}
          />

          <label className="mt-4">Event venue</label>
          <SelectPicker value={externalEventVenueId} data={venueList} size="lg" block />

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
            placeholder="event title"
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
            placeholder="event title"
            type="text"
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

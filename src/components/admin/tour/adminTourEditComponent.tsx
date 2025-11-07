'use client';

import { Button, Checkbox } from 'rsuite';
import { CheckPicker, DatePicker, PickerHandle, TimePicker } from 'rsuite';
import { GetEventsResponse, ModifyTourResponse } from '@/types/responses';
import React, { ReactNode, useEffect } from 'react';
import { Tour, VipEvent } from '@/types/event';
import { setAdminEvents, setAdminTour, setReloadTours } from '@/lib/adminSelectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ItemDataType } from 'rsuite/esm/internals/types';
import { RootState } from '@/lib/store';
import moment from 'moment';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';
import { useGetAdminSellerEvents } from '@/hooks/admin/useGetAdminSellerEvents';
import { useRouter } from 'next/navigation';
import { useUpdateTour } from '@/hooks/admin/useUpdateTour';

export default function AdminTourEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const globalSelection = useSelector((state: RootState) => state.globalSelection);
  const dispatch = useDispatch();
  const { getAdminSellerEvents } = useGetAdminSellerEvents();
  const { updateTour } = useUpdateTour();
  const sellerRef = React.createRef<PickerHandle>();
  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        currentAdminSelection.selectedTour === undefined ||
        currentAdminSelection.sellerId === undefined
      ) {
        router.push('/admin/tour');
      }
    }, 200);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentAdminSelection, globalSelection.isLoading, router]);

  const goBack = () => {
    dispatch(setAdminTour(undefined));
    dispatch(setReloadTours(true));
    router.push('/admin/tour');
  };

  const setTourName = (tourName: string) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedTour) {
      return;
    }
    const currentTour = { ...currentAdminSelection.selectedTour };
    currentTour.tourName = tourName;
    dispatch(setAdminTour(currentTour));
  };

  const closeSellers = () => {
    const handle = sellerRef?.current;
    if (handle && handle.close) {
      handle.close();
    }
  };

  const onSellerChange = (sellerIds: number[]) => {
    if (
      !currentAdminSelection ||
      !currentAdminSelection.allSellers ||
      !currentAdminSelection.selectedTour ||
      !sellerIds ||
      sellerIds.length === 0
    ) {
      return;
    }

    dispatch(setIsLoading(true));
    closeSellers();

    const selectedTour = { ...currentAdminSelection.selectedTour };
    selectedTour.sellers = [];
    selectedTour.events = [];
    sellerIds.forEach((sellerId) => {
      const seller = currentAdminSelection.allSellers?.find(
        (x) => x.sellerId === sellerId,
      );
      if (seller && selectedTour.sellers) {
        selectedTour.sellers.push(seller);
      }
    });
    dispatch(setAdminTour(selectedTour));

    // Update available event list
    void getAdminSellerEvents(sellerIds).then((response: GetEventsResponse) => {
      if (!response.error && response.events) {
        const adminEvents = response.events.filter((x) => !x.isDeleted);
        if (adminEvents && adminEvents.length > 0) {
          adminEvents.sort((a, b) =>
            moment(a.eventDate).valueOf() < moment(b.eventDate).valueOf()
              ? -1
              : moment(a.eventDate).valueOf() > moment(b.eventDate).valueOf()
                ? 1
                : 0,
          );
        }
        dispatch(setAdminEvents(adminEvents));
        dispatch(setIsLoading(false));
      }
    });
  };

  const onSellerClean = () => {
    if (!currentAdminSelection || !currentAdminSelection.selectedTour) {
      return;
    }

    const selectedTour = { ...currentAdminSelection.selectedTour };
    selectedTour.events = [];
    if (selectedTour.sellers && currentAdminSelection.sellerId) {
      selectedTour.sellers = selectedTour.sellers.filter(
        (x) => x.sellerId !== currentAdminSelection.sellerId,
      );
    } else if (currentAdminSelection.sellerId) {
      const seller = currentAdminSelection.allSellers?.find(
        (x) => x.sellerId === currentAdminSelection.sellerId,
      );
      selectedTour.sellers = seller ? [seller] : [];
    } else {
      selectedTour.sellers = [];
    }

    dispatch(setAdminTour(selectedTour));
    closeSellers();
  };

  const onEventChange = (eventIds: number[]) => {
    if (
      !currentAdminSelection ||
      !currentAdminSelection.events ||
      !currentAdminSelection.selectedTour ||
      !eventIds ||
      eventIds.length === 0
    ) {
      return;
    }

    const selectedTour = { ...currentAdminSelection.selectedTour };
    const selectedEvents: VipEvent[] = [];
    eventIds.forEach((eventId) => {
      const evt = currentAdminSelection.events?.find(
        (x) => x.externalEventId === eventId,
      );
      if (evt) {
        selectedEvents.push(evt);
      }
    });
    if (selectedEvents.length > 0) {
      selectedEvents.sort((a, b) =>
        moment(a.eventDate).valueOf() < moment(b.eventDate).valueOf()
          ? -1
          : moment(a.eventDate).valueOf() > moment(b.eventDate).valueOf()
            ? 1
            : 0,
      );

      const firstEvent = moment(selectedEvents[0]?.eventDate);
      if (
        firstEvent &&
        (!selectedTour.announceDate ||
          moment(selectedTour.announceDate).valueOf() >= firstEvent.valueOf())
      ) {
        selectedTour.announceDate = firstEvent
          .subtract('days', 1)
          .format('YYYY-MM-DD HH:mm');
      }
    }
    selectedTour.events = selectedEvents;

    dispatch(setAdminTour(selectedTour));
  };

  const onEventClean = () => {
    if (!currentAdminSelection || !currentAdminSelection.selectedTour) {
      return;
    }

    const selectedTour = { ...currentAdminSelection.selectedTour };
    selectedTour.events = [];
    dispatch(setAdminTour(selectedTour));
  };

  const sellerNames = () => {
    let sNames = '';
    currentAdminSelection.selectedTour?.sellers?.forEach((seller) => {
      if (sNames !== '') {
        sNames += ' / ';
      }
      sNames += seller.name;
    });
    return sNames;
  };

  const onSubmit = () => {
    if (!currentAdminSelection.selectedTour) {
      return;
    }

    if (!currentAdminSelection.selectedTour.tourName) {
      toast.error('Must provide a name for the tour');
      return;
    }

    if (
      !currentAdminSelection.selectedTour.sellers ||
      currentAdminSelection.selectedTour.sellers.length === 0
    ) {
      toast.error('Must select at least one seller');
      return;
    }

    if (
      !currentAdminSelection.selectedTour.events ||
      currentAdminSelection.selectedTour.events.length === 0
    ) {
      toast.error('Must select at least one event');
      return;
    }

    if (!currentAdminSelection.selectedTour.announceDate) {
      toast.error('Announce date cannot be empty');
      return;
    }

    const [firstEvent] = currentAdminSelection.selectedTour.events;
    if (
      firstEvent &&
      moment(currentAdminSelection.selectedTour.announceDate).valueOf() >=
        moment(firstEvent.eventDate).valueOf()
    ) {
      toast.error('Announce date must be before the first selected event date');
      return;
    }

    dispatch(setIsLoading(true));
    const tourToUpdate: Tour = { ...currentAdminSelection.selectedTour };
    void updateTour(tourToUpdate).then((response: ModifyTourResponse) => {
      if (response.success) {
        dispatch(setReloadTours(true));
        toast.success('Save tour succeeded');
        router.push('/admin/tour');
      } else {
        toast.error(response.error ?? 'Error occurred while saving tour');
      }
      dispatch(setIsLoading(false));
    });
  };

  const renderSellerItem = (label: ReactNode) => <span>{label}</span>;

  const renderEventItem = (label: ReactNode, item: ItemDataType<string | number>) => {
    if (!item.value) {
      return <></>;
    }
    let eventId: number = 0;
    if (typeof item.value === 'number') {
      eventId = item.value;
    } else {
      eventId = parseInt(item.value);
    }
    const evt = currentAdminSelection.events?.find((x) => x.externalEventId === eventId);
    return evt ? (
      <span>
        {moment(evt.eventDate).format('M/D/YYYY')} - {label}
      </span>
    ) : (
      <></>
    );
  };

  const onAnnounceDateChange = (date: Date | null) => {
    if (!date || !currentAdminSelection || !currentAdminSelection.selectedTour) {
      return;
    }

    let announceDate = moment(date).startOf('day');
    announceDate = announceDate.hours(0);
    announceDate = announceDate.minutes(0);
    announceDate = announceDate.seconds(0);
    const currentTour = { ...currentAdminSelection.selectedTour };
    currentTour.announceDate = announceDate.format('YYYY-MM-DD HH:mm:ss');
    dispatch(setAdminTour(currentTour));
  };

  const onAnnounceTimeChange = (date: Date | null) => {
    if (!date || !currentAdminSelection || !currentAdminSelection.selectedTour) {
      return;
    }

    const announceTime = moment(date);
    const currentTour = { ...currentAdminSelection.selectedTour };
    let announceDate = moment(currentTour.announceDate);
    announceDate = announceDate.hours(announceTime.hours());
    announceDate = announceDate.minutes(announceTime.minutes());
    announceDate = announceDate.seconds(0);
    currentTour.announceDate = announceDate.format('YYYY-MM-DD HH:mm:ss');
    dispatch(setAdminTour(currentTour));
  };

  const onCleanAnnounceDate = () => {
    if (!currentAdminSelection || !currentAdminSelection.selectedTour) {
      return;
    }
    const currentTour = { ...currentAdminSelection.selectedTour };
    currentTour.announceDate = '';
    dispatch(setAdminTour(currentTour));
  };

  const onCleanAnnounceTime = () => {
    if (!currentAdminSelection || !currentAdminSelection.selectedTour) {
      return;
    }
    const currentTour = { ...currentAdminSelection.selectedTour };
    if (currentTour.announceDate) {
      let announceDate = moment(currentTour.announceDate);
      announceDate = announceDate.hours(0);
      announceDate = announceDate.minutes(0);
      announceDate = announceDate.seconds(0);
      currentTour.announceDate = announceDate.format('YYYY-MM-DD HH:mm:ss');
    }
    dispatch(setAdminTour(currentTour));
  };

  const setIsActive = (isActive: boolean) => {
    if (!currentAdminSelection || !currentAdminSelection.selectedTour) {
      return;
    }
    const currentTour = { ...currentAdminSelection.selectedTour };
    currentTour.isActive = isActive;
    dispatch(setAdminTour(currentTour));
  };

  let pageHeader =
    (currentAdminSelection.selectedTour?.tourId ?? 0) > 0 ? 'Edit tour' : 'Add tour';

  const sNames = sellerNames();
  if (sNames) {
    pageHeader += ` for ${sNames}`;
  }

  const sellerList: ItemDataType<number>[] =
    currentAdminSelection.allSellers && currentAdminSelection.allSellers.length > 0
      ? currentAdminSelection.allSellers?.map((seller) => ({
          label: `${seller.name}`,
          value: seller.sellerId,
        }))
      : [];

  const selectedSellers =
    currentAdminSelection.selectedTour?.sellers &&
    currentAdminSelection.selectedTour?.sellers.length > 0
      ? currentAdminSelection.selectedTour.sellers.map((seller) => seller.sellerId)
      : [];

  const disabledSellers = currentAdminSelection.sellerId
    ? [currentAdminSelection.sellerId]
    : [];

  const eventList: ItemDataType<number>[] =
    currentAdminSelection.events && currentAdminSelection.events.length > 0
      ? currentAdminSelection.events?.map((evt) => ({
          label: `${evt.title}`,
          value: evt.externalEventId,
        }))
      : [];

  let selectedEvents: number[] = [];
  if (
    currentAdminSelection.selectedTour?.events &&
    currentAdminSelection.selectedTour?.events.length > 0
  ) {
    selectedEvents = currentAdminSelection.selectedTour.events.map(
      (evt) => evt.externalEventId,
    );
  }

  const announceDate =
    currentAdminSelection.selectedTour !== undefined &&
    currentAdminSelection.selectedTour.announceDate !== null
      ? moment(currentAdminSelection.selectedTour.announceDate).toDate()
      : null;

  const announceTimeDisabled = !announceDate;

  const tourName = currentAdminSelection?.selectedTour?.tourName ?? '';
  const isActive = currentAdminSelection?.selectedTour?.isActive ?? false;

  return (
    <div className="admin-container">
      <h1>{pageHeader}</h1>
      <div className="form-group">
        <label className="mt-4">Tour Name</label>
        <input
          value={tourName ?? ''}
          onChange={(e) => setTourName(e.target.value)}
          className="form-control"
          placeholder="tour name"
          type="text"
        />
      </div>
      <div className="form-group">
        <label className="mt-4">Sellers</label>
        <CheckPicker
          sticky={true}
          countable={false}
          data={sellerList}
          renderMenuItem={renderSellerItem}
          value={selectedSellers}
          disabledItemValues={disabledSellers}
          style={{ width: 500 }}
          onChange={onSellerChange}
          onClean={onSellerClean}
          ref={sellerRef}
        />
      </div>
      <div className="form-group">
        <label className="mt-4">Events</label>
        <CheckPicker
          data={eventList}
          renderMenuItem={renderEventItem}
          value={selectedEvents}
          style={{ width: 500 }}
          onChange={onEventChange}
          onClean={onEventClean}
        />
      </div>
      <div className="form-group">
        <label className="mt-4">Announce Date (in Pacific Time):</label>
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
          disabled={announceTimeDisabled}
        />
      </div>
      <div>
        <Checkbox checked={isActive} onChange={(_, checked) => setIsActive(checked)}>
          Is Active?
        </Checkbox>
      </div>
      <Button onClick={onSubmit}>Submit</Button> <Button onClick={goBack}>Back</Button>
    </div>
  );
}

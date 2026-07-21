'use client';

import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Col, Row, SelectPicker } from 'rsuite';
import { ItemDataType } from 'rsuite/esm/internals/types';

import PageHeader from '@/components/common/PageHeaderComponent';
import { ImageType } from '@/constants';
import { useGetAdminSellerEvents } from '@/hooks/admin/useGetAdminSellerEvents';
import { useUpdateFanMoment } from '@/hooks/admin/useUpdateFanMoments';
import { useGetFanMoments } from '@/hooks/common/useGetFanMoments';
import { setReloadFanMoments, setSelectedFanMoment } from '@/lib/adminSelectionSlice';
import { RootState } from '@/lib/store';
import { VipEvent } from '@/types/event';
import { FanMomentFilter } from '@/types/props';
import { FanMoment } from '@/types/public';
import {
  GetEventsResponse,
  GetFanMomentsResponse,
  ModifyFanMomentResponse,
} from '@/types/responses';
import { getLocationInfoFromVenue } from '@/utils/eventUtils';
import { filterEventsWithoutFanMomentFolders } from '@/utils/fanMomentUtils';

import AdminMultiFileUpload from '../admin/common/adminMultiFileUploadComponent';
import ConfirmationDialog from '../common/confirmationDialogComponent';

export default function AdminFanMomentEdit() {
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const fanMoment = currentAdminSelection.selectedFanMoment;
  const router = useRouter();
  const dispatch = useDispatch();
  const { updateFanMoment } = useUpdateFanMoment();
  const { getAdminSellerEvents } = useGetAdminSellerEvents();
  const { getFanMoments } = useGetFanMoments();
  const [isDirty, setIsDirty] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [sellerEvents, setSellerEvents] = useState<VipEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [isNewFanMoment] = useState(() => fanMoment?.key.eventId === undefined);
  const sellerEventsRequestSellerId = useRef<number | undefined>(undefined);

  const goBack = () => {
    toast.dismiss();
    router.push('/fan-moments');
  };

  useEffect(() => {
    if (!fanMoment) {
      toast.dismiss();
      router.push('/fan-moments');
      return;
    }

    const sellerId = fanMoment.key.sellerId;
    if (!isNewFanMoment || !sellerId || sellerEventsRequestSellerId.current === sellerId) {
      return;
    }

    sellerEventsRequestSellerId.current = sellerId;
    setEventsLoading(true);
    const filter: FanMomentFilter = { sellerId };
    void Promise.all([getAdminSellerEvents([sellerId]), getFanMoments(filter)])
      .then(([eventsResponse, fanMomentsResponse]: [GetEventsResponse, GetFanMomentsResponse]) => {
        if (!eventsResponse.events || eventsResponse.error) {
          toast.error(eventsResponse.error ?? 'Error occurred while loading events');
        }

        if (fanMomentsResponse.error) {
          toast.error(fanMomentsResponse.error);
        }

        if (!eventsResponse.events || eventsResponse.error || fanMomentsResponse.error) {
          return;
        }

        const availableEvents = filterEventsWithoutFanMomentFolders(
          eventsResponse.events,
          fanMomentsResponse.fanMoments,
        );
        setSellerEvents(availableEvents);
      })
      .finally(() => {
        setEventsLoading(false);
      });
  }, [fanMoment, getAdminSellerEvents, getFanMoments, isNewFanMoment, router]);

  const markDirty = () => {
    setIsDirty(true);
  };

  const updateFanMomentLocal = (updatedFanMoment: FanMoment) => {
    dispatch(setSelectedFanMoment(updatedFanMoment));
    markDirty();
    void updateFanMoment(updatedFanMoment).then((response: ModifyFanMomentResponse) => {
      if (response.success) {
        dispatch(setReloadFanMoments(true));
        setIsDirty(false);
        toast.success('Fan moment saved successfully');
      } else {
        toast.error(response.error ?? 'Error occurred while saving fan moment');
      }
    });
  };

  const onFileUpload = (_fileUploadName: string, filenames: string[]) => {
    if (!fanMoment || !filenames.length) {
      return;
    }

    const images = fanMoment.images ?? [];
    const nextImages = [...images];

    filenames.forEach((filename) => {
      if (!nextImages.includes(filename)) {
        nextImages.push(filename);
      }
    });

    updateFanMomentLocal({
      ...fanMoment,
      images: nextImages,
    });
  };

  const onFileRemove = (filename: string) => {
    if (!fanMoment || !filename) {
      return;
    }

    updateFanMomentLocal({
      ...fanMoment,
      images: (fanMoment.images ?? []).filter((image) => image !== filename),
    });
  };

  const getFanMomentEventLocation = (event: VipEvent) => {
    return event.venue ? getLocationInfoFromVenue(event.venue) : '';
  };

  const setFanMomentEvent = (eventId: number | null) => {
    if (!fanMoment || !eventId) {
      return;
    }

    const selectedEvent = sellerEvents.find((event) => event.externalEventId === eventId);
    if (!selectedEvent) {
      return;
    }

    updateFanMomentLocal({
      ...fanMoment,
      key: {
        ...fanMoment.key,
        eventId: selectedEvent.externalEventId,
        eventLocation: getFanMomentEventLocation(selectedEvent),
        eventTitle: selectedEvent.title,
        momentDate: moment(selectedEvent.eventDate).format('YYYY-MM-DD'),
      },
    });
  };

  const onUploadStart = () => {
    setIsUploading(true);
  };

  const onUploadComplete = (filenames: string[] | undefined) => {
    setIsUploading(false);
    if (!filenames?.length) {
      toast.error('File upload failed!');
    }
  };

  const confirmGoBack = () => {
    if (!isDirty) {
      goBack();
      return;
    }

    const message =
      'You have made changes to this fan moment, are you sure you want to discard them and leave?';

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

  const momentDate = fanMoment?.key.momentDate
    ? moment(fanMoment.key.momentDate).format('MM/DD/YYYY')
    : '';
  const sellerId = fanMoment?.key.sellerId ?? currentReportSelection.seller?.sellerId;
  const sellerName =
    fanMoment?.key.sellerName ??
    currentAdminSelection.allSellers?.find((seller) => seller.sellerId === sellerId)?.name ??
    '';
  const pageHeader = fanMoment?.key.eventTitle
    ? `Edit Fan Moment - ${fanMoment.key.eventTitle}`
    : 'Edit Fan Moment';

  const eventList: ItemDataType<number>[] = sellerEvents
    .filter((event) => !moment(event.eventDate).isAfter(moment(), 'day'))
    .sort((a, b) => moment(b.eventDate).valueOf() - moment(a.eventDate).valueOf())
    .map((event) => {
      const venueName = event.venue?.name ? ` - ${event.venue.name}` : '';
      return {
        label: `${moment(event.eventDate).format('MM/DD/YYYY')} - ${event.title}${venueName}`,
        value: event.externalEventId,
      };
    });

  const subFolder =
    fanMoment?.key.momentDate && fanMoment?.key.eventId
      ? `${fanMoment.key.momentDate}/${fanMoment.key.eventId}`
      : undefined;

  return (
    <>
      <PageHeader pageTitle={pageHeader} />
      <Row className="admin-container">
        <Col xs={24}>
          <Row hidden={!sellerName}>
            <Col xs={24}>
              <div className="admin-setting-title">Seller</div>
              <div>{sellerName}</div>
            </Col>
          </Row>
          <Row hidden={isNewFanMoment || !momentDate}>
            <Col xs={24}>
              <div className="admin-setting-title">Date</div>
              <div>{momentDate}</div>
            </Col>
          </Row>
          <Row hidden={!isNewFanMoment}>
            <Col xs={24} md={12}>
              <div className="admin-setting-title">Event</div>
              <SelectPicker
                block
                cleanable={false}
                data={eventList}
                loading={eventsLoading}
                menuAutoWidth={true}
                onChange={(eventId) => setFanMomentEvent(eventId)}
                placeholder="Select an event"
                size="lg"
                value={fanMoment?.key.eventId}
              />
            </Col>
          </Row>
          <Row hidden={isNewFanMoment || !fanMoment?.key.eventLocation}>
            <Col xs={24}>
              <div className="admin-setting-title">Venue</div>
              <div>{fanMoment?.key.eventLocation}</div>
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <AdminMultiFileUpload
                ImageType={ImageType.FAN_MOMENTS}
                Title="Fan Moment Images"
                FileUploadName="FanMomentImages"
                DisplayAsGallery={true}
                CurrentFileNames={fanMoment?.images}
                CurrentFileTitle="Current fan moment images:"
                IsDirty={isDirty}
                OnUpload={onFileUpload}
                OnUploadStart={onUploadStart}
                OnUploadComplete={onUploadComplete}
                ShowRemoveButton={true}
                OnFileRemove={onFileRemove}
                SubfolderName={subFolder}
                Disabled={eventsLoading || !fanMoment?.key.eventId}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Button disabled={isUploading || eventsLoading} onClick={confirmGoBack}>
                Back
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

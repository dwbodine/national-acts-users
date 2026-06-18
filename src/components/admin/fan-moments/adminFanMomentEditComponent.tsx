'use client';

import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Col, Row } from 'rsuite';

import PageHeader from '@/components/common/PageHeaderComponent';
import { ImageType } from '@/constants';
import { useAddFanMoments } from '@/hooks/admin/useAddFanMoments';
import { setReloadFanMoments, setSelectedFanMoment } from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { FanMoment } from '@/types/public';
import { ModifyFanMomentResponse } from '@/types/responses';

import ConfirmationDialog from '../../common/confirmationDialogComponent';
import AdminMultiFileUpload from '../common/adminMultiFileUploadComponent';

export default function AdminFanMomentEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const fanMoment = currentAdminSelection.selectedFanMoment;
  const router = useRouter();
  const dispatch = useDispatch();
  const { addFanMoments } = useAddFanMoments();
  const [isDirty, setIsDirty] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const goBack = () => {
    toast.dismiss();
    router.push('/admin/fan-moments');
  };

  useEffect(() => {
    if (!fanMoment) {
      toast.dismiss();
      router.push('/admin/fan-moments');
    }
  }, [fanMoment, router]);

  const markDirty = () => {
    setIsDirty(true);
  };

  const updateFanMoment = (updatedFanMoment: FanMoment) => {
    dispatch(setSelectedFanMoment(updatedFanMoment));
    markDirty();
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

    updateFanMoment({
      ...fanMoment,
      images: nextImages,
    });
  };

  const onFileRemove = (filename: string) => {
    if (!fanMoment || !filename) {
      return;
    }

    updateFanMoment({
      ...fanMoment,
      images: (fanMoment.images ?? []).filter((image) => image !== filename),
    });
  };

  const onUploadStart = () => {
    setIsUploading(true);
  };

  const onUploadComplete = (filenames: string[] | undefined) => {
    setIsUploading(false);
    if (filenames?.length) {
      toast.success('Files uploaded successfully - click submit to save');
    } else {
      toast.error('File upload failed!');
    }
  };

  const onSubmit = () => {
    if (!fanMoment) {
      return;
    }

    dispatch(setIsLoading(true));

    void addFanMoments(fanMoment).then((response: ModifyFanMomentResponse) => {
      if (response.success) {
        dispatch(setReloadFanMoments(true));
        dispatch(setSelectedFanMoment(response.updatedFanMoment ?? fanMoment));
        setIsDirty(false);
        toast.success('Fan moment saved successfully');
        router.push('/admin/fan-moments');
      } else {
        toast.error(response.error ?? 'Error occurred while saving fan moment');
      }
      dispatch(setIsLoading(false));
    });
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
  const pageHeader = fanMoment?.key.eventTitle
    ? `Edit Fan Moment - ${fanMoment.key.eventTitle}`
    : 'Edit Fan Moment';

  const subFolder =
    fanMoment?.key.momentDate && fanMoment?.key.eventId
      ? `${fanMoment.key.momentDate}/${fanMoment.key.eventId}`
      : undefined;

  return (
    <>
      <PageHeader pageTitle={pageHeader} />
      <Row className="admin-container">
        <Col xs={24}>
          <Row hidden={!momentDate}>
            <Col xs={24}>
              <div className="admin-setting-title">Date</div>
              <div>{momentDate}</div>
            </Col>
          </Row>
          <Row hidden={!fanMoment?.key.eventLocation}>
            <Col xs={24}>
              <div className="admin-setting-title">Location</div>
              <div>{fanMoment?.key.eventLocation}</div>
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <AdminMultiFileUpload
                ImageType={ImageType.FAN_MOMENTS}
                Title="Fan Moment Images"
                FileUploadName="FanMomentImages"
                CurrentFileNames={fanMoment?.images}
                CurrentFileTitle="Current fan moment images:"
                IsDirty={isDirty}
                OnUpload={onFileUpload}
                OnUploadStart={onUploadStart}
                OnUploadComplete={onUploadComplete}
                ShowRemoveButton={true}
                OnFileRemove={onFileRemove}
                SubfolderName={subFolder}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Button onClick={onSubmit} disabled={isUploading || !fanMoment}>
                Submit
              </Button>{' '}
              <Button onClick={confirmGoBack}>Back</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

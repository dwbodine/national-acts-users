'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Col, Row, SelectPicker } from 'rsuite';
import { ItemDataType } from 'rsuite/esm/internals/types';

import PageHeader from '@/components/common/PageHeaderComponent';
import { ImageType } from '@/constants';
import { useGetAllPageSellers } from '@/hooks/admin/useGetAllPageSellers';
import { useUpdateFeaturedArtist } from '@/hooks/admin/useUpdateFeaturedArtist';
import { setFeaturedArtists } from '@/lib/adminDataSelectionSlice';
import {
  setAllPageSellers,
  setMustSaveFeaturedArtist,
  setReloadFeaturedArtists,
  setSelectedFeaturedArtist,
} from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { FeaturedArtist, PageSeller } from '@/types/public';
import { ModifyFeaturedArtistResponse } from '@/types/responses';

import ConfirmationDialog from '../../common/confirmationDialogComponent';
import AdminFileUpload from '../common/adminFileUploadComponent';

export default function AdminFeaturedArtistsEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const currentAdminDataSelection = useSelector((state: RootState) => state.adminDataSelection);
  const dispatch = useDispatch();
  const { updateFeaturedArtist } = useUpdateFeaturedArtist();
  const { getAllPageSellers } = useGetAllPageSellers();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isBackgroundDirty, setIsBackgroundDirty] = useState(false);

  const goBack = useCallback(() => {
    toast.dismiss();
    router.push('/admin/featured-artists');
  }, [router]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.allPageSellers === undefined) {
        dispatch(setIsLoading(true));
        void getAllPageSellers().then((response) => {
          dispatch(setAllPageSellers(response.pageSellers));
        });
        dispatch(setIsLoading(false));
      } else if (
        currentAdminDataSelection.featuredArtists === undefined ||
        currentAdminSelection.selectedFeaturedArtist === undefined
      ) {
        goBack();
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentAdminSelection, dispatch, getAllPageSellers, goBack, isUploading]);

  const confirmGoBack = () => {
    if (!currentAdminSelection?.mustSaveFeaturedArtist) {
      goBack();
      return;
    }

    const message: string =
      'You have made changes to this featured artist, are you sure you want to discard them and leave?';
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

  const markDirty = () => {
    dispatch(setMustSaveFeaturedArtist(true));
  };

  const setPageSeller = (pageSellerId: number | null) => {
    if (!currentAdminSelection.selectedFeaturedArtist || !pageSellerId) {
      return;
    }
    const faToUpdate: FeaturedArtist = { ...currentAdminSelection.selectedFeaturedArtist };
    if (faToUpdate.pageSellerId !== pageSellerId) {
      faToUpdate.pageSellerId = pageSellerId;
      dispatch(setSelectedFeaturedArtist(faToUpdate));
      markDirty();
    }
  };

  const onFileUpload = (fileUploadName: string, filename: string) => {
    if (!currentAdminSelection.selectedFeaturedArtist || !fileUploadName || !filename) {
      return;
    }
    const faToUpdate = { ...currentAdminSelection.selectedFeaturedArtist };
    let isDirty = false;
    switch (fileUploadName) {
      case 'Background':
        faToUpdate.backgroundImage = filename;
        setIsBackgroundDirty(true);
        isDirty = true;
        break;
      default:
        break;
    }
    if (isDirty) {
      dispatch(setSelectedFeaturedArtist(faToUpdate));
      markDirty();
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

  const onFileRemove = (fileUploadName: string) => {
    if (!currentAdminSelection.selectedFeaturedArtist || !fileUploadName) {
      return;
    }
    const faToUpdate = { ...currentAdminSelection.selectedFeaturedArtist };
    switch (fileUploadName) {
      case 'Background':
        faToUpdate.backgroundImage = undefined;
        dispatch(setSelectedFeaturedArtist(faToUpdate));
        setIsBackgroundDirty(true);
        markDirty();
        break;
      default:
        break;
    }
  };

  const onSubmit = () => {
    if (!currentAdminSelection.selectedFeaturedArtist) {
      return;
    }

    const faToUpdate: FeaturedArtist = {
      ...currentAdminSelection.selectedFeaturedArtist,
    };

    if (!faToUpdate.pageSellerId) {
      toast.error('Must select a featured artist');
      return;
    }

    if (!faToUpdate.backgroundImage) {
      toast.error('Must upload a background image');
      return;
    }

    dispatch(setIsLoading(true));

    void updateFeaturedArtist(faToUpdate).then((response: ModifyFeaturedArtistResponse) => {
      if (response.success) {
        dispatch(setReloadFeaturedArtists(true));
        dispatch(setFeaturedArtists(undefined));
        toast.success('Featured artist save succeeded');
        router.push('/admin/featured-artists');
      } else {
        toast.error(response.error ?? 'Error occurred while saving featured artist');
      }
      dispatch(setIsLoading(false));
    });
  };

  const pageSellerOptions: ItemDataType<number>[] = currentAdminSelection?.allPageSellers
    ? currentAdminSelection.allPageSellers.map((pageSeller: PageSeller) => ({
        label: `${pageSeller.sellerName ?? ''}`,
        value: pageSeller.pageSellerId,
      }))
    : [];

  const pageHeader = 'Edit Featured Artist';

  const pageSellerId = currentAdminSelection.selectedFeaturedArtist?.pageSellerId ?? 0;
  const backgroundImage = currentAdminSelection.selectedFeaturedArtist?.backgroundImage ?? '';

  return (
    <>
      <PageHeader pageTitle={pageHeader} />
      <Row className="admin-container">
        <Col xs={24}>
          <Row>
            <Col xs={24} md={12}>
              <span>Seller</span>
              <br />
              <SelectPicker
                block
                value={pageSellerId}
                data={pageSellerOptions}
                size="lg"
                onChange={(psId) => setPageSeller(psId)}
                cleanable={false}
                menuAutoWidth={true}
                searchable={false}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <AdminFileUpload
                ImageType={ImageType.FEATURED_ARTISTS}
                Title="Featured Artist Background (rectangle, must be a PNG or JPG roughly 199 x 260 px)"
                FileUploadName="Background"
                OnUpload={onFileUpload}
                CurrentFileName={backgroundImage}
                IsDirty={isBackgroundDirty}
                CurrentFileTitle={'View Current Background Image'}
                OnUploadStart={onUploadStart}
                OnUploadComplete={onUploadComplete}
                ShowRemoveButton={true}
                OnFileRemove={() => onFileRemove('Background')}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Button onClick={onSubmit} disabled={isUploading}>
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

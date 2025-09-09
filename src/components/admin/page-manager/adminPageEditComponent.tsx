"use client";

import { Button, Col, Form, FormCheck, Row } from 'react-bootstrap';
import { DatePicker, SelectPicker } from 'rsuite';
import { GetPageTypesResponse, GetSellersResponse, ModifyPageResponse } from '@/types/responses';
import { Page, PageSeller } from '@/types/public';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { setAllSellers, setMustSavePage, setPageTypes, setReloadPages, setSelectedPage } from '@/lib/adminSelectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import AdminFileUpload from '../common/adminFileUploadComponent';
import AdminSellerSelect from '../common/adminSellerSelectComponent';
import ConfirmationDialog from '../../common/confirmationDialogComponent';
import { FaPlus } from 'react-icons/fa';
import { ItemDataType } from 'rsuite/esm/internals/types';
import { RootState } from '@/lib/store';
import { SellerType } from '@/types/event';
import moment from 'moment';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { toast } from 'react-toastify';
import { useGetPageTypes } from '@/hooks/common/useGetPageTypes';
import { useGetSellers } from '@/hooks/common/useGetSellers';
import { useRouter } from 'next/navigation';
import { useUpdatePage } from '@/hooks/admin/useUpdatePage';

export default function AdminPageEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const route = currentAdminSelection.selectedPage?.route;
  const router = useRouter();
  const dispatch = useDispatch();
  const { updatePage } = useUpdatePage();
  const { getPageTypes } = useGetPageTypes();
  const { getSellers } = useGetSellers();
  const pageSellerTypeIds: number[] = [7, 14, 15, 16, 17, 18, 19];

  const [isUploading, setIsUploading] = useState(false);

  const headerBaseUrl = `${process.env.NEXT_PUBLIC_WWW_URL}/common/headers`;
  const [isHeaderDirty, setIsHeaderDirty] = useState(false);

  const iconBaseUrl = `${process.env.NEXT_PUBLIC_WWW_URL}/common/thumbnails`;
  const [isIconDirty, setIsIconDirty] = useState(false);

  const linkPreviewBaseUrl = `${process.env.NEXT_PUBLIC_WWW_URL}/common/preview`;
  const [isLinkPreviewDirty, setIsLinkPreviewDirty] = useState(false);

  const [isLogoDirty, setIsLogoDirty] = useState(false);
  const logoBaseUrl = `${process.env.NEXT_PUBLIC_WWW_URL}/common/logos`;

  const goBack = useCallback(() => {
    toast.dismiss();
    router.push('/admin/page-manager/');
  }, [router]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.allSellers === undefined) {
        dispatch(setIsLoading(true));
        getSellers().then((response: GetSellersResponse) => {
          dispatch(setAllSellers(response.sellers));
        });
      } else if (currentAdminSelection.pageTypes === undefined) {
        dispatch(setIsLoading(true));
        getPageTypes().then((response: GetPageTypesResponse) => {
          if (!response.error && response.pageTypes) {
            dispatch(setPageTypes(response.pageTypes));
          }
          dispatch(setIsLoading(false));
        });
      } else if (currentAdminSelection.allPages === undefined || currentAdminSelection.selectedPage === undefined) {
        goBack();
      }
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentAdminSelection, dispatch, getPageTypes, getSellers, goBack]);

  const confirmGoBack = () => {
    if (!currentAdminSelection?.mustSavePage) {
      goBack();
      return;
    }

    const message: string =
      'You have made changes to this page, are you sure you want to discard them and leave?';
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
    dispatch(setMustSavePage(true));
  };

  const setPageRoute = (rte: string) => {
    if (!currentAdminSelection.selectedPage || !rte) {
      return;
    }
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    if (pageToUpdate.route !== rte) {
      pageToUpdate.route = rte;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  }

  const setPageTitle = (title: string) => {
    if (!currentAdminSelection.selectedPage || !title) {
      return;
    }
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    if (pageToUpdate.title !== title) {
      pageToUpdate.title = title;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  }

  const setPageType = (pageTypeId: number | null) => {
    if (!currentAdminSelection.selectedPage || !currentAdminSelection.pageTypes
      || currentAdminSelection.pageTypes.length === 0 || !pageTypeId || isNaN(pageTypeId)) {
      return;
    }
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    if (pageToUpdate.pageType.pageTypeId !== pageTypeId) {
      const pageType = currentAdminSelection.pageTypes.find(x => x.pageTypeId === pageTypeId);
      if (pageType) {
        pageToUpdate.pageType = pageType;
        dispatch(setSelectedPage(pageToUpdate));
        markDirty();
      }
    }
  }

  const setSubTitle1 = (title: string) => {
    if (!currentAdminSelection.selectedPage || !title) {
      return;
    }
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    if (pageToUpdate.subtitle1 !== title) {
      pageToUpdate.subtitle1 = title;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  }

  const setSubTitle2 = (title: string) => {
    if (!currentAdminSelection.selectedPage || !title) {
      return;
    }
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    if (pageToUpdate.subtitle2 !== title) {
      pageToUpdate.subtitle2 = title;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  }

  const cleanHtmlText = (html: string) => {
    let htmlText: string = html;
    htmlText = htmlText.replace(/<!DOCTYPE[^>[]*(\[[^]]*\])?>/gi, '');
    htmlText = htmlText.replace(/<html.*?>/gi, '');
    htmlText = htmlText.replace(/<head.*?>/gi, '');
    htmlText = htmlText.replace(/<meta.*?\/>/gi, '');
    htmlText = htmlText.replace(/<meta.*?>/gi, '');
    htmlText = htmlText.replace(/<title.*?<\/title>/gi, '');
    htmlText = htmlText.replace(/<\/head.*?>/gi, '');
    htmlText = htmlText.replace(/<body.*?>/gi, '');
    htmlText = htmlText.replace(/<\/body.*?>/gi, '');
    htmlText = htmlText.replace(/<\/html.*?>/gi, '');
    htmlText = htmlText.replace(/\\n\\n\\n/gi, '\\n');
    htmlText = htmlText.replace(/\\n\\n/gi, '\\n');
    htmlText = htmlText.trim();
    return htmlText;
  }

  const setHtmlText = (html: string) => {
    if (!currentAdminSelection.selectedPage || !route) {
      return;
    }
    let htmlText: string = html;
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    htmlText = cleanHtmlText(htmlText);
    if (pageToUpdate.htmlText !== htmlText) {
      pageToUpdate.htmlText = htmlText;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  }

  const setGoogleAnalyticsId = (gaId: string) => {
    if (!currentAdminSelection.selectedPage || !route) {
      return;
    }
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    if (pageToUpdate.googleAnalyticsId !== gaId) {
      pageToUpdate.googleAnalyticsId = gaId;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  }

  const setIsActive = (isActive: boolean) => {
    if (!currentAdminSelection.selectedPage) {
      return;
    }
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    if (pageToUpdate.isActive !== isActive) {
      pageToUpdate.isActive = isActive;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  }

  const setUseIncludeDates = (useIncludeDates: boolean) => {
    if (!currentAdminSelection.selectedPage) {
      return;
    }
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    if (pageToUpdate.useIncludeDates !== useIncludeDates) {
      pageToUpdate.useIncludeDates = useIncludeDates;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  }

  const setIncludeStart = (includeStart: Date | null) => {
    if (!currentAdminSelection.selectedPage) {
      return;
    }
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    const includeStartStr = moment(includeStart).format('YYYY-MM-DD HH:mm:ss');
    if (pageToUpdate.includeStart !== includeStartStr) {
      pageToUpdate.includeStart = includeStartStr;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  }

  const setIncludeEnd = (includeEnd: Date | null) => {
    if (!currentAdminSelection.selectedPage) {
      return;
    }
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    const includeEndStr = moment(includeEnd).format('YYYY-MM-DD HH:mm:ss');
    if (pageToUpdate.includeEnd !== includeEndStr) {
      pageToUpdate.includeEnd = includeEndStr;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  }

  const setUseExcludeDates = (useExcludeDates: boolean) => {
    if (!currentAdminSelection.selectedPage) {
      return;
    }
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    if (pageToUpdate.useExcludeDates !== useExcludeDates) {
      pageToUpdate.useExcludeDates = useExcludeDates;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  }

  const setExcludeStart = (excludeStart: Date | null) => {
    if (!currentAdminSelection.selectedPage) {
      return;
    }
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    const excludeStartStr = moment(excludeStart).format('YYYY-MM-DD HH:mm:ss');
    if (pageToUpdate.excludeStart !== excludeStartStr) {
      pageToUpdate.excludeStart = excludeStartStr;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  }

  const setExcludeEnd = (excludeEnd: Date | null) => {
    if (!currentAdminSelection.selectedPage) {
      return;
    }
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    const excludeEndStr = moment(excludeEnd).format('YYYY-MM-DD HH:mm:ss');
    if (pageToUpdate.excludeEnd !== excludeEndStr) {
      pageToUpdate.excludeEnd = excludeEndStr;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  }

  const updatePageSeller = (newPageSeller: PageSeller) => {
    if (currentAdminSelection.selectedPage && newPageSeller) {
      const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
      const pageSellers: PageSeller[] | undefined = pageToUpdate.sellers;
      pageToUpdate.sellers = pageSellers?.map((ps) =>
        (ps.pageSellerId === newPageSeller.pageSellerId && ps.sellerId === newPageSeller.sellerId)
          ? newPageSeller
          : ps
      )
      dispatch(setSelectedPage(pageToUpdate));
    }
  };

  const updateSeller = (pageSellerId: number | null, sellerId: number | null, newSellerId: number | null) => {
    if (pageSellerId === null || isNaN(pageSellerId) || sellerId === null || isNaN(sellerId) || !newSellerId || isNaN(newSellerId)) {
      return;
    }
    if (currentAdminSelection.selectedPage) {
      const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
      const pageSellers: PageSeller[] | undefined = pageToUpdate.sellers;
      const existingSeller = pageSellers?.find((x) => x.pageSellerId === pageSellerId && x.sellerId === sellerId);
      if (existingSeller) {
        pageToUpdate.sellers = pageSellers?.map((ps) =>
          (ps.pageSellerId === existingSeller.pageSellerId)
            ? { ...ps, sellerId: newSellerId }
            : ps
        )
      } else {
        pageToUpdate.sellers = pageSellers?.map((ps) =>
          (ps.pageSellerId === 0 && ps.sellerId === 0)
            ? { ...ps, sellerId: newSellerId }
            : ps
        )
      }
      dispatch(setSelectedPage(pageToUpdate));
    } else {
      goBack();
    }
  };

  const addSeller = () => {
    if (currentAdminSelection.selectedPage) {
      const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
      const userSellers = pageToUpdate.sellers ? [...pageToUpdate.sellers] : [];
      const existingAdd = userSellers.find((x) => x.pageSellerId === 0 && x.sellerId === 0);
      if (!existingAdd) {
        userSellers.push({
          pageId: pageToUpdate.pageId,
          pageSellerId: 0,
          sellerId: 0,
        });
        pageToUpdate.sellers = userSellers;
        dispatch(setSelectedPage(pageToUpdate));
      }
    } else {
      goBack();
    }
  };

  const removeSeller = (sId: number) => {
    let sellerId: number = sId;
    if (!sellerId || isNaN(sellerId)) {
      sellerId = 0;
    }
    if (currentAdminSelection.selectedPage) {
      const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
      let userSellers = pageToUpdate.sellers ? [...pageToUpdate.sellers] : [];
      userSellers = userSellers.filter((x) => x.sellerId !== sellerId);
      pageToUpdate.sellers = userSellers;
      dispatch(setSelectedPage(pageToUpdate));
    } else {
      goBack();
    }
  };

  const onFileUpload = (fileUploadName: string, filename: string) => {
    if (!currentAdminSelection.selectedPage || !fileUploadName || !filename) {
      return;
    }
    const pageToUpdate = { ...currentAdminSelection.selectedPage };
    let isDirty = false;
    switch (fileUploadName) {
      case 'Header':
        pageToUpdate.image = filename;
        setIsHeaderDirty(true);
        isDirty = true;
        break;
      case 'Icon':
        pageToUpdate.thumbnail = filename;
        setIsIconDirty(true);
        isDirty = true;
        break;
      case 'Preview':
        pageToUpdate.linkPreviewImage = filename;
        setIsLinkPreviewDirty(true);
        isDirty = true;
        break;
      case 'Logo':
        pageToUpdate.logoOnlyImage = filename;
        setIsLogoDirty(true);
        isDirty = true;
        break;
      default:
        break;
    }
    if (isDirty) {
      dispatch(setSelectedPage(pageToUpdate));
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
    if (!currentAdminSelection.selectedPage || !fileUploadName) {
      return;
    }
    const pageToUpdate = { ...currentAdminSelection.selectedPage };
    switch (fileUploadName) {
      case 'Header':
        pageToUpdate.image = undefined;
        dispatch(setSelectedPage(pageToUpdate));
        setIsHeaderDirty(true);
        markDirty();
        break;
      case 'Icon':
        pageToUpdate.thumbnail = undefined;
        dispatch(setSelectedPage(pageToUpdate));
        setIsHeaderDirty(true);
        markDirty();
        break;
      case 'Preview':
        pageToUpdate.linkPreviewImage = undefined;
        dispatch(setSelectedPage(pageToUpdate));
        setIsHeaderDirty(true);
        markDirty();
        break;
      case 'Logo':
        pageToUpdate.logoOnlyImage = undefined;
        dispatch(setSelectedPage(pageToUpdate));
        setIsHeaderDirty(true);
        markDirty();
        break;
      default:
        break;
    }
  };

  const onSubmit = () => {
    if (!currentAdminSelection.selectedPage) {
      return;
    }

    const pageToUpdate: Page = {
      ...currentAdminSelection.selectedPage
    };

    if (!pageToUpdate.route) {
      toast.error('Route cannot be blank');
      return;
    }

    if (!pageToUpdate.title) {
      toast.error('Title cannot be blank');
      return;
    }

    if (!pageToUpdate.pageType) {
      toast.error('Must select a page type');
      return;
    }

    if (pageSellerTypeIds.includes(pageToUpdate.pageType.pageTypeId)) {
      const pageSellers = pageToUpdate.sellers?.filter(x => (x.sellerId ?? 0) > 0);

      if (!pageSellers || pageSellers.length === 0) {
        toast.error('Must select at least one seller for this page');
        return;
      }
    }

    if (pageToUpdate.useIncludeDates && (!pageToUpdate.includeStart || !pageToUpdate.includeEnd)) {
      toast.error('If using include date range, both include dates must be set');
      return;
    }

    if (pageToUpdate.useExcludeDates && (!pageToUpdate.excludeStart || !pageToUpdate.excludeEnd)) {
      toast.error('If using exclude date range, both exclude dates must be set');
      return;
    }

    if (pageToUpdate.logoOnlyImage && pageToUpdate.logoOnlyImage.length > 4 && pageToUpdate.logoOnlyImage.substring(pageToUpdate.logoOnlyImage.length - 4) !== ".png") {
      toast.error('Logo image can only be a PNG');
      return;
    }

    if (pageToUpdate.htmlText) {
      pageToUpdate.htmlText = cleanHtmlText(pageToUpdate.htmlText);
    }

    dispatch(setIsLoading(true));

    updatePage(pageToUpdate).then((response: ModifyPageResponse) => {
      if (response.success) {
        dispatch(setReloadPages(true));
        toast.success('Save page succeeded');
        router.push('/admin/page-manager/');
      } else {
        toast.error(response.error ?? 'Error occurred while saving page');
      }
      dispatch(setIsLoading(false));
    });
  };

  const getSellerTypeFromPageType = () => {
    let sellerType: SellerType | undefined = undefined;
    switch (currentAdminSelection.selectedPage?.pageType?.pageTypeId) {
      case 7:
        sellerType = SellerType.Artist;
        break;
      case 14:
        sellerType = SellerType.Venue;
        break;
      case 16:
        sellerType = SellerType.Promoter;
        break;
      default:
        break;
    }
    return sellerType;
  };

  const pageTypeList: ItemDataType<number>[] = currentAdminSelection?.pageTypes ?
    currentAdminSelection.pageTypes.map((pageType) => (
      {
        label: `${pageType.pageTypeName}`,
        value: pageType.pageTypeId
      }
    )) : [];

  const pageHeader =
    ((currentAdminSelection.selectedPage?.pageId ?? 0) > 0) ? 'Edit page' : 'Add page';

  const isActive = currentAdminSelection.selectedPage?.isActive ?? false;
  const title = currentAdminSelection.selectedPage?.title;
  const selectedPageTypeId = currentAdminSelection.selectedPage?.pageType.pageTypeId ?? 0;
  const topImage = currentAdminSelection.selectedPage?.image;
  const iconImage = currentAdminSelection.selectedPage?.thumbnail;
  const linkPreviewImage = currentAdminSelection.selectedPage?.linkPreviewImage;
  const logoOnlyImage = currentAdminSelection.selectedPage?.logoOnlyImage;
  const subtitle1 = currentAdminSelection.selectedPage?.subtitle1;
  const subtitle2 = currentAdminSelection.selectedPage?.subtitle2;
  const htmlText = currentAdminSelection.selectedPage?.htmlText;
  const useIncludeDates = currentAdminSelection.selectedPage?.useIncludeDates ?? false;
  const includeStart = currentAdminSelection.selectedPage?.includeStart ? moment(currentAdminSelection.selectedPage.includeStart).toDate() : null;
  const includeEnd = currentAdminSelection.selectedPage?.includeEnd ? moment(currentAdminSelection.selectedPage.includeEnd).toDate() : null;
  const useExcludeDates = currentAdminSelection.selectedPage?.useExcludeDates ?? false;
  const excludeStart = currentAdminSelection.selectedPage?.excludeStart ? moment(currentAdminSelection.selectedPage.excludeStart).toDate() : null;
  const excludeEnd = currentAdminSelection.selectedPage?.excludeEnd ? moment(currentAdminSelection.selectedPage.excludeEnd).toDate() : null;
  const googleAnalyticsId = currentAdminSelection.selectedPage?.googleAnalyticsId;

  const sellerRows: ReactElement[] = [];
  if (
    currentAdminSelection.selectedPage &&
    currentAdminSelection.selectedPage.pageType &&
    pageSellerTypeIds.includes(currentAdminSelection.selectedPage.pageType.pageTypeId) &&
    currentAdminSelection.allSellers !== undefined
  ) {
    const sellerType = getSellerTypeFromPageType();
    if (currentAdminSelection.selectedPage.sellers) {
      currentAdminSelection.selectedPage.sellers.forEach((item, index) => {
        sellerRows.push(
          <AdminSellerSelect
            Id={item.sellerId.toString()}
            key={item.sellerId}
            Number={index + 1}
            Sellers={currentAdminSelection.allSellers}
            SellerId={item.sellerId}
            SellerType={sellerType}
            PageSeller={item}
            OnSellerChange={(newSellerId: number | null) => updateSeller(parseInt(`${item.pageSellerId}`), parseInt(`${item.sellerId}`), newSellerId)}
            OnPageSellerChange={(ps: PageSeller) => updatePageSeller(ps)}
            OnDelete={() => removeSeller(parseInt(`${item.sellerId}`))}
            Countries={currentAdminSelection.countries}
          />,
        );
      });
    }
    sellerRows.push(
      <div
        title="Add Seller"
        key="addSeller"
        className="admin-click-cell"
        onClick={addSeller}
      >
        <FaPlus></FaPlus> Add Seller
      </div>,
    );
  }

  return (
    <Row
      className="admin-container"
    >
      <Col>
        <Row>
          <Col><h1>{pageHeader}</h1></Col>
        </Row>
        <Row className="form-group">
          <Col>
            <FormCheck
              checked={!isActive}
              onChange={(e) => setIsActive(!e.target.checked)}
              label={'Page inactive on website?'}
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col>
            <label className="mt-4">Main Page Title (most viewed on the site)</label>
            <input
              value={title ?? ''}
              onChange={(e) => setPageTitle(e.target.value)}
              className="form-control form-control-half"
              placeholder="page title"
              type="text"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col>
            <label className="mt-4">Route (how it shows up in the url)</label>
            <input
              value={route ?? ''}
              onChange={(e) => setPageRoute(e.target.value)}
              className="form-control form-control-half"
              placeholder="page route"
              type="text"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col>
            <label className="mt-4">Page Type</label>
            <SelectPicker
              value={selectedPageTypeId}
              data={pageTypeList}
              size="lg"
              onChange={(ptId) => setPageType(ptId)}
              cleanable={false}
              menuAutoWidth={true}
              className="admin-seller-select-value"
              searchable={false}
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col>
            <AdminFileUpload
              Title="Top Image (ideally 1200-1600px wide, max is 1600px)"
              FileUploadName="Header"
              OnUpload={onFileUpload}
              CurrentFileName={topImage}
              IsDirty={isHeaderDirty}
              CurrentFileTitle={"View Current Top Image"}
              BaseUrl={headerBaseUrl}
              OnUploadStart={onUploadStart}
              OnUploadComplete={onUploadComplete}
              ShowRemoveButton={true}
              OnFileRemove={() => onFileRemove('Header')}
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col>
            <AdminFileUpload
              Title="Icon (rectangle, no wider than 400px)"
              FileUploadName="Icon"
              OnUpload={onFileUpload}
              CurrentFileName={iconImage}
              IsDirty={isIconDirty}
              CurrentFileTitle={"View Current Icon Image"}
              BaseUrl={iconBaseUrl}
              OnUploadStart={onUploadStart}
              OnUploadComplete={onUploadComplete}
              ShowRemoveButton={true}
              OnFileRemove={() => onFileRemove('Icon')}
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col>
            <AdminFileUpload
              Title="Link Preview Image (rectangle, no wider than 400px)"
              FileUploadName="Preview"
              OnUpload={onFileUpload}
              CurrentFileName={linkPreviewImage}
              IsDirty={isLinkPreviewDirty}
              CurrentFileTitle={"View Current Link Preview Image"}
              BaseUrl={linkPreviewBaseUrl}
              OnUploadStart={onUploadStart}
              OnUploadComplete={onUploadComplete}
              ShowRemoveButton={true}
              OnFileRemove={() => onFileRemove('Preview')}
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col>
            <AdminFileUpload
              Title="Logo Only (rectangle, must be a PNG and between 250-400 px wide)"
              FileUploadName="Logo"
              OnUpload={onFileUpload}
              CurrentFileName={logoOnlyImage}
              IsDirty={isLogoDirty}
              CurrentFileTitle={"View Current Logo Image"}
              BaseUrl={logoBaseUrl}
              OnUploadStart={onUploadStart}
              OnUploadComplete={onUploadComplete}
              ShowRemoveButton={true}
              OnFileRemove={() => onFileRemove('Logo')}
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col>
            <label className="mt-4">Subtitle 1</label>
            <input
              value={subtitle1 ?? ''}
              onChange={(e) => setSubTitle1(e.target.value)}
              className="form-control form-control-half"
              placeholder="Shows up underneath page title"
              type="text"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col>
            <label className="mt-4">Subtitle 2</label>
            <input
              value={subtitle2 ?? ''}
              onChange={(e) => setSubTitle2(e.target.value)}
              className="form-control form-control-half"
              placeholder="Shows up underneath subtitle 1"
              type="text"
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col>
            <label className="mt-4">HTML Text</label>
            <Form.Control as="textarea"
              rows={10}
              id="htmlText"
              onChange={(e) => setHtmlText(e.currentTarget.value)}
              value={htmlText ?? ''}
              placeholder='Free-form html text to be placed in header'
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col>
            <FormCheck
              checked={useIncludeDates}
              onChange={(e) => setUseIncludeDates(e.target.checked)}
              label={'Use include date range'}
            />
            <label className="mt-4">Include start date</label>
            <DatePicker
              id="includeStart"
              format="M/d/yyyy"
              onSelect={setIncludeStart}
              value={includeStart}
              oneTap
              cleanable
              disabled={!useIncludeDates}
              onClean={() => setIncludeStart(null)}
            />
            <label className="mt-4">Include end date</label>
            <DatePicker
              id="includeEnd"
              format="M/d/yyyy"
              onSelect={setIncludeEnd}
              value={includeEnd}
              oneTap
              cleanable
              disabled={!useIncludeDates}
              onClean={() => setIncludeEnd(null)}
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col>
            <FormCheck
              checked={useExcludeDates}
              onChange={(e) => setUseExcludeDates(e.target.checked)}
              label={'Use exclude date range'}
            />
            <label className="mt-4">Exclude start date</label>
            <DatePicker
              id="excludeStart"
              format="M/d/yyyy"
              onSelect={setExcludeStart}
              value={excludeStart}
              oneTap
              cleanable
              disabled={!useExcludeDates}
              onClean={() => setExcludeStart(null)}
            />
            <label className="mt-4">Exclude end date</label>
            <DatePicker
              id="excludeEnd"
              format="M/d/yyyy"
              onSelect={setExcludeEnd}
              value={excludeEnd}
              oneTap
              cleanable
              disabled={!useExcludeDates}
              onClean={() => setExcludeEnd(null)}
            />
          </Col>
        </Row>
        <Row className="form-group">
          <Col>
            <label className="mt-4">Google Analytics ID</label>
            <input
              value={googleAnalyticsId ?? ''}
              onChange={(e) => setGoogleAnalyticsId(e.target.value)}
              className="form-control form-control-half"
              placeholder="e.g.: UA-xxxxxxxxx-x"
              type="text"
            />
          </Col>
        </Row>
        <Row className="form-group" hidden={!pageSellerTypeIds.includes(currentAdminSelection?.selectedPage?.pageType?.pageTypeId ?? 0)}>
          <Col>
            <h4>Page Sellers</h4>
            {sellerRows}
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={onSubmit} disabled={isUploading}>Submit</Button> <Button onClick={confirmGoBack}>Back</Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

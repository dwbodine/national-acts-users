'use client';

import moment from 'moment';
import { useRouter } from 'next/navigation';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Checkbox, Col, DatePicker, Input, Row, SelectPicker } from 'rsuite';
import { ItemDataType } from 'rsuite/esm/internals/types';

import PageHeader from '@/components/common/PageHeaderComponent';
import Textarea from '@/components/common/Textarea';
import { ARTIST_SELLER_TYPE, ArtistTemplate, ImageType } from '@/constants';
import { useGetAllCountries } from '@/hooks/admin/useGetAllCountries';
import { useUpdatePage } from '@/hooks/admin/useUpdatePage';
import { useGetPageTypes } from '@/hooks/common/useGetPageTypes';
import { useGetSellers } from '@/hooks/common/useGetSellers';
import { setAllPages } from '@/lib/adminDataSelectionSlice';
import {
  setAllSellers,
  setCountries,
  setMustSavePage,
  setPageTypes,
  setReloadCountries,
  setReloadPages,
  setSelectedPage,
} from '@/lib/adminSelectionSlice';
import { setIsLoading } from '@/lib/globalSelectionSlice';
import { RootState } from '@/lib/store';
import { SellerType } from '@/types/event';
import { ArtistPageSettings, ArtistTitlePosition, Page, PageSeller } from '@/types/public';
import {
  GetCountriesResponse,
  GetPageTypesResponse,
  GetSellersResponse,
  ModifyPageResponse,
} from '@/types/responses';

import ConfirmationDialog from '../../common/confirmationDialogComponent';
import AdminFileUpload from '../common/adminFileUploadComponent';
import AdminSellerSelect from '../common/adminSellerSelectComponent';

export default function AdminPageEdit() {
  const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
  const currentAdminDataSelection = useSelector((state: RootState) => state.adminDataSelection);
  const route = currentAdminSelection.selectedPage?.route;
  const router = useRouter();
  const dispatch = useDispatch();
  const { updatePage } = useUpdatePage();
  const { getPageTypes } = useGetPageTypes();
  const { getSellers } = useGetSellers();
  const pageSellerTypeIds: number[] = [7, 14, 15, 16, 17, 18, 19];
  const { getAllCountries } = useGetAllCountries();
  const [isUploading, setIsUploading] = useState(false);
  const [isHeaderDirty, setIsHeaderDirty] = useState(false);
  const [isIconDirty, setIsIconDirty] = useState(false);
  const [isLinkPreviewDirty, setIsLinkPreviewDirty] = useState(false);
  const [isLogoDirty, setIsLogoDirty] = useState(false);

  const goBack = useCallback(() => {
    toast.dismiss();
    router.push('/admin/pages');
  }, [router]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentAdminSelection.reloadCountries) {
        dispatch(setReloadCountries(false));
        dispatch(setIsLoading(true));
        void getAllCountries().then((response: GetCountriesResponse) => {
          if (response.countries && !response.error) {
            dispatch(setCountries(response.countries));
          } else {
            const errMsg = response.error ? String(response.error) : 'Error loading countries';
            toast.error(errMsg);
            dispatch(setIsLoading(false));
          }
        });
      } else if (currentAdminSelection.allSellers === undefined) {
        dispatch(setIsLoading(true));
        void getSellers().then((response: GetSellersResponse) => {
          dispatch(setAllSellers(response.sellers));
        });
      } else if (currentAdminSelection.pageTypes === undefined) {
        dispatch(setIsLoading(true));
        void getPageTypes().then((response: GetPageTypesResponse) => {
          if (!response.error && response.pageTypes) {
            dispatch(setPageTypes(response.pageTypes));
          }
          dispatch(setIsLoading(false));
        });
      } else if (
        currentAdminDataSelection.allPages === undefined ||
        currentAdminSelection.selectedPage === undefined
      ) {
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
  };

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
  };

  const setPageType = (pageTypeId: number | null) => {
    if (
      !currentAdminSelection.selectedPage ||
      !currentAdminSelection.pageTypes ||
      currentAdminSelection.pageTypes.length === 0 ||
      !pageTypeId ||
      isNaN(pageTypeId)
    ) {
      return;
    }
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    if (pageToUpdate.pageType.pageTypeId !== pageTypeId) {
      const pageType = currentAdminSelection.pageTypes.find((x) => x.pageTypeId === pageTypeId);
      if (pageType) {
        pageToUpdate.pageType = pageType;
        if (pageTypeId === ARTIST_SELLER_TYPE) {
          const artistSettings = {
            ...(pageToUpdate.artistPageSettings || { artistTemplateTypeId: 0 }),
          };
          if (artistSettings.artistTemplateTypeId === undefined) {
            artistSettings.artistTemplateTypeId = ArtistTemplate.Original;
            pageToUpdate.artistPageSettings = artistSettings;
          }
        }
        dispatch(setSelectedPage(pageToUpdate));
        markDirty();
      }
    }
  };

  const setArtistTemplateType = (artistTemplateTypeId: number | null) => {
    if (!currentAdminSelection.selectedPage || !artistTemplateTypeId) {
      return;
    }

    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    const artistSettings: ArtistPageSettings = {
      ...(pageToUpdate.artistPageSettings || { artistTemplateTypeId: 0 }),
    };
    if (artistSettings.artistTemplateTypeId !== artistTemplateTypeId) {
      artistSettings.artistTemplateTypeId = artistTemplateTypeId;
      pageToUpdate.artistPageSettings = artistSettings;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  };

  const setTitlePosition = (titlePosition: ArtistTitlePosition | null) => {
    if (!currentAdminSelection.selectedPage || titlePosition === null) {
      return;
    }

    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    const artistSettings: ArtistPageSettings = {
      ...(pageToUpdate.artistPageSettings || { artistTemplateTypeId: 0 }),
    };
    if (artistSettings.titlePosition !== titlePosition) {
      artistSettings.titlePosition = titlePosition;
      pageToUpdate.artistPageSettings = artistSettings;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  };

  const setGradientStart = (hexCode: string | null) => {
    if (!currentAdminSelection.selectedPage) {
      return;
    }

    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    const artistSettings: ArtistPageSettings = {
      ...(pageToUpdate.artistPageSettings || { artistTemplateTypeId: 0 }),
    };
    const gradientStartColor = hexCode === 'undefined' ? undefined : (hexCode ?? undefined);
    if (artistSettings.gradientStartColor !== gradientStartColor) {
      artistSettings.gradientStartColor = gradientStartColor;
      pageToUpdate.artistPageSettings = artistSettings;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  };

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
  };

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
  };

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
    return htmlText;
  };

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
  };

  const setVipContents = (contents: string) => {
    if (!currentAdminSelection.selectedPage || !route) {
      return;
    }
    let htmlText: string = contents;
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    const artistSettings = { ...(pageToUpdate.artistPageSettings || { artistTemplateTypeId: 0 }) };
    htmlText = cleanHtmlText(htmlText);
    if (artistSettings.vipPackageContents !== htmlText) {
      artistSettings.vipPackageContents = htmlText;
      pageToUpdate.artistPageSettings = artistSettings;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  };

  const setArtistDescription = (description: string) => {
    if (!currentAdminSelection.selectedPage || !route) {
      return;
    }
    let htmlText: string = description;
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    const artistSettings = { ...(pageToUpdate.artistPageSettings || { artistTemplateTypeId: 0 }) };
    htmlText = cleanHtmlText(htmlText);
    if (artistSettings.artistDescription !== htmlText) {
      artistSettings.artistDescription = htmlText;
      pageToUpdate.artistPageSettings = artistSettings;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  };

  const setHtmlHeader = (html: string) => {
    if (!currentAdminSelection.selectedPage || !route) {
      return;
    }
    let htmlText: string = html;
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    htmlText = cleanHtmlText(htmlText);
    if (pageToUpdate.extraHtmlHead !== htmlText) {
      pageToUpdate.extraHtmlHead = htmlText;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  };

  const setHtmlBody = (html: string) => {
    if (!currentAdminSelection.selectedPage || !route) {
      return;
    }
    let htmlText: string = html;
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    htmlText = cleanHtmlText(htmlText);
    if (pageToUpdate.extraHtmlBody !== htmlText) {
      pageToUpdate.extraHtmlBody = htmlText;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  };

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
  };

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
  };

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
  };

  const showTitleInHeader = (showTitle: boolean) => {
    if (!currentAdminSelection.selectedPage) {
      return;
    }
    const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
    const artistSettings: ArtistPageSettings = {
      ...(pageToUpdate.artistPageSettings || { artistTemplateTypeId: 0 }),
    };
    if (artistSettings.showTitle != showTitle) {
      artistSettings.showTitle = showTitle;
      pageToUpdate.artistPageSettings = artistSettings;
      dispatch(setSelectedPage(pageToUpdate));
      markDirty();
    }
  };

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
  };

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
  };

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
  };

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
  };

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
  };

  const updatePageSeller = (newPageSeller: PageSeller) => {
    if (currentAdminSelection.selectedPage && newPageSeller) {
      const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
      const pageSellers: PageSeller[] | undefined = pageToUpdate.sellers;
      pageToUpdate.sellers = pageSellers?.map((ps) =>
        ps.pageSellerId === newPageSeller.pageSellerId && ps.sellerId === newPageSeller.sellerId
          ? newPageSeller
          : ps,
      );
      dispatch(setSelectedPage(pageToUpdate));
    }
  };

  const updateSeller = (
    pageSellerId: number | null,
    sellerId: number | null,
    newSellerId: number | null,
  ) => {
    if (
      pageSellerId === null ||
      isNaN(pageSellerId) ||
      sellerId === null ||
      isNaN(sellerId) ||
      !newSellerId ||
      isNaN(newSellerId)
    ) {
      return;
    }
    if (currentAdminSelection.selectedPage) {
      const pageToUpdate: Page = { ...currentAdminSelection.selectedPage };
      const pageSellers: PageSeller[] | undefined = pageToUpdate.sellers;
      const existingSeller = pageSellers?.find(
        (x) => x.pageSellerId === pageSellerId && x.sellerId === sellerId,
      );
      if (existingSeller) {
        pageToUpdate.sellers = pageSellers?.map((ps) =>
          ps.pageSellerId === existingSeller.pageSellerId ? { ...ps, sellerId: newSellerId } : ps,
        );
      } else {
        pageToUpdate.sellers = pageSellers?.map((ps) =>
          ps.pageSellerId === 0 && ps.sellerId === 0 ? { ...ps, sellerId: newSellerId } : ps,
        );
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
        setIsIconDirty(true);
        markDirty();
        break;
      case 'Preview':
        pageToUpdate.linkPreviewImage = undefined;
        dispatch(setSelectedPage(pageToUpdate));
        setIsLinkPreviewDirty(true);
        markDirty();
        break;
      case 'Logo':
        pageToUpdate.logoOnlyImage = undefined;
        dispatch(setSelectedPage(pageToUpdate));
        setIsLogoDirty(true);
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
      ...currentAdminSelection.selectedPage,
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

    if (
      pageToUpdate.pageType.pageTypeId === ARTIST_SELLER_TYPE &&
      !pageToUpdate.artistPageSettings
    ) {
      const artistSettings = {
        ...(pageToUpdate.artistPageSettings || { artistTemplateTypeId: 0 }),
      };
      artistSettings.artistTemplateTypeId = ArtistTemplate.Original;
      pageToUpdate.artistPageSettings = artistSettings;
    }

    if (pageSellerTypeIds.includes(pageToUpdate.pageType.pageTypeId)) {
      const pageSellers = pageToUpdate.sellers?.filter((x) => (x.sellerId ?? 0) > 0);

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

    if (
      pageToUpdate.logoOnlyImage &&
      pageToUpdate.logoOnlyImage.length > 4 &&
      pageToUpdate.logoOnlyImage.substring(pageToUpdate.logoOnlyImage.length - 4) !== '.png'
    ) {
      toast.error('Logo image can only be a PNG');
      return;
    }

    if (pageToUpdate.htmlText) {
      pageToUpdate.htmlText = cleanHtmlText(pageToUpdate.htmlText);
    }

    if (pageToUpdate.artistPageSettings?.vipPackageContents) {
      const artistSettings = { ...pageToUpdate.artistPageSettings };
      let contents = artistSettings.vipPackageContents || '';
      contents = cleanHtmlText(contents);
      contents = contents.trim();
      artistSettings.vipPackageContents = contents || undefined;
      pageToUpdate.artistPageSettings = artistSettings;
    }

    dispatch(setIsLoading(true));

    void updatePage(pageToUpdate).then((response: ModifyPageResponse) => {
      if (response.success) {
        dispatch(setReloadPages(true));
        dispatch(setAllPages(undefined));
        toast.success('Save page succeeded');
        router.push('/admin/pages');
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

  const pageTypeList: ItemDataType<number>[] = currentAdminSelection?.pageTypes
    ? currentAdminSelection.pageTypes.map((pageType) => ({
        label: `${pageType.pageTypeName}`,
        value: pageType.pageTypeId,
      }))
    : [];

  const titlePositionList: ItemDataType<number>[] = [
    {
      label: 'TOP',
      value: ArtistTitlePosition.TOP,
    },
    {
      label: 'BOTTOM',
      value: ArtistTitlePosition.BOTTOM,
    },
  ];

  const gradientStartList: ItemDataType<string>[] = [
    {
      label: 'None',
      value: 'undefined',
    },
    {
      label: 'Gray',
      value: 'B3B3B3',
    },
    {
      label: 'Green',
      value: '3B4938',
    },
    {
      label: 'Red',
      value: '553838',
    },
    {
      label: 'White',
      value: 'FFFCFC',
    },
    {
      label: 'Blue',
      value: '5851D6',
    },
  ];

  const getArtistTemplateLabel = (label: string) => {
    switch (label) {
      case 'NewTemplateFullHeader':
        return 'New Template (Full Header)';
      case 'NewTemplateThumbnailHeader':
        return 'New Template (Thumbnail Header)';
      default:
        return 'Original Template';
    }
  };

  const artistTemplateList: ItemDataType<number>[] = Object.entries(ArtistTemplate)
    .filter(([, value]) => typeof value === 'number')
    .map(([label, value]) => ({ label: getArtistTemplateLabel(label), value: value as number }));

  const pageHeader =
    (currentAdminSelection.selectedPage?.pageId ?? 0) > 0 ? 'Edit page' : 'Add page';

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
  const htmlHeader = currentAdminSelection.selectedPage?.extraHtmlHead;
  const htmlBody = currentAdminSelection.selectedPage?.extraHtmlBody;
  const useIncludeDates = currentAdminSelection.selectedPage?.useIncludeDates ?? false;
  const includeStart = currentAdminSelection.selectedPage?.includeStart
    ? moment(currentAdminSelection.selectedPage.includeStart).toDate()
    : null;
  const includeEnd = currentAdminSelection.selectedPage?.includeEnd
    ? moment(currentAdminSelection.selectedPage.includeEnd).toDate()
    : null;
  const useExcludeDates = currentAdminSelection.selectedPage?.useExcludeDates ?? false;
  const excludeStart = currentAdminSelection.selectedPage?.excludeStart
    ? moment(currentAdminSelection.selectedPage.excludeStart).toDate()
    : null;
  const excludeEnd = currentAdminSelection.selectedPage?.excludeEnd
    ? moment(currentAdminSelection.selectedPage.excludeEnd).toDate()
    : null;
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
            OnSellerChange={(newSellerId: number | null) =>
              updateSeller(
                parseInt(`${item.pageSellerId}`),
                parseInt(`${item.sellerId}`),
                newSellerId,
              )
            }
            OnPageSellerChange={(ps: PageSeller) => updatePageSeller(ps)}
            OnDelete={() => removeSeller(parseInt(`${item.sellerId}`))}
            Countries={currentAdminSelection.countries}
          />,
        );
      });
    }
    sellerRows.push(
      <div title="Add Seller" key="addSeller" className="admin-click-cell" onClick={addSeller}>
        <FaPlus></FaPlus> Add Seller
      </div>,
    );
  }

  const artistTemplateTypeId =
    currentAdminSelection.selectedPage?.artistPageSettings?.artistTemplateTypeId ??
    ArtistTemplate.Original;

  const showTitle = currentAdminSelection.selectedPage?.artistPageSettings?.showTitle ?? false;
  const titleLocation =
    currentAdminSelection.selectedPage?.artistPageSettings?.titlePosition ??
    ArtistTitlePosition.BOTTOM;
  const vipPackageContents =
    currentAdminSelection.selectedPage?.artistPageSettings?.vipPackageContents;
  const gradientStartColor =
    currentAdminSelection.selectedPage?.artistPageSettings?.gradientStartColor ?? 'undefined';

  const artistDescription =
    currentAdminSelection.selectedPage?.artistPageSettings?.artistDescription;

  return (
    <>
      <PageHeader pageTitle={pageHeader} />
      <Row className="admin-container">
        <Col xs={24}>
          <Row>
            <Col xs={24}>
              <Checkbox checked={!isActive} onChange={(_, checked) => setIsActive(!checked)}>
                Page inactive on website?
              </Checkbox>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={12}>
              <span>Page Type</span>
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
          {selectedPageTypeId === ARTIST_SELLER_TYPE && (
            <Row>
              <Col xs={24} md={12}>
                <span>Artist Template</span>
                <SelectPicker
                  value={artistTemplateTypeId}
                  data={artistTemplateList}
                  size="lg"
                  onChange={(atId) => setArtistTemplateType(atId)}
                  cleanable={false}
                  menuAutoWidth={true}
                  className="admin-seller-select-value"
                  searchable={false}
                />
              </Col>
            </Row>
          )}
          <Row>
            <Col xs={24}>
              <span>Main Page Title (most viewed on the site)</span>
              <Input
                value={title ?? ''}
                onChange={setPageTitle}
                className="form-control-half"
                placeholder="page title"
              />
            </Col>
          </Row>
          {selectedPageTypeId === ARTIST_SELLER_TYPE &&
            artistTemplateTypeId != Number(ArtistTemplate.Original) && (
              <Row>
                <Col xs={24}>
                  <Checkbox
                    checked={showTitle}
                    onChange={(_, checked) => showTitleInHeader(checked)}
                  >
                    Show Title in Header?
                  </Checkbox>
                </Col>
              </Row>
            )}
          {selectedPageTypeId === ARTIST_SELLER_TYPE &&
            artistTemplateTypeId == Number(ArtistTemplate.NewTemplateFullHeader) &&
            showTitle && (
              <Row>
                <Col xs={24} md={12}>
                  <span>Title Position in Header:</span>
                  <SelectPicker
                    value={titleLocation}
                    data={titlePositionList}
                    size="lg"
                    onChange={(tPos) => setTitlePosition(tPos)}
                    cleanable={false}
                    menuAutoWidth={true}
                    className="admin-seller-select-value"
                    searchable={false}
                  />
                </Col>
              </Row>
            )}
          {selectedPageTypeId === ARTIST_SELLER_TYPE &&
            showTitle &&
            artistTemplateTypeId != Number(ArtistTemplate.Original) && (
              <Row>
                <Col xs={24}>
                  <span>Artist Description:</span>
                  <Textarea
                    className="form-control-half"
                    rows={5}
                    id="artistDescription"
                    onChange={setArtistDescription}
                    value={artistDescription ?? ''}
                    placeholder="Free-form HTML for artist description (new templates only)"
                  />
                </Col>
              </Row>
            )}
          {selectedPageTypeId === ARTIST_SELLER_TYPE &&
            artistTemplateTypeId == Number(ArtistTemplate.NewTemplateThumbnailHeader) &&
            showTitle && (
              <Row>
                <Col xs={24} md={12}>
                  <span>Header Gradient Start Color:</span>
                  <SelectPicker
                    value={gradientStartColor}
                    data={gradientStartList}
                    size="lg"
                    onChange={(hexCode) => setGradientStart(hexCode)}
                    cleanable={false}
                    menuAutoWidth={true}
                    className="admin-seller-select-value"
                    searchable={false}
                  />
                </Col>
              </Row>
            )}
          {selectedPageTypeId === ARTIST_SELLER_TYPE &&
            artistTemplateTypeId != Number(ArtistTemplate.Original) && (
              <Row>
                <Col xs={24}>
                  <span>VIP Package Contents</span>
                  <Textarea
                    className="form-control-half"
                    rows={10}
                    id="vipPackageContents"
                    onChange={setVipContents}
                    value={vipPackageContents ?? ''}
                    placeholder="Free-form HTML for package contents"
                  />
                </Col>
              </Row>
            )}
          <Row>
            <Col xs={24}>
              <span>Route (how it shows up in the url)</span>
              <Input
                value={route ?? ''}
                onChange={setPageRoute}
                className="form-control-half"
                placeholder="page route"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <AdminFileUpload
                ImageType={ImageType.HEADERS}
                Title="Top Image (ideally 1200-1600px wide, max is 1600px)"
                FileUploadName="Header"
                OnUpload={onFileUpload}
                CurrentFileName={topImage}
                IsDirty={isHeaderDirty}
                CurrentFileTitle={'View Current Top Image'}
                OnUploadStart={onUploadStart}
                OnUploadComplete={onUploadComplete}
                ShowRemoveButton={true}
                OnFileRemove={() => onFileRemove('Header')}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <AdminFileUpload
                ImageType={ImageType.THUMBNAILS}
                Title="Icon (rectangle, no wider than 400px)"
                FileUploadName="Icon"
                OnUpload={onFileUpload}
                CurrentFileName={iconImage}
                IsDirty={isIconDirty}
                CurrentFileTitle={'View Current Icon Image'}
                OnUploadStart={onUploadStart}
                OnUploadComplete={onUploadComplete}
                ShowRemoveButton={true}
                OnFileRemove={() => onFileRemove('Icon')}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <AdminFileUpload
                ImageType={ImageType.PREVIEWS}
                Title="Link Preview Image (rectangle, no wider than 400px)"
                FileUploadName="Preview"
                OnUpload={onFileUpload}
                CurrentFileName={linkPreviewImage}
                IsDirty={isLinkPreviewDirty}
                CurrentFileTitle={'View Current Link Preview Image'}
                OnUploadStart={onUploadStart}
                OnUploadComplete={onUploadComplete}
                ShowRemoveButton={true}
                OnFileRemove={() => onFileRemove('Preview')}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <AdminFileUpload
                ImageType={ImageType.LOGOS}
                Title="Logo Only (rectangle, must be a PNG and between 250-400 px wide)"
                FileUploadName="Logo"
                OnUpload={onFileUpload}
                CurrentFileName={logoOnlyImage}
                IsDirty={isLogoDirty}
                CurrentFileTitle={'View Current Logo Image'}
                OnUploadStart={onUploadStart}
                OnUploadComplete={onUploadComplete}
                ShowRemoveButton={true}
                OnFileRemove={() => onFileRemove('Logo')}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <span>Subtitle 1</span>
              <Input
                value={subtitle1 ?? ''}
                onChange={setSubTitle1}
                className="form-control-half"
                placeholder="Shows up underneath page title"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <span>Subtitle 2</span>
              <Input
                value={subtitle2 ?? ''}
                onChange={setSubTitle2}
                className="form-control-half"
                placeholder="Shows up underneath subtitle 1"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <span>HTML Text</span>
              <Textarea
                className="form-control-half"
                rows={10}
                id="htmlText"
                onChange={setHtmlText}
                value={htmlText ?? ''}
                placeholder="Free-form html text to be placed in page under titles"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <span>Extra HTML Header text (script only)</span>
              <Textarea
                className="form-control-half"
                rows={10}
                id="htmlTextHead"
                onChange={setHtmlHeader}
                value={htmlHeader ?? ''}
                placeholder="Free-form html text to be placed in header"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <span>Extra HTML Body Text (iframe/script only, goes after opening body tag)</span>
              <Textarea
                className="form-control-half"
                rows={10}
                id="htmlText"
                onChange={setHtmlBody}
                value={htmlBody ?? ''}
                placeholder="Free-form html text to be placed immediately after opening body tag"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Checkbox
                checked={useIncludeDates}
                onChange={(_, checked) => setUseIncludeDates(checked)}
              >
                Use include date range
              </Checkbox>
              <br />
              <span>Include start date</span>
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
              <span>Include end date</span>
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
          <Row>
            <Col xs={24}>
              <Checkbox
                checked={useExcludeDates}
                onChange={(_, checked) => setUseExcludeDates(checked)}
              >
                Use exclude date range
              </Checkbox>
              <br />
              <span>Exclude start date</span>
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
              <span>Exclude end date</span>
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
          <Row>
            <Col xs={24}>
              <span>Google Analytics ID</span>
              <Input
                value={googleAnalyticsId ?? ''}
                onChange={setGoogleAnalyticsId}
                className="form-control-half"
                placeholder="e.g.: UA-xxxxxxxxx-x"
              />
            </Col>
          </Row>
          <Row
            hidden={
              !pageSellerTypeIds.includes(
                currentAdminSelection?.selectedPage?.pageType?.pageTypeId ?? 0,
              )
            }
          >
            <Col xs={24}>
              <h4>Page Sellers</h4>
              {sellerRows}
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

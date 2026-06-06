import axios, { AxiosError, AxiosInstance } from 'axios';

import { ImageType, MINIMUM_UNIX_TIMESTAMP } from '@/constants';
import { getArrayData, getErrorMessage, getStatusCode } from '@/lib/serviceResponses';
import { FanMomentFilter } from '@/types/props';
import { FanMoment, FeaturedArtist, Page, PageType, SiteSetting } from '@/types/public';
import {
  GetEventsResponse,
  GetFanMomentsResponse,
  GetFeaturedArtistsResponse,
  GetPagesResponse,
  GetPageTypesResponse,
  GetSellersResponse,
  GetSettingsResponse,
} from '@/types/responses';

import { Seller, VipEvent } from '../types/event';

export class PublicService {
  protected readonly instance: AxiosInstance;

  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: 'Time out!',
    });
  }

  getEvents = async (
    start: number = 0,
    end: number = 0,
    sellerId: number = 0,
  ): Promise<GetEventsResponse> => {
    let startUnix: number = start;
    let endUnix: number = end;
    if (startUnix > 0 && startUnix < MINIMUM_UNIX_TIMESTAMP) {
      startUnix = MINIMUM_UNIX_TIMESTAMP;
    }

    if (startUnix > 0 && endUnix > 0 && endUnix <= startUnix) {
      endUnix = startUnix + 7 * 24 * 60 * 60;
    }

    const queryParams: string[] = [];

    if (startUnix > 0) {
      queryParams.push(`start=${startUnix}`);
    }

    if (endUnix > 0) {
      queryParams.push(`end=${endUnix}`);
    }

    if (sellerId > 0) {
      queryParams.push(`sellerId=${sellerId}`);
    }

    const url =
      queryParams.length > 0 ? `/public/events?${queryParams.join('&')}` : `/public/events`;

    const response: GetEventsResponse = {};

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env['NEXT_PUBLIC_API_KEY']}`,
    };

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.events = getArrayData<VipEvent>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while fetching events - please contact your administrator',
      );
    }

    return response;
  };

  getSellers = async (): Promise<GetSellersResponse> => {
    const url = `/public/sellers`;

    const response: GetSellersResponse = {};

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env['NEXT_PUBLIC_API_KEY']}`,
    };

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.sellers = getArrayData<Seller>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while fetching sellers - please contact your administrator',
      );
    }

    return response;
  };

  getPageTypes = async (sellerTypesOnly: boolean = false): Promise<GetPageTypesResponse> => {
    const url = sellerTypesOnly ? `/public/page_seller_types` : `/public/page_types`;

    const response: GetPageTypesResponse = {};

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env['NEXT_PUBLIC_API_KEY']}`,
    };

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.pageTypes = getArrayData<PageType>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while fetching page types - please contact your administrator',
      );
    }

    return response;
  };

  getPagesByType = async (pageTypeId: number): Promise<GetPagesResponse> => {
    const url = `/public/pages/${pageTypeId}`;

    const response: GetPagesResponse = {};

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env['NEXT_PUBLIC_API_KEY']}`,
    };

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.pages = getArrayData<Page>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while fetching pages by type - please contact your administrator',
      );
    }

    return response;
  };

  getSiteSettings = async (): Promise<GetSettingsResponse> => {
    const url = `/public/settings`;

    const response: GetSettingsResponse = {};

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env['NEXT_PUBLIC_API_KEY']}`,
    };

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.settings = getArrayData<SiteSetting>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while fetching settings - please contact your administrator',
      );
    }

    return response;
  };

  uploadImageFile = async (file: File, imageType: ImageType): Promise<string | undefined> => {
    if (!file || !file.name || !imageType) {
      return undefined;
    }

    const url = `/public/uploadImage/${imageType.valueOf()}`;

    const data = new FormData();
    data.append('tempFile', file);

    const headers = {
      'Content-Type': 'multipart/form-data',
      'x-api-key': `${process.env['NEXT_PUBLIC_API_KEY']}`,
    };

    try {
      const res = await this.instance.post(url, data, { headers });
      const filename = res.data as string;
      return filename;
    } catch {
      return undefined;
    }
  };

  getFeaturedArtists = async (): Promise<GetFeaturedArtistsResponse> => {
    const url = `/public/featuredArtists`;

    const response: GetFeaturedArtistsResponse = {};

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env['NEXT_PUBLIC_API_KEY']}`,
    };

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.featuredArtists = res.data ? (res.data as FeaturedArtist[]) : [];
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while fetching featured artists - please contact your administrator';
    }

    return response;
  };

  getFanMoments = async (filter: FanMomentFilter): Promise<GetFanMomentsResponse> => {
    let url = `/public/fan-moments/filter?startDate=${filter.startDate}`;

    if (filter.endDate) {
      url += `&endDate=${filter.endDate}`;
    }

    if (filter.sellerId) {
      url += `&sellerId=${filter.sellerId}`;
    }

    if (filter.eventId) {
      url += `&eventId=${filter.eventId}`;
    }

    const response: GetFanMomentsResponse = {};

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env['NEXT_PUBLIC_API_KEY']}`,
    };

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.fanMoments = res.data ? (res.data as FanMoment[]) : [];
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while fetching fan moments - please contact your administrator';
    }

    return response;
  };
}

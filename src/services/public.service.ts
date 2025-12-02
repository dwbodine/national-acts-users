import {
  GetEventsResponse,
  GetPageTypesResponse,
  GetPagesResponse,
  GetSellersResponse,
  GetSettingsResponse,
} from '@/types/responses';
import { ImageType, MINIMUM_UNIX_TIMESTAMP } from '@/constants';
import { Page, PageType, SiteSetting } from '@/types/public';
import { Seller, VipEvent } from '../types/event';
import axios, { AxiosError, AxiosInstance } from 'axios';

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

    let url = `/public/events`;

    if (startUnix > 0 || endUnix > 0 || sellerId > 0) {
      url += '?';
    }

    if (startUnix > 0) {
      if (!url.endsWith('?')) {
        url += '&';
      }
      url += `start=${startUnix}`;
    }

    if (endUnix > 0) {
      if (!url.endsWith('?')) {
        url += '&';
      }
      url += `end=${endUnix}`;
    }

    if (sellerId > 0) {
      if (!url.endsWith('?')) {
        url += '&';
      }
      url += `sellerId=${sellerId}`;
    }

    const response: GetEventsResponse = {};

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env['NEXT_PUBLIC_API_KEY']}`,
    };

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.events = res.data ? (res.data as VipEvent[]) : [];
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ?? 'Unknown error while fetching events - please contact your administrator';
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
      response.sellers = res.data ? (res.data as Seller[]) : [];
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ?? 'Unknown error while fetching sellers - please contact your administrator';
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
      response.pageTypes = res.data ? (res.data as PageType[]) : [];
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while fetching page types - please contact your administrator';
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
      response.pages = res.data ? (res.data as Page[]) : [];
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while fetching pages by type - please contact your administrator';
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
      response.settings = res.data ? (res.data as SiteSetting[]) : [];
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ?? 'Unknown error while fetching settings - please contact your administrator';
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
}

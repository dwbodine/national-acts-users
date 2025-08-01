import { GetPageTypesResponse, GetPagesResponse, GetSellersResponse, GetSettingsResponse } from '@/types/responses';
import { Page, PageType, SiteSetting } from '@/types/public';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { Seller } from '../types/event';


export class PublicService {
  protected readonly instance: AxiosInstance;

  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: 'Time out!',
    });
  }

  getSellers = async (): Promise<GetSellersResponse> => {
    const url = `/public/sellers`;

    const response: GetSellersResponse = {};

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env.NEXT_PUBLIC_API_KEY}`,
    };

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.sellers = res.data ? (res.data as Seller[]) : [];
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while fetching sellers - please contact your administrator';
    }

    return response;
  };

  getPageTypes = async (
    sellerTypesOnly: boolean = false,
  ): Promise<GetPageTypesResponse> => {
    const url = sellerTypesOnly ? `/public/page_seller_types` : `/public/page_types`;

    const response: GetPageTypesResponse = {};

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env.NEXT_PUBLIC_API_KEY}`,
    };

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.pageTypes = res.data ? (res.data as PageType[]) : [];
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while fetching page types - please contact your administrator';
    }

    return response;
  };

  getPagesByType = async (pageTypeId: number): Promise<GetPagesResponse> => {
    const url = `/public/pages/${pageTypeId}`;

    const response: GetPagesResponse = {};

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env.NEXT_PUBLIC_API_KEY}`,
    };

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.pages = res.data ? (res.data as Page[]) : [];
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while fetching pages by type - please contact your administrator';
    }

    return response;
  };

  getSiteSettings = async (): Promise<GetSettingsResponse> => {
    const url = `/public/settings`;

    const response: GetSettingsResponse = {};

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env.NEXT_PUBLIC_API_KEY}`,
    };

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.settings = res.data ? (res.data as SiteSetting[]) : [];
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error = err?.message ?? 'Unknown error while fetching settings - please contact your administrator';
    }

    return response;
  };

  uploadTempFile = async (file: File): Promise<string | undefined> => {
    const url = `/public/uploadFile`;

    if (!file || !file.name) {
      return undefined;
    }

    const data = new FormData();
    data.append('tempFile', file);

    const headers = {
      'Content-Type': 'multipart/form-data',
      'x-api-key': `${process.env.NEXT_PUBLIC_API_KEY}`,
    };

    try {
      const res = await this.instance.post(url, data, { headers });
      const filename = res.data;
      return filename;
    } catch {
      return undefined;
    }
  };
}

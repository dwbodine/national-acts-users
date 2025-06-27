import axios, { AxiosInstance } from 'axios';
import { GetPageTypesResponse, GetSellersResponse, Seller } from '../types/event';
import { GetSettingsResponse, Page, PageType, SiteSetting } from '@/types/public';
import { GetPagesResponse } from '@/types/admin';

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
    let url = `/public/sellers`;

    let sellersResponse: GetSellersResponse = {
      sellers: undefined,
      sellersError: undefined,
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env.NEXT_PUBLIC_API_KEY}`,
    };

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        const sellers = res.data;
        sellersResponse.sellers = sellers.length ? (sellers as Seller[]) : [];
        return sellersResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching sellers - please contact your administrator';
        }
        sellersResponse.sellersError = errorMessage;
        return sellersResponse;
      });
  };

  getPageTypes = async (
    sellerTypesOnly: boolean = false,
  ): Promise<GetPageTypesResponse> => {
    let url = sellerTypesOnly ? `/public/page_seller_types` : `/public/page_types`;

    let pageTypeResponse: GetPageTypesResponse = {
      pageTypes: undefined,
      pageTypeError: undefined,
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env.NEXT_PUBLIC_API_KEY}`,
    };

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        const pageTypes = res.data;
        pageTypeResponse.pageTypes = pageTypes.length ? (pageTypes as PageType[]) : [];
        return pageTypeResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching page types - please contact your administrator';
        }
        pageTypeResponse.pageTypeError = errorMessage;
        return pageTypeResponse;
      });
  };

  getPagesByType = async (pageTypeId: number): Promise<GetPagesResponse> => {
    let url = `/public/pages/${pageTypeId}`;

    let response: GetPagesResponse = {
      pages: undefined,
      pageError: undefined,
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env.NEXT_PUBLIC_API_KEY}`,
    };

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        const pages = res.data;
        response.pages = pages.length ? (pages as Page[]) : [];
        return response;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching pages by type - please contact your administrator';
        }
        response.pageError = errorMessage;
        return response;
      });
  };

  getSiteSettings = async (): Promise<GetSettingsResponse> => {
    let url = `/public/settings`;

    let settingsResponse: GetSettingsResponse = {
      settings: undefined,
      settingsError: undefined,
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env.NEXT_PUBLIC_API_KEY}`,
    };

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        const settings = res.data;
        settingsResponse.settings = settings.length ? (settings as SiteSetting[]) : [];
        return settingsResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching settings - please contact your administrator';
        }
        settingsResponse.settingsError = errorMessage;
        return settingsResponse;
      });
  };

  uploadTempFile = async (file: any): Promise<string | undefined> => {
    let url = `/public/uploadFile`;

    if (!file || !file.name) {
      return undefined;
    }

    const formData = new FormData();
    formData.append('tempFile', file);

    const headers = {
      'Content-Type': 'multipart/form-data',
      'x-api-key': `${process.env.NEXT_PUBLIC_API_KEY}`,
    };

    return this.instance
      .post(url, formData, {
        headers: headers,
      })
      .then((res) => {
        const filename = res.data;
        return filename;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = 'Unknown error while updating event';
        }
        console.log(errorMessage);
        return undefined;
      });
  };
}

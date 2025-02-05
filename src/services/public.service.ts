import axios, { AxiosInstance } from 'axios';
import { GetSellersResponse, Seller } from '../types/event';
import { GetSettingsResponse, SiteSetting } from '@/types/public';

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

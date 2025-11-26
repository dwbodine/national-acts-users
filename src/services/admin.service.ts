import { Country, Faq, FaqCategory, Page, SiteSetting } from '@/types/public';
import { ExternalVenue, TicketSocketAccount } from '@/types/admin';
import {
  GetCountriesResponse,
  GetExternalVenuesResponse,
  GetFaqCategoriesResponse,
  GetFaqsResponse,
  GetPagesResponse,
  GetSellersResponse,
  GetTicketSocketAccountsResponse,
  ModifyExternalEventResponse,
  ModifyExternalVenueResponse,
  ModifyFaqResponse,
  ModifyPageResponse,
  ModifySellerResponse,
  UpdateSettingResponse,
} from '@/types/responses';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { Seller } from '@/types/event';
import getAuthorizationHeader from '@/utils/getAuthorizationHeader';

export class AdminService {
  protected readonly instance: AxiosInstance;

  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: 'Time out!',
    });
  }

  getAllFaqs = async (): Promise<GetFaqsResponse> => {
    const url = `/public/faq/0`;

    const response: GetFaqsResponse = {};

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env['NEXT_PUBLIC_API_KEY']}`,
    };

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.faqs = res.data ? (res.data as Faq[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while fetching faqs - please contact your administrator';
    }

    return response;
  };

  getAllFaqCategories = async (): Promise<GetFaqCategoriesResponse> => {
    const url = `/public/faq_categories`;

    const response: GetFaqCategoriesResponse = {};

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env['NEXT_PUBLIC_API_KEY']}`,
    };

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.categories = res.data ? (res.data as FaqCategory[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while fetching faq categories - please contact your administrator';
    }

    return response;
  };

  updateFaq = async (faqToUpdate: Faq): Promise<ModifyFaqResponse> => {
    const url = `/admin/faq/update`;

    const response: ModifyFaqResponse = {};

    const data = JSON.stringify(faqToUpdate);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while updating FAQ - please contact your administrator';
    }

    return response;
  };

  deleteFaq = async (faqId: number): Promise<ModifyFaqResponse> => {
    const url = `/admin/faq/delete`;

    const response: ModifyFaqResponse = {};

    const data = JSON.stringify({ faqId });

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while deleting FAQ - please contact your administrator';
    }

    return response;
  };

  moveFaqUp = async (faqId: number): Promise<ModifyFaqResponse> => {
    const url = `/admin/faq/moveup`;

    const response: ModifyFaqResponse = {};

    const data = JSON.stringify({
      faqId,
    });

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while moving up FAQ - please contact your administrator';
    }

    return response;
  };

  moveFaqDown = async (faqId: number): Promise<ModifyFaqResponse> => {
    const url = `/admin/faq/movedown`;

    const response: ModifyFaqResponse = {};

    const data = JSON.stringify({ faqId });

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while moving down FAQ - please contact your administrator';
    }

    return response;
  };

  getAllPages = async (): Promise<GetPagesResponse> => {
    const url = `/admin/pages`;

    const response: GetPagesResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.pages = res.data ? (res.data as Page[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while fetching pages - please contact your administrator';
    }

    return response;
  };

  updatePage = async (pageToUpdate: Page): Promise<ModifyPageResponse> => {
    const url = `/admin/pages/update`;

    const response: ModifyPageResponse = {};

    const data = JSON.stringify(pageToUpdate);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
      response.updatedPage = res.data ? (res.data as Page) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while updating page - please contact your administrator';
    }

    return response;
  };

  updatePageOrder = async (pagesToUpdate: Page[]): Promise<ModifyPageResponse> => {
    const url = `/admin/pages/order`;

    const response: ModifyPageResponse = {};

    const data = JSON.stringify(pagesToUpdate);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
      response.updatedPage = res.data ? (res.data as Page) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while updating page order - please contact your administrator';
    }

    return response;
  };

  updateSiteSettings = async (
    settingsToUpdate: SiteSetting[],
  ): Promise<UpdateSettingResponse> => {
    const url = `/admin/settings/update`;

    const response: UpdateSettingResponse = {};

    const data = JSON.stringify(settingsToUpdate);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.data !== undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while updating site setting - please contact your administrator';
    }

    return response;
  };

  getAllVenues = async (searchTerm?: string): Promise<GetExternalVenuesResponse> => {
    let url = `/admin/venues`;
    if (searchTerm) {
      url += `?search=${encodeURIComponent(searchTerm)}`;
    }

    const response: GetExternalVenuesResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.venues = res.data ? (res.data as ExternalVenue[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while fetching venues - please contact your administrator';
    }

    return response;
  };

  getAllCountries = async (): Promise<GetCountriesResponse> => {
    const url = `/admin/countries`;

    const response: GetCountriesResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.countries = res.data ? (res.data as Country[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while fetching countries - please contact your administrator';
    }

    return response;
  };

  updateVenue = async (
    venueToUpdate: ExternalVenue,
  ): Promise<ModifyExternalVenueResponse> => {
    const url = `/admin/venues/edit`;

    const response: ModifyExternalVenueResponse = {};

    const data = JSON.stringify(venueToUpdate);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
      response.updatedVenue = res.data ? (res.data as ExternalVenue) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while updating venue - please contact your administrator';
    }

    return response;
  };

  deleteVenue = async (venueId: number): Promise<ModifyExternalVenueResponse> => {
    const url = '/admin/venues/delete';
    const headers = getAuthorizationHeader();

    const response: ModifyExternalVenueResponse = {};

    const data = { venueId };

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while deleting venue - please contact your administrator';
    }

    return response;
  };

  getTicketSocketAccounts = async (): Promise<GetTicketSocketAccountsResponse> => {
    const url = `/admin/ticketSocketAccounts`;

    const response: GetTicketSocketAccountsResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.accounts = res.data ? (res.data as TicketSocketAccount[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while fetching ticket socket accounts - please contact your administrator';
    }

    return response;
  };

  getSellers = async (): Promise<GetSellersResponse> => {
    const url = `/admin/sellers`;

    const response: GetSellersResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.sellers = res.data ? (res.data as Seller[]) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while fetching sellers - please contact your administrator';
    }

    return response;
  };

  updateSeller = async (sellerToUpdate: Seller): Promise<ModifyExternalEventResponse> => {
    const url = `/admin/seller/update`;

    const response: ModifySellerResponse = {};

    const data = JSON.stringify(sellerToUpdate);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
      response.updatedSeller = res.data ? (res.data as Seller) : undefined;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = err?.response?.status ?? 500;
      response.error =
        err?.message ??
        'Unknown error while updating seller - please contact your administrator';
    }

    return response;
  };
}

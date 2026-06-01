import axios, { AxiosError, AxiosInstance } from 'axios';

import { getErrorMessage, getOptionalData, getStatusCode } from '@/lib/serviceResponses';
import { ExternalVenue, TicketSocketAccount } from '@/types/admin';
import { Seller } from '@/types/event';
import {
  Country,
  FanMoment,
  Faq,
  FaqCategory,
  FeaturedArtist,
  Page,
  PageSeller,
  SiteSetting,
} from '@/types/public';
import {
  GetCountriesResponse,
  GetExternalVenuesResponse,
  GetFaqCategoriesResponse,
  GetFaqsResponse,
  GetPageSellersResponse,
  GetPagesResponse,
  GetSellersResponse,
  GetTicketSocketAccountsResponse,
  ModifyExternalEventResponse,
  ModifyExternalVenueResponse,
  ModifyFanMomentResponse,
  ModifyFaqResponse,
  ModifyFeaturedArtistResponse,
  ModifyFeaturedArtistsResponse,
  ModifyPageResponse,
  ModifySellerResponse,
  UpdateSettingResponse,
} from '@/types/responses';
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
      response.faqs = getOptionalData<Faq[]>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while fetching faqs - please contact your administrator',
      );
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
      response.categories = getOptionalData<FaqCategory[]>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while fetching faq categories - please contact your administrator',
      );
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
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while updating FAQ - please contact your administrator',
      );
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
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while deleting FAQ - please contact your administrator',
      );
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
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while moving up FAQ - please contact your administrator',
      );
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
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while moving down FAQ - please contact your administrator',
      );
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
      response.pages = getOptionalData<Page[]>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while fetching pages - please contact your administrator',
      );
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
      response.updatedPage = getOptionalData<Page>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while updating page - please contact your administrator',
      );
    }

    return response;
  };

  updateFeaturedArtistOrder = async (
    featuredArtistsToUpdate: FeaturedArtist[],
  ): Promise<ModifyFeaturedArtistsResponse> => {
    const url = `/admin/featured-artists/order`;

    const response: ModifyFeaturedArtistsResponse = {};

    const data = JSON.stringify(featuredArtistsToUpdate);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while updating featured artist order - please contact your administrator',
      );
    }

    return response;
  };

  updateFeaturedArtist = async (
    faToUpdate: FeaturedArtist,
  ): Promise<ModifyFeaturedArtistResponse> => {
    const url = `/admin/featured-artists/update`;

    const response: ModifyFeaturedArtistResponse = {};

    const data = JSON.stringify(faToUpdate);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
      response.updatedFeaturedArtist = getOptionalData<FeaturedArtist>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while updating featured artist - please contact your administrator',
      );
    }

    return response;
  };

  addFanMomment = async (fmToUpdate: FanMoment): Promise<ModifyFanMomentResponse> => {
    const url = `/admin/fan-moments/add`;

    const response: ModifyFanMomentResponse = {};

    const data = JSON.stringify(fmToUpdate);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
      response.updatedFanMoment = getOptionalData<FanMoment>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while adding fan moment - please contact your administrator',
      );
    }

    return response;
  };

  deleteFanMomment = async (fmToUpdate: FanMoment): Promise<ModifyFanMomentResponse> => {
    const url = `/admin/fan-moments/delete`;

    const response: ModifyFanMomentResponse = {};

    const data = JSON.stringify(fmToUpdate);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while deleting fan moment - please contact your administrator',
      );
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
      response.updatedPage = getOptionalData<Page>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while updating page order - please contact your administrator',
      );
    }

    return response;
  };

  updateSiteSettings = async (settingsToUpdate: SiteSetting[]): Promise<UpdateSettingResponse> => {
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
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while updating site setting - please contact your administrator',
      );
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
      response.venues = getOptionalData<ExternalVenue[]>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while fetching venues - please contact your administrator',
      );
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
      response.countries = getOptionalData<Country[]>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while fetching countries - please contact your administrator',
      );
    }

    return response;
  };

  updateVenue = async (venueToUpdate: ExternalVenue): Promise<ModifyExternalVenueResponse> => {
    const url = `/admin/venues/edit`;

    const response: ModifyExternalVenueResponse = {};

    const data = JSON.stringify(venueToUpdate);

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.post(url, data, { headers });
      response.statusCode = res.status;
      response.success = res.status === 200;
      response.updatedVenue = getOptionalData<ExternalVenue>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while updating venue - please contact your administrator',
      );
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
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while deleting venue - please contact your administrator',
      );
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
      response.accounts = getOptionalData<TicketSocketAccount[]>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while fetching ticket socket accounts - please contact your administrator',
      );
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
      response.sellers = getOptionalData<Seller[]>(res.data);
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

  getAllPageSellers = async (): Promise<GetPageSellersResponse> => {
    const url = `/admin/featured-artists/page-sellers`;

    const response: GetPageSellersResponse = {};

    const headers = getAuthorizationHeader();

    try {
      const res = await this.instance.get(url, { headers });
      response.statusCode = res.status;
      response.pageSellers = getOptionalData<PageSeller[]>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while fetching page sellers - please contact your administrator',
      );
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
      response.updatedSeller = getOptionalData<Seller>(res.data);
    } catch (e) {
      const err = e as AxiosError;
      response.statusCode = getStatusCode(err);
      response.error = getErrorMessage(
        err,
        'Unknown error while updating seller - please contact your administrator',
      );
    }

    return response;
  };
}

import axios, { AxiosInstance } from 'axios';
import {
  Country,
  Faq,
  FaqCategory,
  Page,
  SiteSetting,
  UpdateSettingResponse,
} from '@/types/public';
import { getAuthorizationHeader } from '@/utils/getAuthorizationHeader';
import {
  ExternalVenue,
  GetCountriesResponse,
  GetExternalVenuesResponse,
  GetFaqCategoriesResponse,
  GetFaqsResponse,
  GetPagesResponse,
  GetTicketSocketAccountsResponse,
  ModifyExternalEventResponse,
  ModifyExternalVenueResponse,
  ModifyFaqResponse,
  ModifyPageResponse,
  ModifySellerResponse,
  TicketSocketAccount,
} from '@/types/admin';
import { GetSellersResponse, Seller } from '@/types/event';

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

    const response: GetFaqsResponse = {
      faqs: undefined,
      faqError: undefined,
      statusCode: 200,
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
        response.faqs = res.data ? (res.data as Faq[]) : undefined;
        return response;
      })
      .catch((err) => {
        console.log(err);
        let errorMessage = '';
        if (err?.response?.status) {
          response.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching faqs - please contact your administrator';
        }
        response.faqError = errorMessage;
        return response;
      });
  };

  getAllFaqCategories = async (): Promise<GetFaqCategoriesResponse> => {
    const url = `/public/faq_categories`;

    const response: GetFaqCategoriesResponse = {
      categories: undefined,
      categoryError: undefined,
      statusCode: 200,
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
        response.categories = res.data ? (res.data as FaqCategory[]) : undefined;
        return response;
      })
      .catch((err) => {
        console.log(err);
        let errorMessage = '';
        if (err?.response?.status) {
          response.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching faq categories - please contact your administrator';
        }
        response.categoryError = errorMessage;
        return response;
      });
  };

  updateFaq = async (faqToUpdate: Faq): Promise<ModifyFaqResponse> => {
    const url = `/admin/faq/update`;

    const modifyResponse: ModifyFaqResponse = {
      success: false,
      faqError: undefined,
      statusCode: 200,
    };

    const data = JSON.stringify(faqToUpdate);

    const headers = getAuthorizationHeader();

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        let errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = 'Unknown error while updating FAQ';
        }
        modifyResponse.faqError = errorMessage;
        return modifyResponse;
      });
  };

  deleteFaq = async (faqId: number): Promise<ModifyFaqResponse> => {
    const url = `/admin/faq/delete`;

    const modifyResponse: ModifyFaqResponse = {
      success: false,
      faqError: undefined,
      statusCode: 200,
    };

    const data = JSON.stringify({
      faqId: faqId,
    });

    const headers = getAuthorizationHeader();

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        let errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = 'Unknown error while deleting FAQ';
        }
        modifyResponse.faqError = errorMessage;
        return modifyResponse;
      });
  };

  moveFaqUp = async (faqId: number): Promise<ModifyFaqResponse> => {
    const url = `/admin/faq/moveup`;

    const modifyResponse: ModifyFaqResponse = {
      success: false,
      faqError: undefined,
      statusCode: 200,
    };

    const data = JSON.stringify({
      faqId: faqId,
    });

    const headers = getAuthorizationHeader();

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        let errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = 'Unknown error while moving up FAQ';
        }
        modifyResponse.faqError = errorMessage;
        return modifyResponse;
      });
  };

  moveFaqDown = async (faqId: number): Promise<ModifyFaqResponse> => {
    const url = `/admin/faq/movedown`;

    const modifyResponse: ModifyFaqResponse = {
      success: false,
      faqError: undefined,
      statusCode: 200,
    };

    const data = JSON.stringify({
      faqId: faqId,
    });

    const headers = getAuthorizationHeader();

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        let errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = 'Unknown error while moving down FAQ';
        }
        modifyResponse.faqError = errorMessage;
        return modifyResponse;
      });
  };

  getAllPages = async (): Promise<GetPagesResponse> => {
    const url = `/admin/pages`;

    const pagesResponse: GetPagesResponse = {
      pages: undefined,
      pageError: undefined,
      statusCode: 200,
    };

    const headers = getAuthorizationHeader();

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        pagesResponse.pages = res.data ? (res.data as Page[]) : undefined;
        return pagesResponse;
      })
      .catch((err) => {
        console.log(err);
        let errorMessage = '';
        if (err?.response?.status) {
          pagesResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching pages - please contact your administrator';
        }
        pagesResponse.pageError = errorMessage;
        return pagesResponse;
      });
  };

  updatePage = async (pageToUpdate: Page): Promise<ModifyPageResponse> => {
    const url = `/admin/pages/update`;

    const modifyResponse: ModifyPageResponse = {
      success: false,
      pageError: undefined,
      statusCode: 200,
    };

    const data = JSON.stringify(pageToUpdate);

    const headers = getAuthorizationHeader();

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        modifyResponse.updatedPage = res.data ? (res.data as Page) : undefined;
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        let errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = 'Unknown error while updating page';
        }
        modifyResponse.pageError = errorMessage;
        return modifyResponse;
      });
  };

  updatePageOrder = async (pagesToUpdate: Page[]): Promise<ModifyPageResponse> => {
    const url = `/admin/pages/order`;

    const modifyResponse: ModifyPageResponse = {
      success: false,
      pageError: undefined,
      statusCode: 200,
    };

    const data = JSON.stringify(pagesToUpdate);

    const headers = getAuthorizationHeader();

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        modifyResponse.updatedPage = res.data ? (res.data as Page) : undefined;
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        let errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = 'Unknown error while updating page order';
        }
        modifyResponse.pageError = errorMessage;
        return modifyResponse;
      });
  };

  updateSiteSettings = async (
    settingsToUpdate: SiteSetting[],
  ): Promise<UpdateSettingResponse> => {
    const url = `/admin/settings/update`;

    const settingResponse: UpdateSettingResponse = {
      success: false,
      settingsError: undefined,
      statusCode: 200,
    };

    const data = JSON.stringify(settingsToUpdate);

    const headers = getAuthorizationHeader();

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        settingResponse.success = res.data;
        return settingResponse;
      })
      .catch((err) => {
        console.log(err);
        let errorMessage = '';
        if (err?.response?.status) {
          settingResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = 'Unknown error while updating site setting';
        }
        settingResponse.settingsError = errorMessage;
        return settingResponse;
      });
  };

  getAllVenues = async (searchTerm?: string): Promise<GetExternalVenuesResponse> => {
    let url = `/admin/venues`;
    if (searchTerm) {
      url += `?search=${encodeURIComponent(searchTerm)}`;
    }

    const venuesResponse: GetExternalVenuesResponse = {
      venues: undefined,
      venueError: undefined,
      statusCode: 200,
    };

    const headers = getAuthorizationHeader();

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        venuesResponse.venues = res.data ? (res.data as ExternalVenue[]) : undefined;
        return venuesResponse;
      })
      .catch((err) => {
        console.log(err);
        let errorMessage = '';
        if (err?.response?.status) {
          venuesResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching venues - please contact your administrator';
        }
        venuesResponse.venueError = errorMessage;
        return venuesResponse;
      });
  };

  getAllCountries = async (): Promise<GetCountriesResponse> => {
    const url = `/admin/countries`;

    const countryResponse: GetCountriesResponse = {
      countries: undefined,
      countryError: undefined,
      statusCode: 200,
    };

    const headers = getAuthorizationHeader();

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        countryResponse.countries = res.data ? (res.data as Country[]) : undefined;
        return countryResponse;
      })
      .catch((err) => {
        console.log(err);
        let errorMessage = '';
        if (err?.response?.status) {
          countryResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching countries - please contact your administrator';
        }
        countryResponse.countryError = errorMessage;
        return countryResponse;
      });
  };

  updateVenue = async (
    venueToUpdate: ExternalVenue,
  ): Promise<ModifyExternalVenueResponse> => {
    const url = `/admin/venues/edit`;

    const modifyResponse: ModifyExternalVenueResponse = {
      success: false,
      venueError: undefined,
      statusCode: 200,
    };

    const data = JSON.stringify(venueToUpdate);

    const headers = getAuthorizationHeader();

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        modifyResponse.updatedVenue = res.data ? (res.data as ExternalVenue) : undefined;
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        let errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = 'Unknown error while updating venue';
        }
        modifyResponse.venueError = errorMessage;
        return modifyResponse;
      });
  };

  deleteVenue = async (venueId: number): Promise<ModifyExternalVenueResponse> => {
    const url = '/admin/venues/delete';
    const headers = getAuthorizationHeader();

    const modifyResponse: ModifyExternalVenueResponse = {
      success: false,
      venueError: undefined,
      statusCode: 200,
      updatedVenue: undefined,
    };

    const data = {
      venueId: venueId,
    };

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        let errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while deleting venue - please contact your administrator';
        }
        modifyResponse.venueError = errorMessage;
        return modifyResponse;
      });
  };

  getTicketSocketAccounts = async (): Promise<GetTicketSocketAccountsResponse> => {
    const url = `/admin/ticketSocketAccounts`;

    const accountsResponse: GetTicketSocketAccountsResponse = {
      accounts: undefined,
      accountError: undefined,
      statusCode: 200,
    };

    const headers = getAuthorizationHeader();

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        accountsResponse.accounts = res.data
          ? (res.data as TicketSocketAccount[])
          : undefined;
        return accountsResponse;
      })
      .catch((err) => {
        console.log(err);
        let errorMessage = '';
        if (err?.response?.status) {
          accountsResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching ticket socket accounts - please contact your administrator';
        }
        accountsResponse.accountError = errorMessage;
        return accountsResponse;
      });
  };

  getSellers = async (): Promise<GetSellersResponse> => {
    const url = `/admin/sellers`;

    const sellersResponse: GetSellersResponse = {
      sellers: undefined,
      sellersError: undefined,
    };

    const headers = getAuthorizationHeader();

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
        let errorMessage = '';
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

  updateSeller = async (sellerToUpdate: Seller): Promise<ModifyExternalEventResponse> => {
    const url = `/admin/seller/update`;

    const modifyResponse: ModifySellerResponse = {
      success: false,
      sellerError: undefined,
      statusCode: 200,
    };

    const data = JSON.stringify(sellerToUpdate);

    const headers = getAuthorizationHeader();

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        modifyResponse.updatedSeller = res.data ? (res.data as Seller) : undefined;
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        let errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = 'Unknown error while updating seller';
        }
        modifyResponse.sellerError = errorMessage;
        return modifyResponse;
      });
  };
}

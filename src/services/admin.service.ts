import axios, { AxiosInstance } from 'axios';
import { Page, SiteSetting, UpdateSettingResponse } from '@/types/public';
import { getAuthorizationHeader } from '@/utils/getAuthorizationHeader';
import {
  ExternalVenue,
  GetExternalEventsResponse,
  GetExternalVenuesResponse,
  GetPagesResponse,
  GetTicketSocketAccountsResponse,
  ModifyExternalEventResponse,
  ModifyExternalVenueResponse,
  ModifyPageResponse,
  ModifySellerResponse,
  TicketSocketAccount,
} from '@/types/admin';
import {
  GetSellersResponse,
  Seller,
  VipEvent,
} from '@/types/event';

export class AdminService {
  protected readonly instance: AxiosInstance;

  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: 'Time out!',
    });
  }

  getAllPages = async (): Promise<GetPagesResponse> => {
    let url = `/admin/pages`;

    let pagesResponse: GetPagesResponse = {
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
        var errorMessage = '';
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

  updatePage = async (
    pageToUpdate: Page,
  ): Promise<ModifyPageResponse> => {
    let url = `/admin/pages/update`;

    let modifyResponse: ModifyPageResponse = {
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
        var errorMessage = '';
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

  updateSiteSettings = async (
    settingsToUpdate: SiteSetting[],
  ): Promise<UpdateSettingResponse> => {
    let url = `/admin/settings/update`;

    let settingResponse: UpdateSettingResponse = {
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
        var errorMessage = '';
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

  getAllVenues = async (): Promise<GetExternalVenuesResponse> => {
    let url = `/admin/venues`;

    let venuesResponse: GetExternalVenuesResponse = {
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
        var errorMessage = '';
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

  updateVenue = async (
    venueToUpdate: ExternalVenue,
  ): Promise<ModifyExternalVenueResponse> => {
    let url = `/admin/venues/edit`;

    let modifyResponse: ModifyExternalVenueResponse = {
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
        var errorMessage = '';
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

  deleteVenue = async (venueId: Number): Promise<ModifyExternalVenueResponse> => {
    const url = '/admin/venues/delete';
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyExternalVenueResponse = {
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
        var errorMessage = '';
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

  getExternalEvents = async (sellerId: number): Promise<GetExternalEventsResponse> => {
    let url = `/admin/external_events/${sellerId}`;

    let eventsResponse: GetExternalEventsResponse = {
      events: undefined,
      eventError: undefined,
      statusCode: 200,
    };

    const headers = getAuthorizationHeader();

    return this.instance
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        eventsResponse.events = res.data ? (res.data as VipEvent[]) : undefined;
        return eventsResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          eventsResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while fetching external events - please contact your administrator';
        }
        eventsResponse.eventError = errorMessage;
        return eventsResponse;
      });
  };

  getTicketSocketAccounts = async (): Promise<GetTicketSocketAccountsResponse> => {
    let url = `/admin/ticketSocketAccounts`;

    let accountsResponse: GetTicketSocketAccountsResponse = {
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
        var errorMessage = '';
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

  updateExternalEvent = async (
    sellerId: number,
    eventToUpdate: VipEvent,
  ): Promise<ModifyExternalEventResponse> => {
    let url = `/admin/external_events/update/${sellerId}`;

    let modifyResponse: ModifyExternalEventResponse = {
      success: false,
      eventError: undefined,
      statusCode: 200,
    };

    const data = JSON.stringify(eventToUpdate);

    const headers = getAuthorizationHeader();

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        modifyResponse.updatedEvent = res.data ? (res.data as VipEvent) : undefined;
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = 'Unknown error while updating external event';
        }
        modifyResponse.eventError = errorMessage;
        return modifyResponse;
      });
  };

  getSellers = async (): Promise<GetSellersResponse> => {
      let url = `/admin/sellers`;
  
      let sellersResponse: GetSellersResponse = {
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

  updateSeller = async (sellerToUpdate: Seller): Promise<ModifyExternalEventResponse> => {
    let url = `/admin/seller/update`;

    let modifyResponse: ModifySellerResponse = {
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
        var errorMessage = '';
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

  setExternalEventsInactive = async (
    eventIdList: number[],
    isActive: boolean,
  ): Promise<ModifyExternalEventResponse> => {
    const url = '/admin/external_events/setEventsInactive';
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyExternalEventResponse = {
      success: false,
      eventError: undefined,
      statusCode: 200,
    };

    const data = {
      eventIdList: eventIdList,
      isActive: isActive ? 1 : 0,
    };

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        if (!modifyResponse.success) {
          modifyResponse.eventError =
            'Unexpected error occurred while modifying external events - please contact your administrator';
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while modifying external events - please contact your administrator';
        }
        modifyResponse.eventError = errorMessage;
        return modifyResponse;
      });
  };

  setExternalEventsDeleted = async (
    eventIdList: number[],
  ): Promise<ModifyExternalEventResponse> => {
    const url = '/admin/external_events/setEventsDeleted';
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyExternalEventResponse = {
      success: false,
      eventError: undefined,
      statusCode: 200,
    };

    const data = {
      eventIdList: eventIdList,
    };

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        if (!modifyResponse.success) {
          modifyResponse.eventError =
            'Unexpected error occurred while modifying external events - please contact your administrator';
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while modifying external events - please contact your administrator';
        }
        modifyResponse.eventError = errorMessage;
        return modifyResponse;
      });
  };

  setExternalEventsHidden = async (
    eventIdList: number[],
    isHidden: boolean,
  ): Promise<ModifyExternalEventResponse> => {
    const url = '/admin/external_events/setEventsHidden';
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyExternalEventResponse = {
      success: false,
      eventError: undefined,
      statusCode: 200,
    };

    const data = {
      eventIdList: eventIdList,
      isHidden: isHidden ? 1 : 0,
    };

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        if (!modifyResponse.success) {
          modifyResponse.eventError =
            'Unexpected error occurred while modifying external events - please contact your administrator';
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while modifying external events - please contact your administrator';
        }
        modifyResponse.eventError = errorMessage;
        return modifyResponse;
      });
  };

  setExternalEventsCancelled = async (
    eventIdList: number[],
    isCancelled: boolean,
  ): Promise<ModifyExternalEventResponse> => {
    const url = '/admin/external_events/setEventsCancelled';
    const headers = getAuthorizationHeader();

    let modifyResponse: ModifyExternalEventResponse = {
      success: false,
      eventError: undefined,
      statusCode: 200,
    };

    const data = {
      eventIdList: eventIdList,
      isCancelled: isCancelled ? 1 : 0,
    };

    return this.instance
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        modifyResponse.success = res.status == 200;
        if (!modifyResponse.success) {
          modifyResponse.eventError =
            'Unexpected error occurred while modifying external events - please contact your administrator';
        }
        return modifyResponse;
      })
      .catch((err) => {
        console.log(err);
        var errorMessage = '';
        if (err?.response?.status) {
          modifyResponse.statusCode = parseInt(err.response.status);
        }
        if (err?.response?.data?.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage =
            'Unknown error while modifying external events - please contact your administrator';
        }
        modifyResponse.eventError = errorMessage;
        return modifyResponse;
      });
  };
}

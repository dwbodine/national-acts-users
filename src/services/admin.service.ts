import axios, { AxiosInstance } from 'axios';
import { SiteSetting, UpdateSettingResponse } from '@/types/public';
import { getAuthorizationHeader } from '@/utils/getAuthorizationHeader';
import {
  ExternalVenue,
  GetExternalVenuesResponse,
  ModifyExternalVenueResponse,
} from '@/types/admin';

export class AdminService {
  protected readonly instance: AxiosInstance;

  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: 'Time out!',
    });
  }

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
}

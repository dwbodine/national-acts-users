import axios, { AxiosInstance } from 'axios';
import { SiteSetting, UpdateSettingResponse } from '@/types/public';
import { getAuthorizationHeader } from '@/utils/getAuthorizationHeader';

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
}


export enum SiteSettingType {
    Image = "Image",
    Number = "Number",
    Text = "Text",
}

export interface SiteSetting {
    settingId: number;
    name: string;
    type: SiteSettingType;
    value: string;
    dirty?: boolean;
}

export interface GetSettingsResponse {
    settings?: SiteSetting[];
    settingsError?: string;
}

export interface UpdateSettingResponse {
    success: boolean;
    statusCode?: number;
    settingsError?: string;
    updatedSetting?: SiteSetting;
}
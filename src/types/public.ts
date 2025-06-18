export enum SiteSettingType {
  Image = 'Image',
  Number = 'Number',
  Text = 'Text',
}

export interface TimeZone {
  timezone: number;
  displayName: string;
}

export interface Country {
  countryId: number;
  countryName: string;
  countryCode: string;
  timezones?: TimeZone[];
}

export interface SiteSetting {
  settingId: number;
  name: string;
  displayName: string;
  type: SiteSettingType;
  value: string;
  filePath?: string;
  dirty?: boolean;
}

export interface PageType {
  pageTypeId: number;
  pageTypeName: string;
  pageTypeTemplate: string;
  pageTypeComponent?: string;
}

export interface PageSeller {
  pageSellerId: number;
  pageId: number;
  sellerId: number;
  displayName?: string;
  showDisplayName?: boolean;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: Country;
  phone?: string;
  email?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  spotify?: string;
  website?: string;
  websiteDisplayText?: string;
}

export interface Page {
  pageId: number;
  route: string;
  title: string;
  pageType: PageType;
  image?: string;
  thumbnail?: string;
  linkPreviewImage?: string;
  logoOnlyImage?: string;
  title1?: string;
  subtitle1?: string;
  title2?: string;
  subtitle2?: string;
  htmlText?: string;
  isActive: boolean;
  useIncludeDates?: boolean;
  includeStart?: string;
  includeEnd?: string;
  useExcludeDates?: boolean;
  excludeStart?: string;
  excludeEnd?: string;
  googleAnalyticsId?: string;
  pageOrder?: number;
  sellers?: PageSeller[];
}

export interface GetSettingsResponse {
  settings?: SiteSetting[];
  settingsError?: string;
}

export interface UpdateSettingResponse {
  success: boolean;
  statusCode?: number;
  settingsError?: string;
}

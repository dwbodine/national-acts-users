import type { IconProps } from '@rsuite/icons/Icon';
import { JSX, JSXElementConstructor, ReactElement } from 'react';

import { SpeakerProps } from './props';

export enum SiteSettingType {
  Image = 'Image',
  Number = 'Number',
  Text = 'Text',
}

export interface TimeZone {
  timezone: string;
  displayName?: string;
}

export interface Country {
  countryId: number;
  countryName?: string;
  countryCode?: string;
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

export type SpeakerRenderFn = (props: SpeakerProps, ref: React.Ref<HTMLDivElement>) => JSX.Element;

export interface FaqCategory {
  categoryId: number;
  categoryName?: string;
}

export interface Faq {
  faqId: number;
  category: FaqCategory;
  order: number;
  question: string;
  answer: string;
}

export interface PageType {
  pageTypeId: number;
  pageTypeName: string;
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
  lastUpdate?: string;
  sellers?: PageSeller[];
}

export interface NavItemData {
  eventKey: string;
  title: string;
  icon?: ReactElement<IconProps, string | JSXElementConstructor<unknown>>;
  to?: string;
  target?: string;
  children?: NavItemData[];
}

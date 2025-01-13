import { EventTabView } from "@/types/user";

export const MOBILE_WIDTH_BREAKPOINT: number = 590;
export const FULL_PAGE_CHART_BREAKPOINT: number = 1200;
export const MINIMUM_UNIX_TIMESTAMP: number = 1641013200;
export const EVENTS_AGENDA_VIEW_BREAKPOINT: number = 992;
export const DEFAULT_EVENT_TAB_VIEW = EventTabView.Month;

export enum ActivePageKey {
  Dashboard = 1,
  SalesOverview = 2,
  Admin = 3,
  Reports = 4,
  Users = 5,
  Events = 6,
}

import { ActivePageKey } from '@/constants';
import {
  IOrderKeys,
  IRevenueKeys,
  IShirtData,
  ITicketData,
  ITicketSalesData,
  Note,
  Seller,
  SellerType,
  TicketSocketRefreshHistory,
  VipEvent,
} from './event';
import { Country, PageSeller } from './public';
import {
  IAverageDailyData,
  IDashboardData,
  IDashboardTotals,
  ISalesData,
  ITopSeller,
  ITopSellingLocation,
  Role,
  UserActivityType,
} from './user';
import { DateRange, RangeType } from 'rsuite/esm/DateRangePicker';
import { Dispatch, SetStateAction } from 'react';

export interface EditProps {
  Id?: number;
}

export interface RefreshTicketSocketDataResultProps {
  UpdateResults?: TicketSocketRefreshHistory;
}

export interface RefreshTicketSocketHistoryTableProps {
  History?: TicketSocketRefreshHistory[];
}

export interface AdminFileUploadProps {
  Title?: string;
  CurrentFileTitle?: string;
  FileUploadName?: string;
  ShowRemoveButton?: boolean;
  CurrentFileName?: string;
  IsDirty?: boolean;
  BaseUrl?: string;
  OnUpload?: (fileUploadName: string, filename: string) => void;
  OnUploadStart?: () => void;
  OnUploadComplete?: (fileName?: string) => void;
  OnFileRemove?: () => void;
}

export interface AdminSellerSelectProps {
  Id: string;
  Sellers?: Seller[];
  Roles?: Role[];
  SellerId?: number;
  SellerType?: SellerType;
  RoleId?: number;
  Number?: number;
  PageSeller?: PageSeller;
  Countries?: Country[];
  OnSellerChange?: (sellerId: number | null) => void;
  OnRoleChange?: (roleId: number | null) => void;
  OnPageSellerChange?: (ps: PageSeller) => void;
  OnDelete?: () => void;
}

export interface AdminPageProps {
  ActiveKey: ActivePageKey;
  Title: string;
  UserActivity?: UserActivityType;
  DashboardComponent?: JSX.Element;
  EventsComponent?: JSX.Element;
  SalesComponent?: JSX.Element;
  AdminComponent?: JSX.Element;
  ReportComponent?: JSX.Element;
  UsersComponent?: JSX.Element;
}

export interface AdminTabsProps {
  ActiveKey: ActivePageKey;
  IsLoading: boolean;
  NotAdmin: boolean;
  DashboardComponent?: JSX.Element;
  EventsComponent?: JSX.Element;
  SalesComponent?: JSX.Element;
  AdminComponent?: JSX.Element;
  ReportComponent?: JSX.Element;
  UsersComponent?: JSX.Element;
}

export interface ConfirmationDialogProps {
  Message?: string;
  ConfirmText?: string;
  CancelText?: string;
  OnConfirm?: () => void;
  OnCancel?: () => void;
}

export interface DateRangeProp {
  label: string;
  value: Date[];
}

export interface DateRangeSelectorProps {
  DateRangeTitle?: string;
  SelectedStart?: number;
  SelectedEnd?: number;
  Disabled?: boolean;
  Ranges?: RangeType<DateRange>[];
  OnDateChange?: (selectedStart: number, selectedEnd: number) => void;
}

export interface EventDataExpandedProps {
  FocusControl?: string;
}

export interface EventRowProps {
  VipEvent: VipEvent;
  HideRevenue?: boolean;
  HideServiceFees?: boolean;
  ShowNotes?: boolean;
  CanCheckInTickets?: boolean;
  IsAdmin?: boolean;
  OnShowNoteDialog?: (eventId: number) => void;
}

export interface NavBarProps {
  Hidden?: boolean;
}

export interface PrintButtonProps {
  ShowPrint?: boolean;
}

export interface ReportDatePickerProps {
  Start?: number;
  End?: number;
  OnChange?: (start: number, end: number) => void;
  OnStartClear?: () => void;
  OnEndClear?: () => void;
}

export interface ResetButtonProps {
  IsDisabled?: boolean;
  OnResetClick?: () => void;
}

export interface TicketSalesChartProps {
  TicketSalesData?: ITicketSalesData[];
  ChartsHidden?: boolean;
  HideRevenue?: boolean;
  HideMobile?: boolean;
}

export interface RevenueWidgetProps {
  TotalRevenue?: number;
  TotalServiceFees?: number;
  HideServiceFees?: boolean;
}

export interface ShirtSizesWidgetProps {
  ShirtData?: IShirtData;
  TotalShirts?: number;
}

export interface ShowsListedWidgetProps {
  TotalShows?: number;
}

export interface TicketTypesWidgetProps {
  TicketData?: ITicketData;
  TotalTickets?: number;
  TicketsRefunded?: number;
  HideTicketBreakDown?: boolean;
  IsAdmin?: boolean;
}

export interface WidgetBarProps {
  TotalShows?: number;
  TotalTickets?: number;
  TotalRevenue?: number;
  TotalShirts?: number;
  TicketData?: ITicketData;
  ShirtData?: IShirtData;
  HideRevenue?: boolean;
  HideServiceFees?: boolean;
  TicketsRefunded?: number;
  TotalServiceFees?: number;
  HideTicketBreakDown?: boolean;
  IsAdmin?: boolean;
}

export interface ChartBarProps {
  TotalTickets?: number;
  TotalRevenue?: number;
  TotalShirts?: number;
  TotalOrders?: number;
  RevenueData?: IRevenueKeys[];
  OrderData?: IOrderKeys[];
  TicketData?: ITicketData;
  ShirtData?: IShirtData;
  ChartHidden?: boolean;
}

export interface OrderChartProps {
  OrderData?: IOrderKeys[];
  ChartHidden?: boolean;
  TotalOrders?: number;
}

export interface RevenueChartProps {
  RevenueData?: IRevenueKeys[];
  ChartHidden?: boolean;
  TotalRevenue?: number;
}

export interface ShirtSizesChartProps {
  ShirtData?: IShirtData;
  ChartHidden?: boolean;
  TotalShirts?: number;
}

export interface TicketTypesChartProps {
  TicketData?: ITicketData;
  ChartHidden?: boolean;
  TotalTickets?: number;
}

export interface AverageSalesWidgetProps {
  MonthlyAverages?: IAverageDailyData;
  YearlyAverages?: IAverageDailyData;
  SelectedYear?: number;
}

export interface MonthToDateWidgetProps {
  DashBoardData?: IDashboardData;
}

export interface RevenueGoalsWidgetProps {
  PercentGoal?: number;
  PercentTitle?: string;
  TotalGoal?: number;
  Amount?: number;
}

export interface SalesByAccountWidgetProps {
  AccountName?: string;
  AccountTotals?: ITicketSalesData;
  SelectedYear?: number;
}

export interface SalesPerDayOfWeekWidgetProps {
  SalesPerDayMonth?: ISalesData[];
  SalesPerDayYear?: ISalesData[];
  SelectedYear?: number;
}

export interface SalesPerMonthWidgetProps {
  SalesPerMonth?: ISalesData[];
  SelectedYear?: number;
}

export interface TopSellersWidgetProps {
  TopSellers?: ITopSeller[];
  DateRange?: string;
}

export interface TopSellingLocationsWidgetProps {
  TopSellingLocations?: ITopSellingLocation[];
  DateRange?: string;
  Title?: string;
}

export interface YearToDateWidgetProps {
  Totals?: IDashboardTotals;
  ProjectedYearTotalRevenue?: number;
  SelectedYear?: number;
}

export interface AgendaDayProps {
  AgendaDate?: moment.Moment;
  Events?: VipEvent[];
  Notes?: Note[];
  AgendaDayNumber?: number;
}

export interface AgendaViewProps {
  StartOfMonth?: moment.Moment;
  EndOfMonth?: moment.Moment;
  Events?: VipEvent[];
  Notes?: Note[];
}

export interface AddNoteModalProps {
  Id: string;
  NotesOpen?: boolean;
  DisplayDate?: string;
  NoteTitle?: string;
  NoteText?: string;
  HandleNotesClose?: () => void;
  SetNoteTitle?: Dispatch<SetStateAction<string>>;
  SetNoteText?: Dispatch<SetStateAction<string>>;
  AddNewNote?: () => void;
}

export interface EditNoteModalProps {
  Id: string;
  NotesOpen?: boolean;
  NoteIsCompleted?: boolean;
  DisplayDate?: string;
  NoteTitle?: string;
  NoteText?: string;
  NoteDate?: Date | null;
  HandleNotesClose?: () => void;
  SetNoteTitle?: Dispatch<SetStateAction<string>>;
  SetNoteText?: Dispatch<SetStateAction<string>>;
  EditNewNote?: () => void;
  EditNewNoteAndMarkComplete?: () => void;
  OnNoteDateChange?: (date: Date) => void;
}

export interface MonthDayProps {
  MonthDate?: moment.Moment;
  Events?: VipEvent[];
  Notes?: Note[];
  MonthDayNumber?: number;
}

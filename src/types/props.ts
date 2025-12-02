import { Country, NavItemData, PageSeller } from './public';
import { DateRange, RangeType } from 'rsuite/esm/DateRangePicker';
import { Dispatch, ReactElement, ReactNode, SetStateAction } from 'react';
import {
  IAverageDailyData,
  IDashboardData,
  IDashboardTotals,
  ISalesData,
  ITopSeller,
  ITopSellingLocation,
  Role,
  UserActivityType,
  UserSeller,
} from './user';
import {
  IShirtData,
  ITicketData,
  ITicketSalesData,
  Note,
  Order,
  Seller,
  SellerType,
  Ticket,
  TicketSocketRefreshHistory,
  TicketType,
  VipEvent,
} from './event';
import { CellProps } from 'rsuite';
import { ImageType } from '@/constants';

export interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

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
  ImageType: ImageType;
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
  Title: string;
  UserActivity?: UserActivityType;
  children: ReactNode;
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
  Disabled?: boolean;
  LabelColumnWidth?: number;
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
  RevenueRefunded?: number;
  ServiceFeesRefunded?: number;
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
  AgendaDate?: string;
  Events?: VipEvent[];
  Notes?: Note[];
  AgendaDayNumber?: number;
}

export interface AgendaViewProps {
  StartOfMonth?: string;
  EndOfMonth?: string;
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

export interface MonthViewProps {
  StartOfMonth?: string;
  EndOfMonth?: string;
  Events?: VipEvent[];
  Notes?: Note[];
}

export interface MonthDayProps {
  MonthDate?: string;
  Events?: VipEvent[];
  Notes?: Note[];
  MonthDayNumber?: number;
  WeekDayNumber?: number;
}

export interface MonthWeekProps {
  WeekDays?: ReactElement[];
}

export interface WeekDayProps {
  WeekDate?: string;
  Events?: VipEvent[];
  Notes?: Note[];
  WeekDayNumber?: number;
}

export interface WeekViewProps {
  StartOfWeek?: string;
  Events?: VipEvent[];
  Notes?: Note[];
}

export interface ExpandCellProps extends CellProps<VipEvent> {
  expandedrowkeys?: number[];
}

export interface AttendeeRowProps {
  Ticket?: Ticket;
  CanCheckInTickets?: boolean;
}

export interface OrderRowProps {
  TicketTypes?: TicketType[];
  EventDate?: string;
  EventName?: string;
  Order?: Order;
  HasPhoneData?: boolean;
  HideRevenue?: boolean;
  HideServiceFees?: boolean;
  CanCheckInTickets?: boolean;
  ShowOnlyEmails?: boolean;
  ShowOnlyPhones?: boolean;
  IsAdmin?: boolean;
}

export interface SpeakerProps {
  onClose: () => void;
  left?: number;
  top?: number;
  className?: string;
}

export interface CustomToolTipParamsPayload {
  value?: string;
}

export interface CustomToolTipParams {
  active?: boolean;
  payload?: CustomToolTipParamsPayload[];
  label?: string;
}

export interface VIPModalProps {
  IsOpen?: boolean;
  Seller?: UserSeller;
  SellerHomePage?: string;
  Events?: VipEvent[];
  IsAdmin?: boolean;
  OnClose?: () => void;
}

export interface VipHtmlProps {
  PdfHtml?: string;
}

export interface FrameProps {
  children?: React.ReactNode;
}

export interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  expanded: boolean;
}

export interface ResponsiveFrameProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Brand: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Content: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Header: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  NavToggle: any;
  navs?: NavItemData[];
  children?: React.ReactNode;
  IsLoading: boolean;
  IsAdmin?: boolean;
}

export interface RenderNavProps {
  isMobile?: boolean;
  navs?: NavItemData[];
  onItemClick?: () => void;
}

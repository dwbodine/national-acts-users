/* eslint-disable simple-import-sort/imports */

import { describe, expect, it } from 'vitest';

import adminDataReducer, {
  resetAdminData,
  setAdminEvents as setAdminDataEvents,
  setAdminOrders,
  setAllFaqCategories,
  setAllFaqs,
  setAllPages,
  setPageOrders,
  setTicketSocketEventsOnly,
  setTours as setAdminDataTours,
  setVenues,
} from './adminDataSelectionSlice';
import adminEventsReducer, {
  resetAdminSelection,
  resetAllAdminEvents,
  setActiveEventTab,
  setAdminDateRange,
  setAdminEvents,
  setAdminNotes,
  setExpandedEvent,
  setExpandedRow,
  setFocusControl as setAdminEventsFocusControl,
  setReloadAdminEvents,
  setShowDeleted as setAdminEventsShowDeleted,
  setShowHidden as setAdminEventsShowHidden,
  setShowInactive as setAdminEventsShowInactive,
  setUpdateListStatus,
} from './adminEventsSelectionSlice';
import adminReportsReducer, {
  resetAdminReports,
  setReloadReportData,
  setReportDates,
} from './adminReportsSelectionSlice';
import adminReducer, {
  adminSelectionSlice,
  resetAdmin,
  setAdminDates,
  setAdminEvent,
  setAdminOrder,
  setAdminSeller,
  setAdminSellerId,
  setAdminTour,
  setAdminVenue,
  setAllSellers,
  setAllSettings,
  setCountries,
  setMustSaveEvent,
  setMustSaveOrder,
  setMustSavePage,
  setPageSellerTypes,
  setPageTypes,
  setReloadCountries,
  setReloadEvents as setReloadAdminEventsFlag,
  setReloadFaqs,
  setReloadPages,
  setReloadRoles,
  setReloadSellerPages,
  setReloadSellers,
  setReloadSettings,
  setReloadTours,
  setReloadUsers,
  setReloadVenues,
  setRoles,
  setSelectedFaq,
  setSelectedFaqCategory,
  setSelectedPage,
  setSelectedPageType,
  setSelectedRole,
  setSelectedUser,
  setTicketSocketAccounts,
  setUsers,
  setVenueSearchTerm,
} from './adminSelectionSlice';
import dashboardReducer, {
  resetDashboard,
  setCurrentDashboardData,
  setDashboardDateRange,
  setReloadDashboardOrders,
} from './dashboardSelectionSlice';
import globalReducer, {
  resetGlobalSettings,
  setIsLoading,
  setSaveInProgress,
} from './globalSelectionSlice';
import reportReducer, {
  resetAll,
  resetSelection,
  setDateRange,
  setEventSeller,
  setEvents,
  setFocusControl,
  setForAdmin,
  setHideOrderRevenue,
  setHideOrderServiceFees,
  setHideRevenue,
  setHideServiceFees,
  setReloadEvents,
  setSelectedTourId,
  setSeller,
  setShowDeleted,
  setShowDeletedOrders,
  setShowHidden,
  setShowInactive,
  setShowInactiveOrders,
  setShowOnlyEmails,
  setShowOnlyPhones,
  setTours,
} from './reportSelectionSlice';
import userActivityReducer, {
  resetUserActivity,
  setCurrentActivities,
  setCurrentLogins,
  setFilterAdmins,
  setReloadActivities,
  setUserActivityDateRange,
} from './userActivitySelectionSlice';

const item = (id: number) => ({ id, name: `item-${id}` }) as never;
const seller = (sellerId: number) =>
  ({
    sellerId,
    sellerName: `Seller ${sellerId}`,
    sellerType: 0,
  }) as never;

// remaining file unchanged

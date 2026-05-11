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

describe('adminDataSelectionSlice', () => {
  it('sets and resets cached admin data', () => {
    let state = adminDataReducer(undefined, setAdminDataEvents([item(1)]));
    state = adminDataReducer(state, setAdminOrders([item(2)]));
    state = adminDataReducer(state, setAllFaqCategories([item(3)]));
    state = adminDataReducer(state, setAllFaqs([item(4)]));
    state = adminDataReducer(state, setAllPages([item(5)]));
    state = adminDataReducer(state, setPageOrders([item(6)]));
    state = adminDataReducer(state, setTicketSocketEventsOnly([item(7)]));
    state = adminDataReducer(state, setAdminDataTours([item(8)]));
    state = adminDataReducer(state, setVenues([item(9)]));

    expect(state).toEqual(
      expect.objectContaining({
        allFaqs: [item(4)],
        allPages: [item(5)],
        events: [item(1)],
        faqCategories: [item(3)],
        orders: [item(2)],
        pageOrders: [item(6)],
        ticketSocketEvents: [item(7)],
        tours: [item(8)],
        venues: [item(9)],
      }),
    );

    expect(adminDataReducer(state, resetAdminData())).toEqual({
      allFaqs: undefined,
      allPages: undefined,
      events: undefined,
      faqCategories: undefined,
      orders: undefined,
      pageOrders: undefined,
      ticketSocketEvents: undefined,
      tours: undefined,
      venues: undefined,
    });
  });
});

describe('adminEventsSelectionSlice', () => {
  it('updates event filters, expansion, notes, and reset states', () => {
    let state = adminEventsReducer(undefined, setActiveEventTab('agenda' as never));
    state = adminEventsReducer(
      state,
      setAdminDateRange({ end: 20, periodStart: 5, start: 10 } as never),
    );
    state = adminEventsReducer(state, setAdminEvents([item(1)]));
    state = adminEventsReducer(state, setAdminNotes([item(2)]));
    state = adminEventsReducer(state, setExpandedEvent(item(3)));
    state = adminEventsReducer(state, setExpandedRow(4));
    state = adminEventsReducer(state, setAdminEventsFocusControl('event-search'));
    state = adminEventsReducer(state, setReloadAdminEvents(false));
    state = adminEventsReducer(state, setAdminEventsShowDeleted(true));
    state = adminEventsReducer(state, setAdminEventsShowHidden(true));
    state = adminEventsReducer(state, setAdminEventsShowInactive(false));
    state = adminEventsReducer(state, setUpdateListStatus(true));

    expect(state).toEqual(
      expect.objectContaining({
        currentEvents: [item(1)],
        end: 20,
        eventTabView: 'agenda',
        expandedEvent: item(3),
        expandedRow: 4,
        focusControl: 'event-search',
        notes: [item(2)],
        periodStart: 5,
        reloadEvents: true,
        showDeleted: true,
        showHidden: true,
        showInactive: false,
        start: 10,
        updateListStatus: true,
      }),
    );
    expect(adminEventsReducer(state, setAdminNotes(undefined))).toEqual(
      expect.objectContaining({ notes: [] }),
    );
    expect(adminEventsReducer(state, resetAdminSelection())).toEqual(
      expect.objectContaining({
        currentEvents: undefined,
        end: undefined,
        eventTabView: undefined,
        expandedEvent: undefined,
        expandedRow: undefined,
        focusControl: '',
        reloadEvents: true,
        showDeleted: false,
        showHidden: false,
        showInactive: false,
        start: undefined,
        updateListStatus: false,
      }),
    );
    expect(adminEventsReducer(state, resetAllAdminEvents())).toEqual(
      expect.objectContaining({
        currentEvents: undefined,
        end: undefined,
        eventTabView: undefined,
        expandedEvent: undefined,
        expandedRow: undefined,
        focusControl: '',
        reloadEvents: true,
        showDeleted: false,
        showHidden: false,
        showInactive: false,
        start: undefined,
        updateListStatus: false,
      }),
    );
  });
});

describe('adminReportsSelectionSlice', () => {
  it('updates dates, reload flags, and reset dates', () => {
    let state = adminReportsReducer(undefined, setReportDates({ end: 200, start: 100 } as never));
    state = adminReportsReducer(state, setReloadReportData(false));

    expect(state).toEqual(expect.objectContaining({ end: 200, reloadData: false, start: 100 }));

    const resetState = adminReportsReducer(state, resetAdminReports());

    expect(resetState.reloadData).toBe(true);
    expect(resetState.start).toEqual(expect.any(Number));
    expect(resetState.end).toEqual(expect.any(Number));
  });
});

describe('adminSelectionSlice', () => {
  it('sets selected admin data and reload flags', () => {
    let state = adminReducer(undefined, setAdminDates({ end: 2, start: 1 } as never));
    state = adminReducer(state, setAdminSellerId(9));
    state = adminReducer(state, setAdminEvent(item(1)));
    state = adminReducer(state, setAdminOrder(item(2)));
    state = adminReducer(state, setAdminSeller(item(3)));
    state = adminReducer(state, setAdminTour(item(4)));
    state = adminReducer(state, setAdminVenue(item(5)));
    state = adminReducer(state, setSelectedFaqCategory(6));
    state = adminReducer(state, setAllSellers([item(7)]));
    state = adminReducer(state, setAllSettings([item(8)]));
    state = adminReducer(state, setCountries([item(9)]));
    state = adminReducer(state, setMustSaveEvent(true));
    state = adminReducer(state, setMustSaveOrder(true));
    state = adminReducer(state, setMustSavePage(true));
    state = adminReducer(state, setPageSellerTypes([item(10)]));
    state = adminReducer(state, setPageTypes([item(11)]));
    state = adminReducer(state, setReloadCountries(false));
    state = adminReducer(state, setReloadAdminEventsFlag(false));
    state = adminReducer(state, setReloadSellerPages(false));
    state = adminReducer(state, setTicketSocketAccounts([item(12)]));
    state = adminReducer(state, setSelectedFaq(item(13)));
    state = adminReducer(state, setSelectedPage(item(14)));
    state = adminReducer(state, setSelectedPageType(item(15)));
    state = adminReducer(state, setSelectedRole(item(16)));
    state = adminReducer(state, setSelectedUser(item(17)));
    state = adminReducer(state, adminSelectionSlice.actions.setUploadedFile('poster.png'));
    state = adminReducer(state, setVenueSearchTerm('Austin'));
    state = adminReducer(state, setRoles([item(18)]));
    state = adminReducer(state, setUsers([item(19)]));

    expect(state).toEqual(
      expect.objectContaining({
        allSellers: [item(7)],
        allSettings: [item(8)],
        countries: [item(9)],
        end: undefined,
        mustSaveEvent: true,
        mustSaveOrder: true,
        mustSavePage: true,
        pageSellerTypes: [item(10)],
        pageTypes: [item(11)],
        reloadCountries: false,
        reloadEvents: false,
        reloadPageSellers: false,
        reloadRoles: false,
        reloadUsers: false,
        roles: [item(18)],
        selectedEvent: item(1),
        selectedFaq: item(13),
        selectedFaqCategory: 6,
        selectedOrder: item(2),
        selectedPage: item(14),
        selectedPageType: item(15),
        selectedRole: item(16),
        selectedSeller: item(3),
        selectedTour: item(4),
        selectedUser: item(17),
        selectedVenue: item(5),
        sellerId: 9,
        start: undefined,
        ticketSocketAccounts: [item(12)],
        uploadedFile: 'poster.png',
        users: [item(19)],
        venueSearchTerm: 'Austin',
      }),
    );
  });

  it('clears dependent selections when reload flags are enabled', () => {
    let state = adminReducer(undefined, setSelectedFaq(item(1)));
    state = adminReducer(state, setSelectedPage(item(2)));
    state = adminReducer(state, setSelectedRole(item(3)));
    state = adminReducer(state, setRoles([item(4)]));
    state = adminReducer(state, setAdminSeller(item(5)));
    state = adminReducer(state, setAllSettings([item(6)]));
    state = adminReducer(state, setAdminTour(item(7)));
    state = adminReducer(state, setSelectedUser(item(8)));
    state = adminReducer(state, setUsers([item(9)]));
    state = adminReducer(state, setAdminVenue(item(10)));
    state = adminReducer(state, setReloadFaqs(true));
    state = adminReducer(state, setReloadPages(true));
    state = adminReducer(state, setReloadRoles(true));
    state = adminReducer(state, setReloadSellers(true));
    state = adminReducer(state, setReloadSettings(true));
    state = adminReducer(state, setReloadTours(true));
    state = adminReducer(state, setReloadUsers(true));
    state = adminReducer(state, setReloadVenues(true));

    expect(state).toEqual(
      expect.objectContaining({
        allSettings: undefined,
        reloadFaqs: true,
        reloadPages: true,
        reloadRoles: true,
        reloadSellers: true,
        reloadSettings: true,
        reloadTours: true,
        reloadUsers: true,
        reloadVenues: true,
        roles: undefined,
        selectedFaq: undefined,
        selectedPage: undefined,
        selectedRole: undefined,
        selectedSeller: undefined,
        selectedTour: undefined,
        selectedUser: undefined,
        selectedVenue: undefined,
        users: undefined,
      }),
    );
  });

  it('preserves selections when reload flags are disabled and resets everything on resetAdmin', () => {
    let state = adminReducer(undefined, setSelectedFaq(item(1)));
    state = adminReducer(state, setSelectedPage(item(2)));
    state = adminReducer(state, setSelectedRole(item(3)));
    state = adminReducer(state, setRoles([item(4)]));
    state = adminReducer(state, setAdminSeller(item(5)));
    state = adminReducer(state, setAllSettings([item(6)]));
    state = adminReducer(state, setAdminTour(item(7)));
    state = adminReducer(state, setSelectedUser(item(8)));
    state = adminReducer(state, setUsers([item(9)]));
    state = adminReducer(state, setAdminVenue(item(10)));
    state = adminReducer(state, setReloadFaqs(false));
    state = adminReducer(state, setReloadPages(false));
    state = adminReducer(state, setReloadRoles(false));
    state = adminReducer(state, setReloadSellers(false));
    state = adminReducer(state, setReloadSettings(false));
    state = adminReducer(state, setReloadTours(false));
    state = adminReducer(state, setReloadUsers(false));
    state = adminReducer(state, setReloadVenues(false));

    expect(state).toEqual(
      expect.objectContaining({
        allSettings: [item(6)],
        reloadFaqs: false,
        reloadPages: false,
        reloadRoles: false,
        reloadSellers: false,
        reloadSettings: false,
        reloadTours: false,
        reloadUsers: false,
        reloadVenues: false,
        roles: [item(4)],
        selectedFaq: item(1),
        selectedPage: item(2),
        selectedRole: item(3),
        selectedSeller: item(5),
        selectedTour: item(7),
        selectedUser: item(8),
        selectedVenue: item(10),
        users: [item(9)],
      }),
    );

    expect(adminReducer(state, resetAdmin())).toEqual(
      expect.objectContaining({
        allSellers: undefined,
        allSettings: undefined,
        end: undefined,
        mustSaveEvent: false,
        mustSaveOrder: false,
        mustSavePage: false,
        pageSellerTypes: undefined,
        pageTypes: undefined,
        reloadEvents: true,
        reloadFaqs: true,
        reloadPageSellers: true,
        reloadRoles: true,
        reloadSellers: true,
        reloadSettings: true,
        reloadTours: true,
        reloadUsers: true,
        reloadVenues: true,
        roles: undefined,
        selectedEvent: undefined,
        selectedFaq: undefined,
        selectedOrder: undefined,
        selectedPage: undefined,
        selectedPageType: undefined,
        selectedRole: undefined,
        selectedSeller: undefined,
        selectedTour: undefined,
        selectedUser: undefined,
        selectedVenue: undefined,
        sellerId: undefined,
        start: undefined,
        uploadedFile: undefined,
        users: undefined,
        venueSearchTerm: undefined,
      }),
    );
  });
});

describe('dashboardSelectionSlice', () => {
  it('updates dashboard state and resets it', () => {
    let state = dashboardReducer(undefined, setDashboardDateRange({ end: 20, start: 10 } as never));
    state = dashboardReducer(state, setCurrentDashboardData(item(1)));
    state = dashboardReducer(state, setReloadDashboardOrders(false));

    expect(state).toEqual(
      expect.objectContaining({
        currentDashboardData: item(1),
        end: 20,
        reloadOrders: false,
        start: 10,
      }),
    );

    const resetState = dashboardReducer(state, resetDashboard());

    expect(resetState).toEqual(
      expect.objectContaining({
        currentDashboardData: undefined,
        dashboardTotals: undefined,
        reloadOrders: true,
      }),
    );
    expect(resetState.start).toEqual(expect.any(Number));
    expect(resetState.end).toEqual(expect.any(Number));
  });
});

describe('globalSelectionSlice', () => {
  it('updates loading and saving flags', () => {
    let state = globalReducer(undefined, setIsLoading(true));
    state = globalReducer(state, setSaveInProgress(true));

    expect(state).toEqual({ isLoading: true, saveInProgress: true });
    expect(globalReducer(state, resetGlobalSettings())).toEqual({
      isLoading: false,
      saveInProgress: true,
    });
  });
});

describe('reportSelectionSlice', () => {
  it('updates report filters and display preferences', () => {
    let state = reportReducer(undefined, setForAdmin(true));
    state = reportReducer(state, setDateRange({ end: 20, start: 10 } as never));
    state = reportReducer(
      state,
      setEventSeller({
        hideRevenue: false,
        hideServiceFees: false,
        seller: seller(1),
      } as never),
    );
    state = reportReducer(state, setEvents([item(1)]));
    state = reportReducer(state, setFocusControl('seller'));
    state = reportReducer(state, setHideRevenue(false));
    state = reportReducer(state, setHideServiceFees(false));
    state = reportReducer(state, setHideOrderRevenue(false));
    state = reportReducer(state, setHideOrderServiceFees(false));
    state = reportReducer(state, setReloadEvents(false));
    state = reportReducer(state, setShowDeletedOrders(true));
    state = reportReducer(state, setShowInactiveOrders(false));
    state = reportReducer(state, setShowOnlyEmails(true));
    state = reportReducer(state, setShowOnlyPhones(true));
    state = reportReducer(state, setTours([item(2)]));

    expect(state).toEqual(
      expect.objectContaining({
        currentEvents: [item(1)],
        end: 20,
        focusControl: 'seller',
        hideOrderRevenue: false,
        hideOrderServiceFees: false,
        hideRevenue: false,
        hideServiceFees: false,
        isForAdmin: true,
        reloadEvents: false,
        reloadTours: false,
        seller: seller(1),
        showDeletedOrders: true,
        showHidden: true,
        showInactiveOrders: false,
        showOnlyEmails: true,
        showOnlyPhones: true,
        start: 10,
        tours: [item(2)],
      }),
    );
  });

  it('handles event reload and hidden revenue branches', () => {
    let state = reportReducer(undefined, setEvents(undefined));

    expect(state.currentEvents).toEqual([]);
    expect(state.reloadEvents).toBe(true);

    state = reportReducer(state, setHideRevenue(true));
    expect(state.hideServiceFees).toBe(true);

    state = reportReducer(state, setHideOrderRevenue(true));
    expect(state.hideOrderServiceFees).toBe(true);

    state = reportReducer(state, setReloadEvents(true));
    expect(state.currentEvents).toBeUndefined();
    expect(state.hideOrderRevenue).toBe(true);
  });

  it('handles seller changes, unchanged sellers, date retention, tours, and resets', () => {
    let state = reportReducer(undefined, setForAdmin(true));
    state = reportReducer(state, setSeller(seller(2)));

    expect(state).toEqual(
      expect.objectContaining({
        currentEvents: [],
        reloadEvents: true,
        reloadTours: true,
        selectedTourId: undefined,
        seller: seller(2),
        showHidden: true,
        showInactiveOrders: true,
        tours: undefined,
      }),
    );

    state = reportReducer(state, setEvents([item(1)]));
    state = reportReducer(state, setTours([item(2)]));
    state = reportReducer(state, setSeller(seller(2)));

    expect(state).toEqual(
      expect.objectContaining({
        currentEvents: [item(1)],
        reloadEvents: false,
        reloadTours: false,
        tours: [item(2)],
      }),
    );

    state = { ...state, retainDateSelection: true, start: 100, end: 200 };
    state = reportReducer(state, setShowDeleted(true));
    state = reportReducer(state, setShowHidden(true));
    state = reportReducer(state, setShowInactive(true));
    expect(state).toEqual(expect.objectContaining({ end: 200, start: 100 }));

    state = { ...state, retainDateSelection: false, start: 100, end: 200 };
    state = reportReducer(state, setShowDeleted(false));
    state = reportReducer(state, setShowHidden(false));
    state = reportReducer(state, setShowInactive(false));
    expect(state).toEqual(
      expect.objectContaining({
        end: 0,
        reloadEvents: true,
        showDeleted: false,
        showHidden: false,
        showInactive: false,
        start: 0,
      }),
    );

    state = reportReducer(state, setSelectedTourId(7));
    expect(state).toEqual(
      expect.objectContaining({
        end: undefined,
        selectedTourId: 7,
        showDeleted: false,
        showHidden: false,
        showInactive: false,
        start: undefined,
      }),
    );

    expect(reportReducer(state, resetSelection())).toEqual(
      expect.objectContaining({
        currentEvents: [],
        end: 0,
        reloadEvents: true,
        reloadTours: true,
        selectedTourId: undefined,
        showDeleted: false,
        showHidden: true,
        showInactive: false,
        showOnlyEmails: false,
        showOnlyPhones: false,
        start: 0,
        tours: undefined,
      }),
    );
    expect(reportReducer(state, resetAll())).toEqual(
      expect.objectContaining({
        currentEvents: [],
        end: 0,
        hideOrderRevenue: true,
        hideRevenue: true,
        hideServiceFees: true,
        reloadEvents: true,
        reloadTours: true,
        selectedTourId: undefined,
        showDeleted: false,
        showHidden: true,
        showInactive: false,
        showOnlyEmails: false,
        showOnlyPhones: false,
        start: 0,
        tours: undefined,
      }),
    );
  });
});

describe('userActivitySelectionSlice', () => {
  it('updates user activity filters and resets them', () => {
    let state = userActivityReducer(
      undefined,
      setUserActivityDateRange({ end: 20, start: 10 } as never),
    );
    state = userActivityReducer(state, setCurrentActivities([item(1)]));
    state = userActivityReducer(state, setCurrentLogins(5));
    state = userActivityReducer(state, setFilterAdmins(false));
    state = userActivityReducer(state, setReloadActivities(false));

    expect(state).toEqual(
      expect.objectContaining({
        currentActivities: [item(1)],
        currentLogins: 5,
        end: 20,
        filterAdmins: false,
        reloadActivities: false,
        start: 10,
      }),
    );

    expect(userActivityReducer(state, setCurrentActivities(undefined as never))).toEqual(
      expect.objectContaining({ currentActivities: [] }),
    );
    expect(userActivityReducer(state, resetUserActivity())).toEqual({
      currentActivities: [],
      currentLogins: 0,
      end: undefined,
      filterAdmins: true,
      reloadActivities: true,
      start: undefined,
    });
  });
});

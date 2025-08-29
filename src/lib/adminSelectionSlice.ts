import { AdminSelection, Role, User } from '../types/user';
import { Country, Faq, FaqCategory, Page, PageType, SiteSetting } from '@/types/public';
import { ExternalVenue, TicketSocketAccount } from '@/types/admin';
import { Order, Seller, Tour, VipEvent } from '@/types/event';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: AdminSelection = {
  allFaqs: undefined,
  allPages: undefined,
  allSellers: undefined,
  allSettings: undefined,
  countries: undefined,
  end: undefined,
  events: undefined,
  faqCategories: undefined,
  mustSaveEvent: false,
  mustSaveOrder: false,
  mustSavePage: false,
  orders: undefined,
  pageOrders: undefined,
  pageTypes: undefined,
  reloadCountries: true,
  reloadEvents: true,
  reloadFaqs: true,
  reloadPages: true,
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
  ticketSocketAccounts: undefined,
  tours: undefined,
  uploadedFile: undefined,
  users: undefined,
  venueSearchTerm: undefined,
  venues: undefined,
};

export const adminSelectionSlice = createSlice({
  initialState,
  name: 'adminSelection',
  reducers: {
    resetAdmin: (state) => {
      state.sellerId = undefined;
      state.start = undefined;
      state.end = undefined;
      state.reloadFaqs = true;
      state.reloadUsers = true;
      state.reloadRoles = true;
      state.reloadEvents = true;
      state.reloadPages = true;
      state.reloadTours = true;
      state.reloadSellers = true;
      state.reloadVenues = true;
      state.selectedFaq = undefined;
      state.selectedUser = undefined;
      state.selectedPage = undefined;
      state.selectedPageType = undefined;
      state.selectedRole = undefined;
      state.selectedEvent = undefined;
      state.selectedOrder = undefined;
      state.selectedSeller = undefined;
      state.selectedTour = undefined;
      state.selectedVenue = undefined;
      state.pageOrders = undefined;
      state.pageTypes = undefined;
      state.roles = undefined;
      state.users = undefined;
      state.events = undefined;
      state.allPages = undefined;
      state.allFaqs = undefined;
      state.ticketSocketEvents = undefined;
      state.tours = undefined;
      state.venues = undefined;
      state.mustSaveEvent = false;
      state.mustSaveOrder = false;
      state.mustSavePage = false;
      state.allSellers = undefined;
      state.allSettings = undefined;
      state.reloadSettings = true;
      state.uploadedFile = undefined;
      state.reloadSellers = true;
      state.orders = undefined;
      state.venueSearchTerm = undefined;
      return state;
    },
    setAdminDates: (state, action: PayloadAction<AdminSelection>) => {
      state.start = action.payload.start;
      state.end = action.payload.end;
      return state;
    },
    setAdminEvent: (state, action: PayloadAction<VipEvent | undefined>) => {
      state.selectedEvent = action.payload;
      return state;
    },
    setAdminEvents: (state, action: PayloadAction<VipEvent[]>) => {
      state.events = action.payload;
      state.selectedEvent = undefined;
      state.selectedOrder = undefined;
      state.reloadEvents = false;
      return state;
    },
    setAdminOrder: (state, action: PayloadAction<Order | undefined>) => {
      state.selectedOrder = action.payload;
      return state;
    },
    setAdminOrders: (state, action: PayloadAction<Order[] | undefined>) => {
      state.orders = action.payload;
      return state;
    },
    setAdminSeller: (state, action: PayloadAction<Seller | undefined>) => {
      state.selectedSeller = action.payload;
      return state;
    },
    setAdminSellerId: (state, action: PayloadAction<number | undefined>) => {
      state.sellerId = action.payload;
      return state;
    },
    setAdminTour: (state, action: PayloadAction<Tour | undefined>) => {
      state.selectedTour = action.payload;
      state.start = undefined;
      state.end = undefined;
      return state;
    },
    setAdminVenue: (state, action: PayloadAction<ExternalVenue | undefined>) => {
      state.selectedVenue = action.payload;
      return state;
    },
    setAllFaqCategories: (state, action: PayloadAction<FaqCategory[] | undefined>) => {
      state.faqCategories = action.payload;
      return state;
    },
    setAllFaqs: (state, action: PayloadAction<Faq[] | undefined>) => {
      state.allFaqs = action.payload;
      return state;
    },
    setAllPages: (state, action: PayloadAction<Page[] | undefined>) => {
      state.allPages = action.payload;
      return state;
    },
    setAllSellers: (state, action: PayloadAction<Seller[] | undefined>) => {
      state.allSellers = action.payload;
      return state;
    },
    setAllSettings: (state, action: PayloadAction<SiteSetting[] | undefined>) => {
      state.allSettings = action.payload;
      return state;
    },
    setCountries: (state, action: PayloadAction<Country[]>) => {
      state.countries = action.payload;
      return state;
    },
    setMustSaveEvent: (state, action: PayloadAction<boolean>) => {
      state.mustSaveEvent = action.payload;
      return state;
    },
    setMustSaveOrder: (state, action: PayloadAction<boolean>) => {
      state.mustSaveOrder = action.payload;
      return state;
    },
    setMustSavePage: (state, action: PayloadAction<boolean>) => {
      state.mustSavePage = action.payload;
      return state;
    },
    setPageOrders: (state, action: PayloadAction<Map<number, Page>>) => {
      state.pageOrders = action.payload;
      return state;
    },
    setPageTypes: (state, action: PayloadAction<PageType[]>) => {
      state.pageTypes = action.payload;
      return state;
    },
    setReloadCountries: (state, action: PayloadAction<boolean>) => {
      state.reloadCountries = action.payload;
      return state;
    },
    setReloadEvents: (state, action: PayloadAction<boolean>) => {
      state.reloadEvents = action.payload;
      return state;
    },
    setReloadFaqs: (state, action: PayloadAction<boolean>) => {
      state.reloadFaqs = action.payload;
      if (state.reloadFaqs) {
        state.selectedFaq = undefined;
        state.allFaqs = undefined;
      }
      return state;
    },
    setReloadPages: (state, action: PayloadAction<boolean>) => {
      state.reloadPages = action.payload;
      if (state.reloadPages) {
        state.selectedPage = undefined;
        state.allPages = undefined;
      }
      return state;
    },
    setReloadRoles: (state, action: PayloadAction<boolean>) => {
      state.reloadRoles = action.payload;
      if (state.reloadRoles) {
        state.selectedRole = undefined;
        state.roles = undefined;
      }
      return state;
    },
    setReloadSellers: (state, action: PayloadAction<boolean>) => {
      state.reloadSellers = action.payload;
      if (state.reloadSellers) {
        state.selectedSeller = undefined;
      }
      return state;
    },
    setReloadSettings: (state, action: PayloadAction<boolean>) => {
      state.reloadSettings = action.payload;
      if (state.reloadSettings) {
        state.allSettings = undefined;
      }
      return state;
    },
    setReloadTours: (state, action: PayloadAction<boolean>) => {
      state.reloadTours = action.payload;
      if (state.reloadTours) {
        state.selectedTour = undefined;
        state.tours = undefined;
      }
      return state;
    },
    setReloadUsers: (state, action: PayloadAction<boolean>) => {
      state.reloadUsers = action.payload;
      if (state.reloadUsers) {
        state.selectedUser = undefined;
        state.users = undefined;
      }
      return state;
    },
    setReloadVenues: (state, action: PayloadAction<boolean>) => {
      state.reloadVenues = action.payload;
      if (state.reloadVenues) {
        state.selectedVenue = undefined;
        state.venues = undefined;
      }
      return state;
    },
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
      state.reloadRoles = false;
      return state;
    },
    setSelectedFaq: (state, action: PayloadAction<Faq>) => {
      state.selectedFaq = action.payload;
      return state;
    },
    setSelectedPage: (state, action: PayloadAction<Page>) => {
      state.selectedPage = action.payload;
      return state;
    },
    setSelectedPageType: (state, action: PayloadAction<PageType>) => {
      state.selectedPageType = action.payload;
      return state;
    },
    setSelectedRole: (state, action: PayloadAction<Role>) => {
      state.selectedRole = action.payload;
      return state;
    },
    setSelectedUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload;
      return state;
    },
    setTicketSocketAccounts: (state, action: PayloadAction<TicketSocketAccount[]>) => {
      state.ticketSocketAccounts = action.payload;
      return state;
    },
    setTicketSocketEventsOnly: (state, action: PayloadAction<VipEvent[] | undefined>) => {
      state.ticketSocketEvents = action.payload;
      return state;
    },
    setTours: (state, action: PayloadAction<Tour[]>) => {
      state.tours = action.payload;
      state.reloadTours = false;
      return state;
    },
    setUploadedFile: (state, action: PayloadAction<string | undefined>) => {
      state.uploadedFile = action.payload;
      return state;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.reloadUsers = false;
      return state;
    },
    setVenueSearchTerm: (state, action: PayloadAction<string | undefined>) => {
      state.venueSearchTerm = action.payload;
      return state;
    },
    setVenues: (state, action: PayloadAction<ExternalVenue[] | undefined>) => {
      state.venues = action.payload;
      return state;
    },
  },
});

export const {
  setAdminDates,
  setAdminSellerId,
  setReloadUsers,
  setSelectedUser,
  setUsers,
  setReloadRoles,
  setSelectedRole,
  setRoles,
  resetAdmin,
  setAdminEvent,
  setAdminOrder,
  setReloadEvents,
  setAllSellers,
  setAdminEvents,
  setMustSaveEvent,
  setMustSaveOrder,
  setMustSavePage,
  setTours,
  setAdminTour,
  setReloadTours,
  setReloadSettings,
  setAllSettings,
  setReloadVenues,
  setAdminVenue,
  setVenues,
  setAdminSeller,
  setReloadSellers,
  setTicketSocketAccounts,
  setReloadPages,
  setSelectedPage,
  setSelectedPageType,
  setAllPages,
  setPageOrders,
  setPageTypes,
  setTicketSocketEventsOnly,
  setAdminOrders,
  setCountries,
  setVenueSearchTerm,
  setReloadCountries,
  setAllFaqs,
  setAllFaqCategories,
  setSelectedFaq,
  setReloadFaqs,
} = adminSelectionSlice.actions;

export default adminSelectionSlice.reducer;

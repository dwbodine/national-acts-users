import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ExternalVenue, TicketSocketAccount } from '@/types/admin';
import { Order, Seller, Tour, VipEvent } from '@/types/event';
import { FanMomentFilter } from '@/types/props';
import {
  Country,
  FanMoment,
  Faq,
  FeaturedArtist,
  Page,
  PageSeller,
  PageType,
  SiteSetting,
} from '@/types/public';

import { AdminSelection, Role, User } from '../types/user';

const initialState: AdminSelection = {
  allPageSellers: undefined,
  allSellers: undefined,
  allSettings: undefined,
  countries: undefined,
  end: undefined,
  fanFilter: undefined,
  mustSaveEvent: false,
  mustSaveOrder: false,
  mustSavePage: false,
  mustSaveFeaturedArtist: false,
  mustSaveFeaturedArtistOrder: false,
  mustSavePageOrder: false,
  pageSellerTypes: undefined,
  pageTypes: undefined,
  reloadCountries: true,
  reloadEvents: true,
  reloadFanMoments: true,
  reloadFaqs: true,
  reloadFeaturedArtists: true,
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
  selectedFeaturedArtist: undefined,
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
  uploadedFile: undefined,
  users: undefined,
  venueSearchTerm: undefined,
};

export const adminSelectionSlice = createSlice({
  initialState,
  name: 'adminSelection',
  reducers: {
    resetAdmin: (state) => {
      state.sellerId = undefined;
      state.start = undefined;
      state.end = undefined;
      state.fanFilter = undefined;
      state.reloadFaqs = true;
      state.reloadUsers = true;
      state.reloadRoles = true;
      state.reloadEvents = true;
      state.reloadFanMoments = true;
      state.reloadFeaturedArtists = true;
      state.reloadPages = true;
      state.reloadTours = true;
      state.reloadSellers = true;
      state.reloadVenues = true;
      state.selectedFanMoment = undefined;
      state.selectedFaq = undefined;
      state.selectedFeaturedArtist = undefined;
      state.selectedUser = undefined;
      state.selectedPage = undefined;
      state.selectedPageType = undefined;
      state.selectedRole = undefined;
      state.selectedEvent = undefined;
      state.selectedOrder = undefined;
      state.selectedSeller = undefined;
      state.selectedTour = undefined;
      state.selectedVenue = undefined;
      state.pageTypes = undefined;
      state.pageSellerTypes = undefined;
      state.roles = undefined;
      state.users = undefined;
      state.mustSaveEvent = false;
      state.mustSaveOrder = false;
      state.mustSavePage = false;
      state.mustSaveFeaturedArtist = false;
      state.mustSaveFeaturedArtistOrder = false;
      state.mustSavePageOrder = false;
      state.allSellers = undefined;
      state.allPageSellers = undefined;
      state.allSettings = undefined;
      state.reloadSettings = true;
      state.uploadedFile = undefined;
      state.reloadSellers = true;
      state.reloadPageSellers = true;
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
    setAdminOrder: (state, action: PayloadAction<Order | undefined>) => {
      state.selectedOrder = action.payload;
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
    setSelectedFanMoment: (state, action: PayloadAction<FanMoment | undefined>) => {
      state.selectedFanMoment = action.payload;
      return state;
    },
    setSelectedFaqCategory: (state, action: PayloadAction<number | undefined>) => {
      state.selectedFaqCategory = action.payload;
      return state;
    },
    setAllSellers: (state, action: PayloadAction<Seller[] | undefined>) => {
      state.allSellers = action.payload;
      return state;
    },
    setAllPageSellers: (state, action: PayloadAction<PageSeller[] | undefined>) => {
      state.allPageSellers = action.payload;
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
    setMustSaveFeaturedArtist: (state, action: PayloadAction<boolean>) => {
      state.mustSaveFeaturedArtist = action.payload;
      return state;
    },
    setMustSaveFeaturedArtistOrder: (state, action: PayloadAction<boolean>) => {
      state.mustSaveFeaturedArtistOrder = action.payload;
      return state;
    },
    setMustSavePageOrder: (state, action: PayloadAction<boolean>) => {
      state.mustSavePageOrder = action.payload;
      return state;
    },
    setPageSellerTypes: (state, action: PayloadAction<PageType[]>) => {
      state.pageSellerTypes = action.payload;
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
    setReloadFanMoments: (state, action: PayloadAction<boolean>) => {
      state.reloadFanMoments = action.payload;
      return state;
    },
    setReloadFeaturedArtists: (state, action: PayloadAction<boolean>) => {
      state.reloadFeaturedArtists = action.payload;
      return state;
    },
    setReloadFaqs: (state, action: PayloadAction<boolean>) => {
      state.reloadFaqs = action.payload;
      if (state.reloadFaqs) {
        state.selectedFaq = undefined;
      }
      return state;
    },
    setReloadPages: (state, action: PayloadAction<boolean>) => {
      state.reloadPages = action.payload;
      if (state.reloadPages) {
        state.selectedPage = undefined;
      }
      return state;
    },
    setReloadSellerPages: (state, action: PayloadAction<boolean>) => {
      state.reloadPageSellers = action.payload;
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
    setSelectedFeaturedArtist: (state, action: PayloadAction<FeaturedArtist>) => {
      state.selectedFeaturedArtist = action.payload;
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
    setTicketSocketAccounts: (state, action: PayloadAction<TicketSocketAccount[] | undefined>) => {
      state.ticketSocketAccounts = action.payload;
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
    setFanFilter: (state, action: PayloadAction<FanMomentFilter | undefined>) => {
      state.fanFilter = action.payload;
      return state;
    },
  },
});

export const {
  setAdminDates,
  setAdminSellerId,
  setReloadFeaturedArtists,
  setSelectedFeaturedArtist,
  setSelectedFanMoment,
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
  setAllPageSellers,
  setMustSaveEvent,
  setMustSaveOrder,
  setMustSavePage,
  setMustSaveFeaturedArtist,
  setMustSaveFeaturedArtistOrder,
  setMustSavePageOrder,
  setAdminTour,
  setReloadTours,
  setReloadSettings,
  setAllSettings,
  setReloadVenues,
  setAdminVenue,
  setAdminSeller,
  setReloadSellerPages,
  setReloadSellers,
  setTicketSocketAccounts,
  setReloadPages,
  setSelectedPage,
  setSelectedPageType,
  setPageSellerTypes,
  setPageTypes,
  setCountries,
  setSelectedFaqCategory,
  setVenueSearchTerm,
  setReloadCountries,
  setSelectedFaq,
  setReloadFaqs,
  setReloadFanMoments,
  setFanFilter,
} = adminSelectionSlice.actions;

export default adminSelectionSlice.reducer;

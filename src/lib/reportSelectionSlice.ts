import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { User, UserReportSelection, UserSeller } from '../types/user';
import { SellerType, Tour, VipEvent } from '@/types/event';

const initialState: UserReportSelection = {
  seller: {
    sellerId: 0,
    sellerName: '',
    sellerType: SellerType.Artist,
  },
  start: 0,
  end: 0,
  showDeleted: false,
  showDeletedOrders: false,
  showInactive: false,
  showInactiveOrders: false,
  reloadEvents: true,
  reloadTours: true,
  hideRevenue: false,
  hideServiceFees: true,
  currentEvents: [],
  selectedTourId: undefined,
  tours: undefined,
  currentDetailEvent: undefined,
  focusControl: '',
  showHidden: false,
  isForAdmin: false,
  showOnlyEmails: false,
  showOnlyPhones: false,
};

export const userReportSelectionSlice = createSlice({
  name: 'userReportSelection',
  initialState,
  reducers: {
    setSeller: (state, action: PayloadAction<UserSeller>) => {
      const previousSellerId = state.seller.sellerId;
      const newSellerId = action.payload.sellerId;
      if (previousSellerId != newSellerId) {
        state.seller = action.payload;
        state.reloadEvents = true;
        state.reloadTours = true;
        const currentUserStr = localStorage.getItem('currentUser') || undefined;
        if (currentUserStr) {
          let currentUser = JSON.parse(currentUserStr) as User;
          currentUser.selectedSellerId = action.payload.sellerId;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
      } else {
        state.reloadTours = false;
        state.reloadEvents = false;
      }
      state.start = 0;
      state.end = 0;
      state.showDeleted = false;
      state.showDeletedOrders = false;
      state.showInactive = false;
      state.showHidden = state.isForAdmin;
      state.showInactiveOrders = true;
      state.retainDateSelection = false;
      if (state.reloadEvents) {
        state.currentDetailEvent = undefined;
        state.currentEvents = [];
      }
      if (state.reloadTours) {
        state.tours = undefined;
        state.selectedTourId = undefined;
      }
      return state;
    },
    setEventSeller: (state, action: PayloadAction<UserReportSelection>) => {
      state.seller = action.payload.seller;
      state.hideRevenue = action.payload.hideRevenue;
      state.hideServiceFees = action.payload.hideServiceFees;
      return state;
    },
    setDateRange: (state, action: PayloadAction<UserReportSelection>) => {
      state.start = action.payload.start;
      state.end = action.payload.end;
      return state;
    },
    setShowInactive: (state, action: PayloadAction<boolean>) => {
      state.showInactive = action.payload;
      if (!state.retainDateSelection) {
        state.start = 0;
        state.end = 0;
      }
      state.reloadEvents = true;
      return state;
    },
    setShowInactiveOrders: (state, action: PayloadAction<boolean>) => {
      state.showInactiveOrders = action.payload;
      return state;
    },
    setShowDeleted: (state, action: PayloadAction<boolean>) => {
      state.showDeleted = action.payload;
      state.showInactive = state.showDeleted;
      if (!state.retainDateSelection) {
        state.start = 0;
        state.end = 0;
      }
      state.reloadEvents = true;
      return state;
    },
    setShowDeletedOrders: (state, action: PayloadAction<boolean>) => {
      state.showDeletedOrders = action.payload;
      state.showInactiveOrders = state.showDeletedOrders;
      return state;
    },
    setShowHidden: (state, action: PayloadAction<boolean>) => {
      state.showHidden = action.payload;
      if (!state.retainDateSelection) {
        state.start = 0;
        state.end = 0;
      }
      state.reloadEvents = true;
      return state;
    },
    setHideRevenue: (state, action: PayloadAction<boolean>) => {
      state.hideRevenue = action.payload;
      state.reloadEvents = false;
      if (state.hideRevenue) {
        state.hideServiceFees = true;
      }
      const currentUserStr = localStorage.getItem('currentUser') || undefined;
      if (currentUserStr) {
        let currentUser = JSON.parse(currentUserStr) as User;
        currentUser.selectedHideRevenue = action.payload;
        currentUser.selectedHideServiceFees = state.hideServiceFees;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      }
      return state;
    },
    setShowOnlyEmails: (state, action: PayloadAction<boolean>) => {
      state.showOnlyEmails = action.payload;
      state.reloadEvents = false;
      return state;
    },
    setShowOnlyPhones: (state, action: PayloadAction<boolean>) => {
      state.showOnlyPhones = action.payload;
      state.reloadEvents = false;
      return state;
    },
    setHideServiceFees: (state, action: PayloadAction<boolean>) => {
      state.hideServiceFees = action.payload;
      state.reloadEvents = false;
      const currentUserStr = localStorage.getItem('currentUser') || undefined;
      if (currentUserStr) {
        let currentUser = JSON.parse(currentUserStr) as User;
        currentUser.selectedHideServiceFees = action.payload;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      }
      return state;
    },
    setEvents: (state, action: PayloadAction<VipEvent[] | undefined>) => {
      if (action.payload) {
        state.currentEvents = action.payload;
        state.reloadEvents = false;
      } else {
        state.currentEvents = [];
        state.reloadEvents = true;
      }

      return state;
    },
    setSelectedTourId: (state, action: PayloadAction<number | undefined>) => {
      state.selectedTourId = action.payload;
      state.start = 0;
      state.end = 0;
      state.showDeleted = false;
      state.showHidden = false;
      state.showInactive = false;
      return state;
    },
    setTours: (state, action: PayloadAction<Tour[] | undefined>) => {
      state.tours = action.payload;
      state.reloadTours = false;
      return state;
    },
    setCurrentDetailEvent: (state, action: PayloadAction<VipEvent | undefined>) => {
      if (action.payload) {
        state.currentDetailEvent = action.payload;
        state.reloadEvents = false;
      } else {
        state.currentDetailEvent = undefined;
        state.reloadEvents = true;
      }
      return state;
    },
    setReloadEvents: (state, action: PayloadAction<boolean>) => {
      state.reloadEvents = action.payload;
      return state;
    },
    setFocusControl: (state, action: PayloadAction<string>) => {
      state.focusControl = action.payload;
      return state;
    },
    setForAdmin: (state, action: PayloadAction<boolean>) => {
      state.isForAdmin = action.payload;
      state.showHidden = action.payload;
      return state;
    },
    resetSelection: (state) => {
      state.start = 0;
      state.end = 0;
      state.showDeleted = false;
      state.showInactive = false;
      state.reloadEvents = true;
      state.reloadTours = true;
      state.retainDateSelection = false;
      state.currentEvents = [];
      state.currentDetailEvent = undefined;
      state.showHidden = state.isForAdmin;
      state.showOnlyEmails = false;
      state.showOnlyPhones = false;
      state.tours = undefined;
      state.selectedTourId = undefined;
      return state;
    },
    resetAll: (state) => {
      state.seller = {
        sellerId: 0,
        sellerName: '',
        sellerType: SellerType.Artist,
      };
      state.start = 0;
      state.end = 0;
      state.showDeleted = false;
      state.showInactive = false;
      state.reloadEvents = true;
      state.reloadTours = true;
      state.retainDateSelection = false;
      state.currentEvents = [];
      state.currentDetailEvent = undefined;
      state.showHidden = state.isForAdmin;
      state.showOnlyEmails = false;
      state.showOnlyPhones = false;
      state.hideRevenue = false;
      state.hideServiceFees = true;
      state.tours = undefined;
      state.selectedTourId = undefined;
      return state;
    },
  },
});

export const {
  setSeller,
  setDateRange,
  setReloadEvents,
  setShowInactive,
  setShowDeleted,
  resetSelection,
  setEvents,
  resetAll,
  setHideRevenue,
  setHideServiceFees,
  setShowInactiveOrders,
  setShowDeletedOrders,
  setFocusControl,
  setEventSeller,
  setShowHidden,
  setCurrentDetailEvent,
  setForAdmin,
  setShowOnlyEmails,
  setShowOnlyPhones,
  setTours,
  setSelectedTourId,
} = userReportSelectionSlice.actions;

export default userReportSelectionSlice.reducer;

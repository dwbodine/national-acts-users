import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ExternalVenue } from '@/types/admin';
import { Order, Tour, VipEvent } from '@/types/event';
import { Faq, FaqCategory, Page } from '@/types/public';

import { AdminDataSelection } from '../types/user';

const initialState: AdminDataSelection = {
  allFaqs: undefined,
  allPages: undefined,
  events: undefined,
  faqCategories: undefined,
  orders: undefined,
  pageOrders: undefined,
  tours: undefined,
  ticketSocketEvents: undefined,
  venues: undefined,
};

export const adminDataSelectionSlice = createSlice({
  initialState,
  name: 'adminSelection',
  reducers: {
    resetAdminData: (state) => {
      state.pageOrders = undefined;
      state.events = undefined;
      state.allPages = undefined;
      state.allFaqs = undefined;
      state.ticketSocketEvents = undefined;
      state.tours = undefined;
      state.venues = undefined;
      state.orders = undefined;
      state.faqCategories = undefined;
      return state;
    },
    setAdminEvents: (state, action: PayloadAction<VipEvent[]>) => {
      state.events = action.payload;
      return state;
    },
    setAdminOrders: (state, action: PayloadAction<Order[] | undefined>) => {
      state.orders = action.payload;
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
    setPageOrders: (state, action: PayloadAction<Page[]>) => {
      state.pageOrders = action.payload;
      return state;
    },
    setTicketSocketEventsOnly: (state, action: PayloadAction<VipEvent[] | undefined>) => {
      state.ticketSocketEvents = action.payload;
      return state;
    },
    setTours: (state, action: PayloadAction<Tour[]>) => {
      state.tours = action.payload;
      return state;
    },
    setVenues: (state, action: PayloadAction<ExternalVenue[] | undefined>) => {
      state.venues = action.payload;
      return state;
    },
  },
});

export const {
  resetAdminData,
  setAdminEvents,
  setAdminOrders,
  setAllFaqCategories,
  setAllFaqs,
  setAllPages,
  setPageOrders,
  setTicketSocketEventsOnly,
  setTours,
  setVenues,
} = adminDataSelectionSlice.actions;

export default adminDataSelectionSlice.reducer;

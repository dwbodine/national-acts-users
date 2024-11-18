import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { EventReportSelection } from '../types/user';
import { VipEvent } from '@/types/event';
import moment from 'moment';

const initialState: EventReportSelection = {
  start: moment().unix(),
  end: moment().unix() + 30 * 24 * 60 * 60,
  showDeleted: false,
  showInactive: false,
  reloadEvents: true,
  currentEvents: [],
  showHidden: false,
};

export const adminEventsSelectionSlice = createSlice({
  name: 'adminEventReportSelection',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<EventReportSelection>) => {
      state.start = action.payload.start;
      state.end = action.payload.end;
      return state;
    },
    setShowInactive: (state, action: PayloadAction<boolean>) => {
      state.showInactive = action.payload;
      state.reloadEvents = true;
      return state;
    },
    setShowDeleted: (state, action: PayloadAction<boolean>) => {
      state.showDeleted = action.payload;
      state.showInactive = state.showDeleted;
      state.reloadEvents = true;
      return state;
    },
    setShowHidden: (state, action: PayloadAction<boolean>) => {
      state.showHidden = action.payload;
      state.reloadEvents = true;
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
    setReloadEvents: (state, action: PayloadAction<boolean>) => {
      state.reloadEvents = action.payload;
      return state;
    },
    resetSelection: (state) => {
      state.start = moment().unix();
      state.end = moment().unix() + 30 * 24 * 60 * 60;
      state.showDeleted = false;
      state.showInactive = false;
      state.reloadEvents = true;
      state.currentEvents = [];
      state.showHidden = false;
      return state;
    },
    resetAllAdminEvents: (state) => {
      state.start = moment().unix();
      state.end = moment().unix() + 30 * 24 * 60 * 60;
      state.showDeleted = false;
      state.showInactive = false;
      state.reloadEvents = true;
      state.currentEvents = [];
      state.showHidden = false;
      return state;
    },
  },
});

export const {
  setDateRange,
  setReloadEvents,
  setShowInactive,
  setShowDeleted,
  resetSelection,
  setEvents,
  resetAllAdminEvents,
  setShowHidden,
} = adminEventsSelectionSlice.actions;

export default adminEventsSelectionSlice.reducer;

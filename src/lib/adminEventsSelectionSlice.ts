import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { EventReportSelection } from '../types/user';
import { Note, VipEvent } from '@/types/event';
import moment from 'moment';

const initialState: EventReportSelection = {
  start: moment().startOf('week').add(1, 'day').startOf('day').unix(),
  end: moment().startOf('week').add(7, 'days').startOf('day').unix(),
  showDeleted: false,
  showInactive: false,
  reloadEvents: true,
  currentEvents: [],
  notes: [],
  expandedRow: undefined,
  showHidden: false,
  focusControl: '',
};

export const adminEventsSelectionSlice = createSlice({
  name: 'adminEventReportSelection',
  initialState,
  reducers: {
    setAdminDateRange: (state, action: PayloadAction<EventReportSelection>) => {
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
    setAdminEvents: (state, action: PayloadAction<VipEvent[] | undefined>) => {
      if (action.payload) {
        state.currentEvents = action.payload;
        state.reloadEvents = false;
      } else {
        state.currentEvents = [];
        state.reloadEvents = true;
      }

      return state;
    },
    setAdminNotes: (state, action: PayloadAction<Note[] | undefined>) => {
      state.notes = action.payload ?? [];
      return state;
    },
    setReloadAdminEvents: (state, action: PayloadAction<boolean>) => {
      state.reloadEvents = action.payload;
      return state;
    },
    setExpandedRow: (state, action: PayloadAction<number | undefined>) => {
      state.expandedRow = action.payload;
      return state;
    },
    setFocusControl: (state, action: PayloadAction<string>) => {
      state.focusControl = action.payload;
      return state;
    },
    resetAdminSelection: (state) => {
      state.start = moment().startOf('week').add(1, 'day').startOf('day').unix();
      state.end = moment().startOf('week').add(7, 'days').endOf('day').unix();
      state.showDeleted = false;
      state.showInactive = false;
      state.reloadEvents = true;
      state.currentEvents = [];
      state.showHidden = false;
      state.expandedRow = undefined;
      state.focusControl = '';
      return state;
    },
    resetAllAdminEvents: (state) => {
      state.start = moment().startOf('week').add(1, 'day').startOf('day').unix();
      state.end = moment().startOf('week').add(7, 'days').endOf('day').unix();
      state.showDeleted = false;
      state.showInactive = false;
      state.reloadEvents = true;
      state.currentEvents = [];
      state.showHidden = false;
      state.expandedRow = undefined;
      state.focusControl = '';
      return state;
    },
  },
});

export const {
  setAdminDateRange,
  setReloadAdminEvents,
  setShowInactive,
  setShowDeleted,
  resetAdminSelection,
  setAdminEvents,
  resetAllAdminEvents,
  setShowHidden,
  setExpandedRow,
  setFocusControl,
  setAdminNotes,
} = adminEventsSelectionSlice.actions;

export default adminEventsSelectionSlice.reducer;

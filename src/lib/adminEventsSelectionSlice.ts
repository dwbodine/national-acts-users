import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { DateRange, EventReportSelection, EventTabView } from '../types/user';
import { Note, VipEvent } from '@/types/event';

const initialState: EventReportSelection = {
  start: undefined,
  end: undefined,
  showDeleted: false,
  showInactive: false,
  reloadEvents: true,
  currentEvents: undefined,
  notes: [],
  expandedRow: undefined,
  showHidden: false,
  focusControl: '',
  expandedEvent: undefined,
  updateListStatus: false,
  eventTabView: undefined,
};

export const adminEventsSelectionSlice = createSlice({
  name: 'adminEventReportSelection',
  initialState,
  reducers: {
    setActiveEventTab: (state, action: PayloadAction<EventTabView>) => {
      state.eventTabView = action.payload;
      return state;
    },
    setAdminDateRange: (state, action: PayloadAction<DateRange>) => {
      state.start = action.payload.start;
      state.end = action.payload.end;
      state.currentEvents = undefined;
      state.reloadEvents = true;
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
      state.currentEvents = action.payload;
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
    setExpandedEvent: (state, action: PayloadAction<VipEvent | undefined>) => {
      state.expandedEvent = action.payload;
      return state;
    },
    setFocusControl: (state, action: PayloadAction<string>) => {
      state.focusControl = action.payload;
      return state;
    },
    setUpdateListStatus: (state, action: PayloadAction<boolean>) => {
      state.updateListStatus = action.payload;
      return state;
    },
    resetAdminSelection: (state) => {
      state.start = undefined;
      state.end = undefined;
      state.eventTabView = undefined;
      state.showDeleted = false;
      state.showInactive = false;
      state.reloadEvents = true;
      state.currentEvents = undefined;
      state.showHidden = false;
      state.expandedRow = undefined;
      state.expandedEvent = undefined;
      state.focusControl = '';
      state.updateListStatus = false;
      return state;
    },
    resetAllAdminEvents: (state) => {
      state.start = undefined;
      state.end = undefined;
      state.eventTabView = undefined;
      state.showDeleted = false;
      state.showInactive = false;
      state.reloadEvents = true;
      state.currentEvents = undefined;
      state.showHidden = false;
      state.expandedRow = undefined;
      state.expandedEvent = undefined;
      state.focusControl = '';
      state.updateListStatus = false;
      return state;
    },
  },
});

export const {
  setAdminDateRange,
  setActiveEventTab,
  setReloadAdminEvents,
  setShowInactive,
  setShowDeleted,
  resetAdminSelection,
  setAdminEvents,
  resetAllAdminEvents,
  setShowHidden,
  setExpandedRow,
  setExpandedEvent,
  setFocusControl,
  setAdminNotes,
  setUpdateListStatus,
} = adminEventsSelectionSlice.actions;

export default adminEventsSelectionSlice.reducer;

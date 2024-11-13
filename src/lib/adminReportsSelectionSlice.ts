import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AdminReportsSelection, AdminSelection, Role, User } from '../types/user';
import moment from 'moment';

const initialState: AdminReportsSelection = {
  start: moment().unix(),
  end: moment().unix() + 86400,
  reloadData: false,
};

export const adminReportsSelectionSlice = createSlice({
  name: 'adminReportsSelection',
  initialState,
  reducers: {
    setReportDates: (state, action: PayloadAction<AdminReportsSelection>) => {
      state.start = action.payload.start;
      state.end = action.payload.end;
      return state;
    },
    setReloadReportData: (state, action: PayloadAction<boolean>) => {
      state.reloadData = true;
      return state;
    },
    resetAdminReports: (state) => {
      state.start = moment().unix();
      state.end = moment().unix();
      state.reloadData = false;
      return state;
    },
  },
});

export const { setReportDates, setReloadReportData, resetAdminReports } =
  adminReportsSelectionSlice.actions;

export default adminReportsSelectionSlice.reducer;

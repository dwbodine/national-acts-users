import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AdminReportsSelection } from '../types/user';
import moment from 'moment';

const initialState: AdminReportsSelection = {
  end: moment().unix() + 86400,
  reloadData: true,
  start: moment().unix(),
};

export const adminReportsSelectionSlice = createSlice({
  initialState,
  name: 'adminReportsSelection',
  reducers: {
    resetAdminReports: (state) => {
      state.start = moment().unix();
      state.end = moment().unix();
      state.reloadData = true;
      return state;
    },
    setReloadReportData: (state, action: PayloadAction<boolean>) => {
      state.reloadData = action.payload;
      return state;
    },
    setReportDates: (state, action: PayloadAction<AdminReportsSelection>) => {
      state.start = action.payload.start;
      state.end = action.payload.end;
      return state;
    },
  },
});

export const { setReportDates, setReloadReportData, resetAdminReports } =
  adminReportsSelectionSlice.actions;

export default adminReportsSelectionSlice.reducer;
